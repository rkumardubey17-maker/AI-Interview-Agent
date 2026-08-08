import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// ======================================================
// HELPER: GEMINI JSON RESPONSE PARSER
// ======================================================

const parseGeminiJson = (text) => {

    if (!text) {
        throw new Error("Gemini returned empty response");
    }

    let cleaned = text.trim();

    // Remove markdown code fences if Gemini returns them
    cleaned = cleaned
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();


    // Find JSON object

    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");


    if (
        firstBrace === -1 ||
        lastBrace === -1 ||
        lastBrace <= firstBrace
    ) {
        throw new Error("No valid JSON object found");
    }


    cleaned = cleaned.substring(
        firstBrace,
        lastBrace + 1
    );


    return JSON.parse(cleaned);
};


// ======================================================
// EVALUATE ONE CANDIDATE ANSWER
// ======================================================

const evaluateAnswer = async ({
    question,
    answer,
    topic
}) => {

    const prompt = `
You are a professional technical interviewer.

Evaluate the candidate's answer to the question below.

QUESTION:
${question}

CANDIDATE ANSWER:
${answer}

TOPIC:
${topic}

Evaluate:

1. Technical correctness
2. Relevance
3. Completeness
4. Depth of understanding
5. Clarity
6. Practical understanding
7. Missing important concepts

Give a score from 0 to 10.

Score guidelines:

9-10 = Excellent
8-8.9 = Very good
7-7.9 = Good
6-6.9 = Acceptable but incomplete
4-5.9 = Partially correct
2-3.9 = Weak
0-1.9 = Incorrect

The feedback should sound like a real technical interviewer.

Examples:

"Excellent explanation."

"Very good. You correctly explained..."

"Good answer, but you missed..."

"Partially correct. You should also consider..."

"This answer needs improvement because..."

Do not unnecessarily penalize the candidate.

Do not give a high score when the answer
contains major technical errors.

Return ONLY a JSON object.

Do not use markdown.
Do not add any text before or after the JSON.

Use exactly this structure:

{
    "score": 7.5,
    "feedback": "Good answer, but some important details are missing.",
    "correctPoints": [
        "Correct point 1",
        "Correct point 2"
    ],
    "missingPoints": [
        "Missing concept 1"
    ],
    "improvement": "Explain the missing concepts in more detail."
}
`;


    const response =
        await ai.models.generateContent({

            model: "gemini-3.6-flash",

            contents: prompt,

            config: {
                responseMimeType: "application/json"
            }

        });


    const text =
        response.text?.trim();


    console.log(
        "\n========== GEMINI EVALUATION RAW RESPONSE =========="
    );

    console.log(text);

    console.log(
        "=====================================================\n"
    );


    try {

        const result =
            parseGeminiJson(text);


        let score =
            Number(result.score);


        if (Number.isNaN(score)) {
            score = 0;
        }


        score = Math.max(
            0,
            Math.min(10, score)
        );


        const feedback =
            typeof result.feedback === "string"
                ? result.feedback
                : "Answer evaluated successfully.";


        let correctPoints =
            result.correctPoints;


        if (!Array.isArray(correctPoints)) {

            correctPoints =
                correctPoints
                    ? [String(correctPoints)]
                    : [];

        }


        let missingPoints =
            result.missingPoints;


        if (!Array.isArray(missingPoints)) {

            missingPoints =
                missingPoints
                    ? [String(missingPoints)]
                    : [];

        }


        const improvement =
            typeof result.improvement === "string"
                ? result.improvement
                : "Try to provide a more detailed technical explanation.";


        return {

            score,

            feedback,

            correctPoints,

            missingPoints,

            improvement

        };

    } catch (error) {

        console.error(
            "Evaluation parsing error:",
            error.message
        );

        console.error(
            "Gemini raw response:",
            text
        );

        throw new Error(
            "Gemini generated invalid answer evaluation"
        );

    }

};


// ======================================================
// GENERATE FINAL INTERVIEW FEEDBACK
// ======================================================

const generateInterviewFeedback = async (
    session
) => {

    const prompt = `
You are an expert technical interviewer.

Analyze the candidate's complete technical interview.

CANDIDATE:
${JSON.stringify(session.candidate, null, 2)}

INTERVIEW CONVERSATION:
${JSON.stringify(session.conversationHistory, null, 2)}

QUESTIONS ASKED:
${session.questionsAsked}

CURRICULUM DAYS COVERED:
${JSON.stringify(session.daysCovered)}

Provide a final technical interview assessment.

Calculate an overall score from 0 to 100.

Consider:

1. Technical correctness
2. Depth of understanding
3. Explanation ability
4. Reasoning
5. Completeness
6. Practical understanding
7. Consistency across answers

Identify:

- Overall performance
- Technical strengths
- Weaknesses
- Knowledge gaps
- Specific improvements
- Recommended next learning steps

Return ONLY a JSON object.

Do not use markdown.
Do not add any text before or after the JSON.

Use exactly this structure:

{
    "overallScore": 82,
    "summary": "Overall assessment of the candidate.",
    "strengths": [
        "Strength 1",
        "Strength 2"
    ],
    "weaknesses": [
        "Weakness 1",
        "Weakness 2"
    ],
    "gaps": [
        "Knowledge gap 1",
        "Knowledge gap 2"
    ],
    "next": [
        "Recommendation 1",
        "Recommendation 2"
    ]
}
`;


    const response =
        await ai.models.generateContent({

            model: "gemini-3.6-flash",

            contents: prompt,

            config: {
                responseMimeType:
                    "application/json"
            }

        });


    const text =
        response.text?.trim();


    console.log(
        "\n========== FINAL FEEDBACK RAW RESPONSE =========="
    );

    console.log(text);

    console.log(
        "==================================================\n"
    );


    try {

        const result =
            parseGeminiJson(text);


        let overallScore =
            Number(result.overallScore);


        if (Number.isNaN(overallScore)) {
            overallScore = 0;
        }


        overallScore = Math.max(
            0,
            Math.min(100, overallScore)
        );


        const summary =
            typeof result.summary === "string"
                ? result.summary
                : "Interview completed successfully.";


        let strengths =
            result.strengths;


        if (!Array.isArray(strengths)) {

            strengths =
                strengths
                    ? [String(strengths)]
                    : [];

        }


        let weaknesses =
            result.weaknesses;


        if (!Array.isArray(weaknesses)) {

            weaknesses =
                weaknesses
                    ? [String(weaknesses)]
                    : [];

        }


        let gaps =
            result.gaps;


        if (!Array.isArray(gaps)) {

            gaps =
                gaps
                    ? [String(gaps)]
                    : [];

        }


        let next =
            result.next;


        if (!Array.isArray(next)) {

            next =
                next
                    ? [String(next)]
                    : [];

        }


        return {

            overallScore,

            summary,

            strengths,

            weaknesses,

            gaps,

            next

        };

    } catch (error) {

        console.error(
            "Final feedback parsing error:",
            error.message
        );

        console.error(
            "Gemini raw response:",
            text
        );

        throw new Error(
            "Gemini generated invalid final feedback"
        );

    }

};


export {
    evaluateAnswer,
    generateInterviewFeedback
};
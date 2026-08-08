import {
    generateAIResponse
} from "./ai.service.js";


// ======================================================
// PARSE AI JSON
// ======================================================

const parseAIJson = (text) => {

    if (!text) {
        throw new Error("AI returned empty response");
    }

    let cleaned = String(text).trim();

    // Remove markdown code fences
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
        throw new Error("AI did not return valid JSON");
    }

    cleaned = cleaned.substring(
        firstBrace,
        lastBrace + 1
    );

    // First normal JSON parse
    try {
        return JSON.parse(cleaned);
    } catch (error) {

        console.error(
            "First JSON parse failed:",
            error.message
        );

        console.error(
            "Raw AI response:",
            cleaned
        );

        // Try removing common problematic control characters
        const repaired = cleaned
            .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
            .trim();

        try {
            return JSON.parse(repaired);
        } catch (secondError) {

            console.error(
                "Second JSON parse failed:",
                secondError.message
            );

            throw new Error(
                "AI returned malformed JSON"
            );

        }
    }
};


// ======================================================
// EVALUATE ANSWER
// ======================================================

const evaluateAnswer = async ({
    question,
    answer,
    topic
}) => {

    const systemPrompt = `
You are a professional technical interviewer.

Evaluate the candidate answer fairly.

Return ONLY valid JSON.

Do not use markdown.

The score MUST be between 0 and 10.

Use this exact structure:

{
    "score": 7.5,
    "feedback": "Good answer but some details are missing.",
    "correctPoints": [
        "Correct point"
    ],
    "missingPoints": [
        "Missing point"
    ],
    "improvement": "Explain what the candidate should improve."
}

Scoring guidelines:

0-2   = Very poor
3-4   = Poor
5-6   = Average
7     = Good
8     = Very good
9     = Excellent
10    = Outstanding

Evaluate based on:

1. Technical correctness
2. Relevance
3. Completeness
4. Depth
5. Clarity
6. Practical understanding
7. Reasoning
8. Missing concepts

Do not give marks for concepts that were not actually
present in the candidate's answer.

Be fair and consistent.
`;


    const userPrompt = `
QUESTION:

${question}


CANDIDATE ANSWER:

${answer}


TOPIC:

${topic}


Evaluate the candidate's answer.

The feedback should sound like a real technical interviewer.

Mention specifically:

- What was correct
- What was missing
- What could be improved
`;


    const text =
        await generateAIResponse({

            systemPrompt,

            userPrompt

        });


    console.log(
        "\n========== AI EVALUATION =========="
    );

    console.log(text);

    console.log(
        "===================================\n"
    );


    try {

        const result =
            parseAIJson(text);


        let score =
            Number(result.score);


        if (Number.isNaN(score)) {

            score = 0;

        }


        // Keep score between 0 and 10

        score =
            Math.max(
                0,
                Math.min(
                    10,
                    score
                )
            );


        return {

            score,

            feedback:
                typeof result.feedback === "string"
                    ? result.feedback
                    : "Answer evaluated successfully.",

            correctPoints:
                Array.isArray(
                    result.correctPoints
                )
                    ? result.correctPoints
                    : [],

            missingPoints:
                Array.isArray(
                    result.missingPoints
                )
                    ? result.missingPoints
                    : [],

            improvement:
                typeof result.improvement === "string"
                    ? result.improvement
                    : "Try to provide a more detailed explanation."

        };

    } catch (error) {

        console.error(
            "Evaluation parsing error:",
            error.message
        );


        console.error(
            "AI response:",
            text
        );


        throw new Error(
            "AI generated invalid answer evaluation"
        );

    }

};


// ======================================================
// CALCULATE INTERVIEW SCORE
// ======================================================

const calculateInterviewScore = (
    session
) => {

    const evaluations = [];


    for (
        const item
        of session.conversationHistory
    ) {

        if (
            item.role !== "candidate"
        ) {

            continue;

        }


        if (
            !item.evaluation
        ) {

            continue;

        }


        const score =
            Number(
                item.evaluation.score
            );


        if (
            Number.isNaN(score)
        ) {

            continue;

        }


        evaluations.push({

            score:
                Math.max(
                    0,
                    Math.min(
                        10,
                        score
                    )
                ),

            question:
                item.question || null,

            answer:
                item.message || ""

        });

    }


    // ------------------------------------------
    // NO EVALUATIONS
    // ------------------------------------------

    if (
        evaluations.length === 0
    ) {

        return {

            totalMarks: 0,

            maxMarks: 0,

            percentage: 0,

            averageScore: 0,

            questionCount: 0,

            questionWiseScores: []

        };

    }


    // ------------------------------------------
    // TOTAL SCORE
    // ------------------------------------------

    const totalMarks =
        evaluations.reduce(
            (
                total,
                item
            ) =>
                total + item.score,
            0
        );


    const questionCount =
        evaluations.length;


    const maxMarks =
        questionCount * 10;


    const averageScore =
        totalMarks /
        questionCount;


    const percentage =
        (
            totalMarks /
            maxMarks
        ) * 100;


    return {

        totalMarks:
            Number(
                totalMarks.toFixed(2)
            ),

        maxMarks,

        percentage:
            Number(
                percentage.toFixed(2)
            ),

        averageScore:
            Number(
                averageScore.toFixed(2)
            ),

        questionCount,

        questionWiseScores:
            evaluations.map(
                (
                    item,
                    index
                ) => ({

                    questionNumber:
                        index + 1,

                    score:
                        item.score,

                    maxScore: 10

                })
            )

    };

};


// ======================================================
// PERFORMANCE LEVEL
// ======================================================

const getPerformanceLevel = (
    percentage
) => {

    if (
        percentage >= 90
    ) {

        return "Outstanding";

    }


    if (
        percentage >= 80
    ) {

        return "Excellent";

    }


    if (
        percentage >= 70
    ) {

        return "Very Good";

    }


    if (
        percentage >= 60
    ) {

        return "Good";

    }


    if (
        percentage >= 50
    ) {

        return "Average";

    }


    if (
        percentage >= 40
    ) {

        return "Needs Improvement";

    }


    return "Poor";

};


// ======================================================
// FINAL INTERVIEW FEEDBACK
// ======================================================

const generateInterviewFeedback = async (
    session
) => {

    // ------------------------------------------
    // CALCULATE MARKS LOCALLY
    // ------------------------------------------

    const scoreData =
        calculateInterviewScore(
            session
        );


    const performanceLevel =
        getPerformanceLevel(
            scoreData.percentage
        );


    // ------------------------------------------
    // SYSTEM PROMPT
    // ------------------------------------------

    const systemPrompt = `
You are an expert technical interviewer.

Analyze the candidate's complete interview.

The numerical marks have already been calculated
by the backend.

DO NOT calculate or change the numerical score.

Return ONLY valid JSON.

Use exactly this structure:

{
    "summary": "Overall assessment.",
    "strengths": [
        "Strength"
    ],
    "weaknesses": [
        "Weakness"
    ],
    "gaps": [
        "Knowledge gap"
    ],
    "next": [
        "Recommended improvement"
    ]
}

Focus on:

- Technical correctness
- Depth
- Explanation
- Reasoning
- Completeness
- Practical understanding
- Consistency
- Repeated knowledge gaps
- Areas needing improvement

Be specific and evidence-based.

Do not invent weaknesses that are not supported
by the interview history.
`;


    // ------------------------------------------
    // USER PROMPT
    // ------------------------------------------

    const userPrompt = `
CANDIDATE:

${JSON.stringify(
    session.candidate,
    null,
    2
)}


INTERVIEW HISTORY:

${JSON.stringify(
    session.conversationHistory,
    null,
    2
)}


QUESTIONS ASKED:

${session.questionsAsked}


DAYS COVERED:

${JSON.stringify(
    session.daysCovered
)}


BACKEND CALCULATED SCORE:

Total Marks:
${scoreData.totalMarks}

Maximum Marks:
${scoreData.maxMarks}

Percentage:
${scoreData.percentage}%

Average Score:
${scoreData.averageScore}/10

Performance Level:
${performanceLevel}


QUESTION-WISE SCORES:

${JSON.stringify(
    scoreData.questionWiseScores,
    null,
    2
)}


Analyze the complete interview and provide:

1. Overall summary
2. Strongest areas
3. Weakest areas
4. Knowledge gaps
5. Specific recommendations for improvement

Do not change or recalculate the backend score.
`;


    // ------------------------------------------
    // AI FINAL ANALYSIS
    // ------------------------------------------

    const text =
        await generateAIResponse({

            systemPrompt,

            userPrompt

        });


    console.log(
        "\n========== FINAL FEEDBACK =========="
    );

    console.log(text);

    console.log(
        "====================================\n"
    );


    try {

        const result =
            parseAIJson(text);


        // ------------------------------------------
        // FINAL RESULT
        // ------------------------------------------

        return {

            // Numerical result from backend

            totalMarks:
                scoreData.totalMarks,

            maxMarks:
                scoreData.maxMarks,

            percentage:
                scoreData.percentage,

            averageScore:
                scoreData.averageScore,

            performanceLevel,

            questionCount:
                scoreData.questionCount,

            questionWiseScores:
                scoreData.questionWiseScores,


            // AI-generated qualitative feedback

            summary:
                typeof result.summary === "string"
                    ? result.summary
                    : "Interview completed.",

            strengths:
                Array.isArray(
                    result.strengths
                )
                    ? result.strengths
                    : [],

            weaknesses:
                Array.isArray(
                    result.weaknesses
                )
                    ? result.weaknesses
                    : [],

            gaps:
                Array.isArray(
                    result.gaps
                )
                    ? result.gaps
                    : [],

            next:
                Array.isArray(
                    result.next
                )
                    ? result.next
                    : []

        };

    } catch (error) {

        console.error(
            "Final feedback parsing error:",
            error.message
        );


        console.error(
            "AI response:",
            text
        );


        throw new Error(
            "AI generated invalid final feedback"
        );

    }

};


// ======================================================
// EXPORTS
// ======================================================

export {

    evaluateAnswer,

    generateInterviewFeedback

};
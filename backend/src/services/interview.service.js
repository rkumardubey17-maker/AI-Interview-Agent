import curriculum from "../data/curriculum.json" with {
    type: "json"
};

import {
    generateAIResponse
} from "./ai.service.js";


// ======================================================
// CANDIDATE CONTEXT
// ======================================================

const getCandidateContext = (candidate) => {

    const completedMissions =
        candidate.missions?.filter(
            (mission) =>
                mission.passed === true
        ) || [];


    const skippedMissions =
        candidate.missions?.filter(
            (mission) =>
                mission.skipped === true
        ) || [];


    return {
        member: candidate.member,

        completedMissions,

        skippedMissions,

        signals:
            candidate.signals || {}
    };
};


// ======================================================
// RELEVANT CURRICULUM
// ======================================================

const getRelevantCurriculum = (candidate) => {

    const completedDays =
        candidate.missions
            ?.filter(
                (mission) =>
                    mission.passed === true
            )
            .map(
                (mission) =>
                    Number(mission.day)
            ) || [];


    return curriculum.days.filter(
        (day) =>
            completedDays.includes(
                Number(day.day)
            )
    );
};


// ======================================================
// BUILD INTERVIEW CONTEXT
// ======================================================

const buildInterviewContext = (
    candidate,
    history = [],
    coveredDays = []
) => {

    const candidateContext =
        getCandidateContext(candidate);


    const relevantCurriculum =
        getRelevantCurriculum(candidate);


    const normalizedCoveredDays =
        coveredDays.map(
            (day) => Number(day)
        );


    /*
     * IMPORTANT:
     *
     * Same curriculum day can have multiple questions.
     *
     * Example:
     *
     * Day 11 -> Q1
     * Day 11 -> Q2
     * Day 12 -> Q3
     *
     * Therefore we DO NOT remove covered days
     * from available curriculum.
     */

    const availableDays =
        relevantCurriculum;


    return {

        candidate:
            candidateContext,

        curriculum:
            relevantCurriculum,

        conversationHistory:
            history,

        coveredDays:
            normalizedCoveredDays,

        availableDays

    };
};


// ======================================================
// EXTRACT JSON OBJECT FROM AI RESPONSE
// ======================================================

const extractJsonObject = (text) => {

    if (!text) {

        throw new Error(
            "AI returned empty response"
        );

    }


    let cleaned =
        String(text).trim();


    // Remove markdown code fences

    cleaned =
        cleaned
            .replace(
                /^```json\s*/i,
                ""
            )
            .replace(
                /^```javascript\s*/i,
                ""
            )
            .replace(
                /^```\s*/i,
                ""
            )
            .replace(
                /\s*```$/i,
                ""
            )
            .trim();


    // Find JSON object

    const firstBrace =
        cleaned.indexOf("{");


    const lastBrace =
        cleaned.lastIndexOf("}");


    if (
        firstBrace === -1 ||
        lastBrace === -1 ||
        lastBrace <= firstBrace
    ) {

        throw new Error(
            "No JSON object found in AI response"
        );

    }


    const jsonText =
        cleaned.substring(
            firstBrace,
            lastBrace + 1
        );


    return JSON.parse(jsonText);
};


// ======================================================
// GENERATE NEXT INTERVIEW QUESTION
// ======================================================

const getNextQuestion = async (
    context
) => {

    // ------------------------------------------
    // SAFETY CHECK
    // ------------------------------------------

    if (
        !context.availableDays ||
        context.availableDays.length === 0
    ) {

        throw new Error(
            "No curriculum available for this candidate"
        );

    }


    // ------------------------------------------
    // SYSTEM PROMPT
    // ------------------------------------------

    const systemPrompt = `
You are an adaptive technical interviewer.

Your task is to generate exactly ONE next
interview question.

IMPORTANT RULES:

1. Ask only ONE question.

2. Do NOT repeat an exact question that was
   already asked.

3. You MAY ask multiple questions from the
   same curriculum day.

4. The interview has a fixed number of questions.
   Do not stop just because a curriculum day
   has already been covered.

5. Use only the provided curriculum.

6. Consider the candidate's previous answers
   and evaluations.

7. If the candidate performs well, gradually
   increase the difficulty.

8. If the candidate performs poorly, ask a
   simpler follow-up question to test the
   missing concept.

9. Prefer topics that have not been explored
   sufficiently in previous questions.

10. Do not explain your reasoning.

11. Do not return markdown.

12. Return ONLY a JSON object.

Required JSON format:

{
    "question": "Your interview question",
    "day": 11,
    "topic": "RAG",
    "questionType": "technical"
}

Allowed questionType values:

technical
conceptual
practical
debugging
scenario
`;


    // ------------------------------------------
    // USER PROMPT
    // ------------------------------------------

    const userPrompt = `
CANDIDATE:

${JSON.stringify(
    context.candidate,
    null,
    2
)}


RELEVANT CURRICULUM:

${JSON.stringify(
    context.curriculum,
    null,
    2
)}


AVAILABLE CURRICULUM DAYS:

${JSON.stringify(
    context.availableDays,
    null,
    2
)}


DAYS ALREADY COVERED:

${JSON.stringify(
    context.coveredDays,
    null,
    2
)}


CONVERSATION HISTORY:

${JSON.stringify(
    context.conversationHistory,
    null,
    2
)}


IMPORTANT:

The interview can ask multiple questions
from the same day.

Do NOT repeat an exact question already
present in conversationHistory.

Generate the next best technical
interview question.
`;


    // ------------------------------------------
    // AI CALL
    // ------------------------------------------

    const text = await generateAIResponse({ systemPrompt, userPrompt });

    // ------------------------------------------
    // DEBUG LOG
    // ------------------------------------------

    console.log(
        "\n========== OPENROUTER QUESTION RESPONSE =========="
    );

    console.log(text);

    console.log(
        "====================================================\n"
    );


    try {

        const result =
            extractJsonObject(text);


        // ==========================================
        // VALIDATE QUESTION
        // ==========================================

        if (
            typeof result.question !== "string" ||
            result.question.trim() === ""
        ) {

            throw new Error(
                "AI did not provide a valid question"
            );

        }


        // ==========================================
        // VALIDATE DAY
        // ==========================================

        let selectedDay =
            Number(result.day);


        // ==========================================
        // AVAILABLE DAY NUMBERS
        // ==========================================

        const availableDayNumbers =
            context.availableDays.map(
                (day) =>
                    Number(day.day)
            );


        // ==========================================
        // INVALID DAY FALLBACK
        // ==========================================

        if (
            Number.isNaN(selectedDay) ||
            !availableDayNumbers.includes(
                selectedDay
            )
        ) {

            console.warn(
                `AI selected invalid day: ${result.day}`
            );


            console.warn(
                `Available days: ${availableDayNumbers.join(", ")}`
            );


            /*
             * Instead of crashing the interview,
             * automatically use the first valid
             * curriculum day.
             */

            selectedDay =
                availableDayNumbers[0];

        }


        // ==========================================
        // QUESTION TYPE
        // ==========================================

        const allowedTypes = [

            "technical",

            "conceptual",

            "practical",

            "debugging",

            "scenario"

        ];


        let questionType =
            String(
                result.questionType ||
                "technical"
            ).toLowerCase();


        if (
            !allowedTypes.includes(
                questionType
            )
        ) {

            questionType =
                "technical";

        }


        // ==========================================
        // TOPIC
        // ==========================================

        let topic =
            result.topic;


        if (
            typeof topic !== "string" ||
            topic.trim() === ""
        ) {

            topic =
                "Technical";

        }


        // ==========================================
        // DUPLICATE QUESTION CHECK
        // ==========================================

        const normalizedQuestion =
            result.question
                .trim()
                .toLowerCase();


        const alreadyAsked =
            context.conversationHistory.some(
                (item) => {

                    if (
                        item.role !== "assistant"
                    ) {

                        return false;

                    }


                    if (
                        typeof item.message !==
                        "string"
                    ) {

                        return false;

                    }


                    return (
                        item.message
                            .trim()
                            .toLowerCase() ===
                        normalizedQuestion
                    );

                }
            );


        if (alreadyAsked) {

            console.warn(
                "AI generated a duplicate question."
            );

            /*
             * We don't crash the interview here.
             *
             * The AI has already seen the conversation
             * history, so normally this should be rare.
             *
             * Returning it is safer than crashing the
             * entire interview.
             */

        }


        // ==========================================
        // FINAL RESULT
        // ==========================================

        return {

            question:
                result.question.trim(),

            day:
                selectedDay,

            topic:
                topic.trim(),

            questionType

        };

    } catch (error) {

        console.error(
            "\n========== QUESTION PARSING ERROR =========="
        );


        console.error(
            error.message
        );


        console.error(
            "\nRAW OPENROUTER RESPONSE:"
        );


        console.error(
            text
        );


        console.error(
            "=============================================\n"
        );


        throw new Error(
            "AI generated invalid interview question"
        );

    }

};


// ======================================================
// EXPORTS
// ======================================================

export {

    getCandidateContext,

    getRelevantCurriculum,

    buildInterviewContext,

    getNextQuestion

};
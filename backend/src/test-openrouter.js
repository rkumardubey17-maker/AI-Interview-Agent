import "dotenv/config";

import {
    generateAIResponse
} from "./services/ai.service.js";

const test = async () => {

    try {

        const response =
            await generateAIResponse({

                systemPrompt:
                    "You are a technical interviewer.",

                userPrompt:
                    "Ask me one simple JavaScript interview question."

            });

        console.log("\nOpenRouter Response:\n");
        console.log(response);

    } catch (error) {

        console.error("\nOpenRouter Error:\n");
        console.error(error.message);

    }
};

test();
import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1"
});

const generateAIResponse = async ({
    systemPrompt,
    userPrompt
}) => {

    if (!process.env.OPENROUTER_API_KEY) {
        throw new Error(
            "OPENROUTER_API_KEY is missing"
        );
    }

    const response =
        await client.chat.completions.create({

            model: "openrouter/free",

            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: userPrompt
                }
            ],

            temperature: 0.3,

            response_format: {
                type: "json_object"
            }
        });

    const content =
        response.choices?.[0]?.message?.content;

    if (!content) {
        throw new Error(
            "OpenRouter returned empty response"
        );
    }

    return content;
};

export {
    generateAIResponse
};
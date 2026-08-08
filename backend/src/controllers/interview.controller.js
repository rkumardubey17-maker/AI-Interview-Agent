import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { InterviewSession } from "../models/InterviewSession.model.js";

const interview = asyncHandler(async (req, res) => {

    const { sessionId, candidate, message } = req.body;

    // Check sessionId
    if (!sessionId) {
        throw new ApiError(400, "sessionId is required");
    }

    // Check whether this session already exists
    let session = await InterviewSession.findOne({ sessionId });

    // First request -> create new interview
    if (!session) {

        if (!candidate) {
            throw new ApiError(400, "candidate is required");
        }

        session = await InterviewSession.create({
            sessionId,
            candidate,
            conversationHistory: [],
            questionsAsked: 0,
            daysCovered: [],
            currentQuestion: "",
            completed: false
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    reply: "Welcome. Let's begin your interview.",
                    done: false
                },
                "Interview started successfully"
            )
        );
    }

    // Subsequent request -> candidate sends answer
    if (!message) {
        throw new ApiError(400, "message is required");
    }

    session.conversationHistory.push({
        role: "candidate",
        message
    });

    await session.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                reply: "Answer received. Processing your next question.",
                done: false
            },
            "Interview updated successfully"
        )
    );
});

export {
    interview
};
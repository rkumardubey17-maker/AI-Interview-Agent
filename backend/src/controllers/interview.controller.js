import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { InterviewSession } from "../models/InterviewSession.model.js";
import curriculum from "../data/curriculum.json" with { type: "json" };
import { generateInterviewQuestion } from "./gemini.service.js";

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



const getCandidateContext = (candidate) => {

    const completedMissions = candidate.missions?.filter(
        (mission) => mission.passed === true
    ) || [];

    const skippedMissions = candidate.missions?.filter(
        (mission) => mission.passed === false
    ) || [];

    return {
        member: candidate.member,

        completedMissions,

        skippedMissions,

        signals: candidate.signals || {}
    };
};


const getRelevantCurriculum = (candidate) => {

    const completedDays = candidate.missions
        ?.filter((mission) => mission.passed === true)
        .map((mission) => mission.day) || [];

    return curriculum.filter((day) =>
        completedDays.includes(day.day)
    );
};


const buildInterviewContext = (candidate, history = []) => {

    const candidateContext = getCandidateContext(candidate);

    const relevantCurriculum = getRelevantCurriculum(candidate);

    return {
        candidate: candidateContext,

        curriculum: relevantCurriculum,

        conversationHistory: history
    };
};
const getNextQuestion = async (context) => {

    const question = await generateInterviewQuestion(context);

    return question;
};



export {
    interview,
    getCandidateContext,
    getRelevantCurriculum,
    buildInterviewContext,
     getNextQuestion
};


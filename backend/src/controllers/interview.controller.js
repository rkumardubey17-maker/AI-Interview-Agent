import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { InterviewSession } from "../models/InterviewSession.model.js";
import { buildInterviewContext, getNextQuestion } from "../services/interview.service.js";
import { evaluateAnswer, generateInterviewFeedback } from "../services/feedback.service.js";


const interview = asyncHandler(async (req, res) => {

    const { sessionId, candidate, message } = req.body;

    // ==========================================
    // 1. FIND EXISTING SESSION
    // ==========================================

    let session = null;

    if (sessionId) {
        session = await InterviewSession.findOne({ sessionId });
    }

    // ==========================================
    // 2. START NEW INTERVIEW
    // ==========================================

    if (!session) {

        if (!candidate) {
            throw new ApiError(400, "candidate is required");
        }

        // Backend automatically generates session ID
        const newSessionId = crypto.randomUUID();

        // Create MongoDB session
        session = await InterviewSession.create({
            sessionId: newSessionId,
            candidate,
            conversationHistory: [],
            questionsAsked: 0,
            daysCovered: [],
            currentQuestion: "",
            completed: false,
            feedback: null
        });

        // Build initial context
        const context = buildInterviewContext(candidate, [], []);

        // Generate first question
        const result = await getNextQuestion(context);


        if (!result?.question || !result?.day) {
            throw new ApiError(500, "AI generated an invalid question");
        }

        // Save first question
        session.currentQuestion = result.question;
        session.questionsAsked = 1;
        session.daysCovered = [result.day];

        session.conversationHistory.push({
            role: "assistant",
            message: result.question,
            day: result.day,
            topic: result.topic,
            questionType: result.questionType
        });

        await session.save();

        // Return first question
        return res.status(200).json(
            new ApiResponse(
                200,
                { sessionId: session.sessionId, reply: result.question, done: false },
                "Interview started successfully"
            )
        );
    }

    // ==========================================
    // 3. INTERVIEW ALREADY COMPLETED
    // ==========================================

    if (session.completed) {
        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    sessionId: session.sessionId,
                    reply: "This interview has already been completed.",
                    done: true,
                    feedback: session.feedback
                },
                "Interview already completed"
            )

        );
    }

    // ==========================================
    // 4. CANDIDATE ANSWER REQUIRED
    // ==========================================

    if (!message) {
        throw new ApiError(400, "message is required");
    }

    // ==========================================
    // 5. FIND CURRENT QUESTION TOPIC
    // ==========================================

    const lastQuestion = session.conversationHistory.filter( (item) => item.role === "assistant" ).at(-1);
    const currentTopic = lastQuestion?.topic || "Technical";

    // ==========================================
    // 6. EVALUATE CANDIDATE ANSWER
    // ==========================================

    const answerEvaluation =
        await evaluateAnswer({
            question: session.currentQuestion,
            answer: message,
            topic: currentTopic
        });

    // ==========================================
    // 7. SAVE CANDIDATE ANSWER + EVALUATION
    // ==========================================

    session.conversationHistory.push({
        role: "candidate",
        message,
        evaluation: answerEvaluation
    });

    // ==========================================
    // 8. CHECK IF INTERVIEW IS COMPLETE
    // ==========================================

    if (session.questionsAsked >= 8) {

        // Generate final feedback
        const finalFeedback = await generateInterviewFeedback(session);

        // Save final feedback
        session.feedback = finalFeedback;
        session.completed = true;
        await session.save();

        // Return final result
        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    sessionId: session.sessionId,
                    evaluation: answerEvaluation,
                    done: true,
                    feedback: finalFeedback
                },
                "Interview completed successfully"
            )
        );
    }

    // ==========================================
    // 9. BUILD UPDATED CONTEXT
    // ==========================================

    const context = buildInterviewContext(
        session.candidate,
        session.conversationHistory,
        session.daysCovered
    );

    // ==========================================
    // 10. GENERATE NEXT QUESTION
    // ==========================================
    const result = await getNextQuestion(context);

    if (!result?.question || !result?.day) {
        throw new ApiError( 500, "AI generated an invalid question" );
    }

    // ==========================================
    // 11. UPDATE QUESTION COUNT
    // ==========================================

    session.questionsAsked += 1;
    session.currentQuestion = result.question;

    // ==========================================
    // 12. UPDATE CURRICULUM DAYS
    // ==========================================

    if ( !session.daysCovered.includes( result.day ) ) {
        session.daysCovered.push(
            result.day
        );
    }

    // ==========================================
    // 13. SAVE NEXT AI QUESTION
    // ==========================================

    session.conversationHistory.push({
        role: "assistant",
        message: result.question,
        day: result.day,
        topic: result.topic,
        questionType: result.questionType
    });

    await session.save();

    // ==========================================
    // 14. RETURN EVALUATION + NEXT QUESTION
    // ==========================================

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                sessionId: session.sessionId,
                evaluation: answerEvaluation,
                reply: result.question,
                done: false
            },
            "Answer evaluated and next question generated"
        )
    );

});

export { interview };
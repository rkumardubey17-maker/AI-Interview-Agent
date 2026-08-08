import mongoose from "mongoose";

const interviewSessionSchema = new mongoose.Schema(
    {
        sessionId: {
            type: String,
            required: true,
            unique: true
        },

        candidate: {
            type: Object,
            required: true
        },

        conversationHistory: {
            type: Array,
            default: []
        },

        questionsAsked: {
            type: Number,
            default: 0
        },

        daysCovered: {
            type: [Number],
            default: []
        },

        currentQuestion: {
            type: String,
            default: ""
        },

        completed: {
            type: Boolean,
            default: false
        },

        feedback: {
            type: Object,
            default: null
        }
    },
    {
        timestamps: true
    }
);

export const InterviewSession = mongoose.model(
    "InterviewSession",
    interviewSessionSchema
);
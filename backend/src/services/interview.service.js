import curriculum from "../data/curriculum.json" with { type: "json" };
import { generateInterviewQuestion } from "./gemini.service.js";


const getCandidateContext = (candidate) => {

    const completedMissions =
        candidate.missions?.filter(
            (mission) => mission.passed === true
        ) || [];

    const notPassedMissions =
        candidate.missions?.filter(
            (mission) => mission.passed === false
        ) || [];

    return {
        member: candidate.member,
        completedMissions,
        notPassedMissions,
        signals: candidate.signals || {}
    };
};


const getRelevantCurriculum = (candidate) => {

    const completedDays =
        candidate.missions
            ?.filter((mission) => mission.passed === true)
            .map((mission) => mission.day) || [];

    return curriculum.filter((day) =>
        completedDays.includes(day.day)
    );
};


const buildInterviewContext = (candidate, history = []) => {

    const candidateContext =
        getCandidateContext(candidate);

    const relevantCurriculum =
        getRelevantCurriculum(candidate);

    return {
        candidate: candidateContext,
        curriculum: relevantCurriculum,
        conversationHistory: history
    };
};


const getNextQuestion = async (context) => {

    const question =
        await generateInterviewQuestion(context);

    return question;
};


export {
    getCandidateContext,
    getRelevantCurriculum,
    buildInterviewContext,
    getNextQuestion
};
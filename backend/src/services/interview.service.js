import curriculum from "../data/curriculum.json" with { type: "json" };
import { generateInterviewQuestion } from "./gemini.service.js";


// Candidate ka relevant data nikalna
const getCandidateContext = (candidate) => {

    const completedMissions =
        candidate.missions?.filter(
            (mission) => mission.passed === true
        ) || [];

    const skippedMissions =
        candidate.missions?.filter(
            (mission) => mission.skipped === true
        ) || [];

    return {
        member: candidate.member,
        completedMissions,
        skippedMissions,
        signals: candidate.signals || {}
    };
};


// Candidate ne jo days complete kiye hain,
// unhi days ka curriculum nikalna
const getRelevantCurriculum = (candidate) => {

    const completedDays =
        candidate.missions
            ?.filter(
                (mission) => mission.passed === true
            )
            .map(
                (mission) => mission.day
            ) || [];

    return curriculum.days.filter(
        (day) => completedDays.includes(day.day)
    );
};


// Gemini ke liye complete context
const buildInterviewContext = (
    candidate,
    history = [],
    coveredDays = []
) => {

    const candidateContext =
        getCandidateContext(candidate);

    const relevantCurriculum =
        getRelevantCurriculum(candidate);

    // Jo days abhi tak cover nahi hue
    const availableDays =
        relevantCurriculum.filter(
            (day) => !coveredDays.includes(day.day)
        );

    return {
        candidate: candidateContext,
        curriculum: relevantCurriculum,
        conversationHistory: history,
        coveredDays,
        availableDays
    };
};


// Gemini se next question lena
const getNextQuestion = async (context) => {

    return await generateInterviewQuestion(context);
};


export {
    getCandidateContext,
    getRelevantCurriculum,
    buildInterviewContext,
    getNextQuestion
};
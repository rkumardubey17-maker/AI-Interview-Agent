import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
   Sun, Moon, Clock, Sparkles, CheckCircle2, AlertCircle, 
   User, Briefcase, Award, TrendingUp, HelpCircle, AlertTriangle, ArrowRight 
} from 'lucide-react';

export default function Result() {
   const location = useLocation();
   const navigate = useNavigate();

   // Retrieve state passed from InterviewPage (or use fallback mock data)
   const candidate = location.state?.candidate || { name: 'Technical Candidate', role: 'Engineering Assessment' };
   const elapsedTime = location.state?.elapsedTime || 485;
   
   const feedback = location.state?.feedback || {
      totalMarks: 42,
      maxMarks: 50,
      percentage: 84,
      averageScore: 8.4,
      performanceLevel: 'Strong',
      summary: 'The candidate demonstrated a solid technical grasp of modern AI engineering, retrieval-augmented generation, and vector indexing.',
      strengths: [
         'Clear understanding of hybrid search techniques and chunking strategies.',
         'Strong background in vector database indexing and distance calculations.',
         'Good articulation of edge-case handling in agentic workflows.'
      ],
      weaknesses: [
         'Initial answer on distributed caching lacked operational depth.',
         'Could improve clarity on latency trade-offs during high-throughput vector queries.'
      ],
      gaps: [
         'Could provide more specific metric calculations for high-concurrency database deployments.',
         'Deepen operational insights around Docker and Kubernetes monitoring metrics.'
      ],
      next: [
         'Proceed to system architecture deep-dive and multi-agent coordination scenarios.',
         'Review Kubernetes monitoring metrics and Prometheus integration patterns.'
      ],
      questionWiseScores: [
         { questionNumber: 1, score: 8, maxScore: 10, question: 'Explain Hybrid Search and vector indexing.' },
         { questionNumber: 2, score: 9, maxScore: 10, question: 'How do you handle rate limiting in LLM pipelines?' },
         { questionNumber: 3, score: 7, maxScore: 10, question: 'Describe Docker container orchestration metrics.' },
         { questionNumber: 4, score: 9, maxScore: 10, question: 'Explain RAG chunking trade-offs.' },
         { questionNumber: 5, score: 9, maxScore: 10, question: 'How do agentic workflows recover from tool errors?' }
      ]
   };

   const [isDarkMode, setIsDarkMode] = useState(false);

   const toggleTheme = () => setIsDarkMode((prev) => !prev);

   // Format seconds into MM:SS
   const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
   };

   // Helper to normalize array or string fields
   const renderListItems = (items) => {
      if (!items) return null;
      if (Array.isArray(items)) {
         return items.map((item, idx) => (
            <li key={idx}>{typeof item === 'object' ? JSON.stringify(item) : item}</li>
         ));
      }
      return <li>{items}</li>;
   };

   return (
      <div className={`min-h-screen flex flex-col transition-colors duration-500 font-sans ${isDarkMode ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>

         {/* Ambient Glows */}
         <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl dark:bg-blue-600/20" />
            <div className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl dark:bg-indigo-600/20" />
            <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl dark:bg-purple-600/20" />
         </div>

         <div className="mx-auto max-w-5xl w-full px-4 py-6 sm:px-6 lg:px-8 flex flex-col flex-1 min-h-screen">

            {/* Global Navigation Bar */}
            <header className="mb-6 flex items-center justify-between shrink-0">
               <div className="flex items-center space-x-3 pl-2 sm:pl-4">
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                     <Award className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                  </div>

                  <div className="flex flex-col">
                     <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 leading-none mb-1">
                        Report Overview
                     </span>
                     <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                        Assessment Outcome
                     </span>
                  </div>
               </div>

               <div className="flex items-center space-x-3 pr-2 sm:pr-4">
                  <button onClick={toggleTheme} className="flex items-center space-x-2 rounded-full border border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">
                     {isDarkMode ? (
                        <>
                           <Sun className="h-4 w-4 text-amber-400" />
                           <span className="hidden sm:inline">Light Mode</span>
                        </>
                     ) : (
                        <>
                           <Moon className="h-4 w-4 text-indigo-500" />
                           <span className="hidden sm:inline">Dark Mode</span>
                        </>
                     )}
                  </button>
               </div>
            </header>

            {/* Candidate & Metadata Header */}
            <section className="mb-6 rounded-2xl border border-gray-200/50 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-4 sm:p-5 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-wrap items-center justify-between gap-4 shrink-0">
               <div className="flex items-center space-x-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/30 font-bold text-base shrink-0">
                     {candidate?.name ? candidate.name.split(' ').map((n) => n[0]).join('') : <User className="h-5 w-5" />}
                  </div>
                  <div>
                     <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {candidate?.name || 'Technical Candidate'}
                     </h1>
                     <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                        {candidate?.role || 'Engineering Assessment'}
                     </p>
                  </div>
               </div>

               <div className="flex items-center gap-3 sm:gap-6 ml-auto">
                  <div className="flex items-center space-x-2 bg-slate-100/80 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                     <Clock className="h-4 w-4 text-indigo-500" />
                     <div className="text-left">
                        <span className="text-[10px] text-slate-400 block uppercase font-medium leading-none">Total Duration</span>
                        <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                           {formatTime(elapsedTime)}
                        </span>
                     </div>
                  </div>

                  <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                     <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                     <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Completed</span>
                  </div>
               </div>
            </section>

            {/* Main Content Area */}
            <main className="flex-1 mb-6">
               <div className="space-y-6 rounded-3xl border border-white/40 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg transition-all">

                  {/* Title Section */}
                  <div className="border-b border-slate-200/60 dark:border-slate-800/80 pb-5">
                     <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-5 w-5 text-cyan-500" />
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                           AI Evaluation Report
                        </span>
                     </div>
                     <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                        Technical Interview Summary
                     </h2>
                     {feedback.summary && (
                        <p className="text-slate-600 dark:text-slate-300 text-sm mt-2 leading-relaxed">
                           {feedback.summary}
                        </p>
                     )}
                  </div>

                  {/* High-Level Score Metrics Banner */}
                  {(feedback.totalMarks !== undefined || feedback.percentage !== undefined || feedback.performanceLevel || feedback.averageScore !== undefined) && (
                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50">
                        {feedback.totalMarks !== undefined && (
                           <div className="flex flex-col">
                              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Score</span>
                              <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                                 {feedback.totalMarks} <span className="text-xs font-normal text-slate-500">/ {feedback.maxMarks ?? 100}</span>
                              </span>
                           </div>
                        )}
                        {feedback.percentage !== undefined && (
                           <div className="flex flex-col">
                              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Percentage</span>
                              <span className="text-lg sm:text-xl font-extrabold text-blue-600 dark:text-cyan-400">
                                 {feedback.percentage}%
                              </span>
                           </div>
                        )}
                        {feedback.averageScore !== undefined && (
                           <div className="flex flex-col">
                              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Average / Q</span>
                              <span className="text-lg sm:text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                                 {feedback.averageScore}
                              </span>
                           </div>
                        )}
                        {feedback.performanceLevel && (
                           <div className="flex flex-col">
                              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Performance</span>
                              <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 truncate">
                                 {feedback.performanceLevel}
                              </span>
                           </div>
                        )}
                     </div>
                  )}

                  {/* Assessment Cards Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                     {/* Key Strengths */}
                     {feedback.strengths && (
                        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 shadow-sm">
                           <h3 className="text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-3 flex items-center gap-2 uppercase tracking-wider">
                              <CheckCircle2 className="h-4 w-4" />
                              <span>Key Strengths</span>
                           </h3>
                           <ul className="list-disc list-inside text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-2">
                              {renderListItems(feedback.strengths)}
                           </ul>
                        </div>
                     )}

                     {/* Weaknesses */}
                     {feedback.weaknesses && (
                        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-5 shadow-sm">
                           <h3 className="text-rose-600 dark:text-rose-400 font-bold text-sm mb-3 flex items-center gap-2 uppercase tracking-wider">
                              <AlertTriangle className="h-4 w-4" />
                              <span>Weaknesses</span>
                           </h3>
                           <ul className="list-disc list-inside text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-2">
                              {renderListItems(feedback.weaknesses)}
                           </ul>
                        </div>
                     )}

                     {/* Areas for Improvement / Gaps */}
                     {feedback.gaps && (
                        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 shadow-sm">
                           <h3 className="text-amber-600 dark:text-amber-400 font-bold text-sm mb-3 flex items-center gap-2 uppercase tracking-wider">
                              <AlertCircle className="h-4 w-4" />
                              <span>Areas for Improvement</span>
                           </h3>
                           <ul className="list-disc list-inside text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-2">
                              {renderListItems(feedback.gaps)}
                           </ul>
                        </div>
                     )}

                     {/* Recommended Next Steps */}
                     {feedback.next && (
                        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5 shadow-sm">
                           <h3 className="text-blue-600 dark:text-cyan-400 font-bold text-sm mb-3 flex items-center gap-2 uppercase tracking-wider">
                              <ArrowRight className="h-4 w-4" />
                              <span>Recommended Next Steps</span>
                           </h3>
                           <ul className="list-disc list-inside text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-2">
                              {renderListItems(feedback.next)}
                           </ul>
                        </div>
                     )}
                  </div>

                  {/* Question-Wise Scores Section */}
                  {Array.isArray(feedback.questionWiseScores) && feedback.questionWiseScores.length > 0 && (
                     <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-5 shadow-sm space-y-3">
                        <h3 className="text-slate-800 dark:text-slate-200 font-bold text-sm flex items-center gap-2 uppercase tracking-wider">
                           <HelpCircle className="h-4 w-4 text-indigo-500" />
                           <span>Question-Wise Scores</span>
                        </h3>
                        <div className="grid gap-2">
                           {feedback.questionWiseScores.map((q, idx) => {
                              const qNum = q.questionNumber || q.qNum || idx + 1;
                              const scoreVal = q.score ?? q.marks ?? 0;
                              const maxVal = q.maxScore ?? q.maxMarks ?? 10;
                              const qText = q.question || q.title || q.topic;

                              return (
                                 <div 
                                    key={idx} 
                                    className="flex items-center justify-between p-3 rounded-xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 text-xs sm:text-sm"
                                 >
                                    <div className="flex items-center gap-2 pr-2 min-w-0">
                                       <span className="font-bold text-slate-700 dark:text-slate-300 shrink-0">
                                          Question {qNum}{qText ? ':' : ''}
                                       </span>
                                       {qText && (
                                          <span className="text-slate-500 dark:text-slate-400 truncate">
                                             {qText}
                                          </span>
                                       )}
                                    </div>
                                    <span className="font-mono font-bold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-cyan-950/40 px-2.5 py-1 rounded-lg border border-blue-200/40 dark:border-cyan-800/40 shrink-0">
                                       {scoreVal}/{maxVal}
                                    </span>
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-col-reverse sm:flex-row gap-3">
                     <button
                        onClick={() => navigate('/candidate')}
                        className="flex-1 inline-flex items-center justify-center rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-sm transition-all duration-200 hover:scale-[1.01] hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 active:scale-100 cursor-pointer"
                     >
                        <span>← Back to Candidates</span>
                     </button>

                     <button
                        onClick={() => navigate('/')}
                        className="flex-1 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:scale-[1.01] hover:bg-blue-500 active:scale-100 cursor-pointer"
                     >
                        <span>Start New Interview →</span>
                     </button>
                  </div>

               </div>
            </main>
         </div>
      </div>
   );
}
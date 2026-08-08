import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, ArrowRight, Search, Bot, Briefcase, GraduationCap, IdCard } from 'lucide-react';
import candidatesData from '../assets/candidates.json';

export default function CandidateSelection() {
   const navigate = useNavigate();
   const [isDarkMode, setIsDarkMode] = useState(false);
   const [searchQuery, setSearchQuery] = useState('');

   const toggleTheme = () => {
      setIsDarkMode((prev) => !prev);
   };

   // Load candidates from the imported JSON structure[cite: 1]
   const candidates = candidatesData.candidates.map((item, index) => ({
      id: item.member.id,
      name: item.member.name,
      role: item.member.jobRole,
      experience: `${item.member.yearsExperience} yrs exp`,
      education: item.member.education,
      avatarColor: index % 3 === 0
         ? 'bg-blue-500/10 text-blue-600 dark:text-cyan-400 border-blue-500/30'
         : index % 3 === 1
            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30'
            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      commitDays: item.signals.commitDays,
      missionsCompleted: item.signals.missionsCompleted,
      missionsFirstTry: item.signals.missionsFirstTry,
      rawMissions: item.missions
   }));

   const filteredCandidates = candidates.filter(
      (cand) =>
         cand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         cand.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
         cand.education.toLowerCase().includes(searchQuery.toLowerCase())
   );

   const handleSelectCandidate = (candidate) => {
      navigate('/interview/', { state: { candidate } });
   };

   return (
      <div className={`min-h-screen transition-colors duration-500 font-sans ${isDarkMode ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>

         {/* Background Ambient Glows */}
         <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl dark:bg-blue-600/20" />
            <div className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl dark:bg-indigo-600/20" />
            <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl dark:bg-purple-600/20" />
         </div>

         <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

            {/* Navigation & Theme Toggle */}
            <header className="mb-8 flex justify-between items-center">
               <div
                  onClick={() => navigate('/')}
                  className="flex items-center space-x-2.5 cursor-pointer group"
               >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/10 border border-blue-500/30 dark:bg-cyan-500/10 dark:border-cyan-500/30 transition-transform group-hover:scale-105">
                     <Bot className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                  </div>
                  <span className="text-sm font-bold tracking-wider uppercase text-slate-700 dark:text-slate-300">
                     AI Interview Platform
                  </span>
               </div>

               <button
                  onClick={toggleTheme}
                  className="flex items-center space-x-2 rounded-full border border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
               >
                  {isDarkMode ? (
                     <>
                        <Sun className="h-4 w-4 text-amber-400" />
                        <span>Light Mode</span>
                     </>
                  ) : (
                     <>
                        <Moon className="h-4 w-4 text-indigo-500" />
                        <span>Dark Mode</span>
                     </>
                  )}
               </button>
            </header>

            {/* Header Section */}
            <section className="mb-12 text-center max-w-3xl mx-auto">
               <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                  Select Your Profile
               </h1>
               <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
                  Find and select your profile to begin your personalized AI technical interview.
               </p>

               {/* Search Bar */}
               <div className="mt-8 relative max-w-md mx-auto">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                     <Search className="h-4 w-4" />
                  </div>
                  <input
                     type="text"
                     placeholder="Search your profile by name, role, or background..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 shadow-lg shadow-slate-200/50 dark:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
               </div>
            </section>

            {/* Candidates Grid */}
            <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
               {filteredCandidates.map((candidate) => (
                  <div
                     key={candidate.id}
                     className="group flex flex-col justify-between rounded-3xl border border-white/40 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20"
                  >
                     <div>
                        {/* Card Header */}
                        <div className="flex items-center space-x-3 mb-4">
                           <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${candidate.avatarColor} font-bold text-lg flex-shrink-0`}>
                              {candidate.name.split(' ').map((n) => n[0]).join('')}
                           </div>
                           <div>
                              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                                 {candidate.name}
                              </h3>
                              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                 {candidate.role}
                              </p>
                           </div>
                        </div>

                        {/* Education & Background info */}
                        <div className="space-y-2 mb-6 text-xs text-slate-600 dark:text-slate-300">
                           <div className="flex items-center gap-1.5">
                              <IdCard className="h-4 w-4 text-cyan-500 flex-shrink-0" />
                              <span className="truncate">ID: {candidate.id}</span>
                           </div>
                           <div className="flex items-center gap-1.5">
                              <GraduationCap className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                              <span className="truncate">{candidate.education}</span>
                           </div>

                           <div className="flex items-center gap-1.5">
                              <Briefcase className="h-4 w-4 text-blue-500 flex-shrink-0" />
                              <span>{candidate.experience}</span>
                           </div>
                        </div>

                        {/* Signals / Metrics Grid */}
                        <div className="mb-6 grid grid-cols-3 gap-2 bg-slate-50/50 dark:bg-slate-900/30 p-2.5 rounded-xl border border-slate-200/40 dark:border-slate-800/40 text-center">
                           <div>
                              <span className="text-[10px] text-slate-400 block uppercase font-medium">Active Days</span>
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{candidate.commitDays}d</span>
                           </div>
                           <div className="border-x border-slate-200/40 dark:border-slate-800/40">
                              <span className="text-[10px] text-slate-400 block uppercase font-medium">Completed</span>
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{candidate.missionsCompleted}</span>
                           </div>
                           <div>
                              <span className="text-[10px] text-slate-400 block uppercase font-medium">1st Attempt</span>
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{candidate.missionsFirstTry}</span>
                           </div>
                        </div>
                     </div>

                     {/* Action Button */}
                     <button
                        onClick={() => handleSelectCandidate(candidate)}
                        className="group/btn relative w-full inline-flex items-center justify-center overflow-hidden rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                     >
                        <span>Start Interview</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                     </button>
                  </div>
               ))}
            </section>

            {filteredCandidates.length === 0 && (
               <div className="text-center py-16 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                     No profile found matching "{searchQuery}".
                  </p>
               </div>
            )}

         </div>
      </div>
   );
}
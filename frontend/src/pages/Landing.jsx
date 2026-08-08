import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, ArrowRight, Search, Database, Terminal, Zap, Server, BarChart3, Circle, Bot } from 'lucide-react';
import curriculumData from '../assets/curriculum.json';

export default function Landing() {
   const navigate = useNavigate();
   const [isDarkMode, setIsDarkMode] = useState(false);
   const { cohort, modules } = curriculumData;

   const toggleTheme = () => {
      setIsDarkMode((prev) => !prev);
   };

   return (
      <div className={`min-h-screen transition-colors duration-500 font-sans ${isDarkMode ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>

         {/* Background Ambient Glows for Frosted Glass Effect */}
         <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl dark:bg-blue-600/20" />
            <div className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl dark:bg-indigo-600/20" />
            <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl dark:bg-purple-600/20" />
         </div>

         <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

            {/* Navigation & Theme Toggle */}
            <header className="mb-8 flex justify-between items-center">
               <div className="flex items-center space-x-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/10 border border-blue-500/30 dark:bg-cyan-500/10 dark:border-cyan-500/30">
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

            {/* Hero Section - Glassmorphism Card with Border & Shadow Hover Effect */}
            <section className="mb-12 rounded-3xl border border-white/40 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 text-center shadow-xl shadow-slate-200/50 dark:shadow-none sm:p-12 transition-all duration-300 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20">
               <span className="mb-4 inline-block rounded-full bg-indigo-500/10 dark:bg-indigo-400/10 border border-indigo-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Enterprise AI Engineering Cohort
               </span>
               <h1 className="mb-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                  AI Technical Interview Agent
               </h1>
               <p className="mx-auto mb-8 max-w-2xl text-base text-slate-600 dark:text-slate-200 sm:text-lg leading-relaxed">
                  Personalized, multi-turn technical interviews designed to evaluate candidates on real systems built throughout the 31-day intensive program.
               </p>
               <button
                  onClick={() => navigate('/candidate')}
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:bg-blue-700 hover:scale-[1.02] hover:shadow-blue-500/50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 cursor-pointer"
               >
                  <span>Select a Candidate</span>
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
               </button>
            </section>

            {/* Cohort Overview Card */}
            <section className="mb-12">
               <h2 className="mb-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Cohort Overview
               </h2>

               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {modules.map((mod) => (
                     <div
                        key={mod.n}
                        className="group rounded-2xl border border-white/50 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/80 dark:hover:bg-slate-800/60 hover:shadow-lg hover:shadow-blue-500/5 active:scale-95 cursor-pointer"
                     >
                        <div className="mb-3 flex items-center justify-between">
                           <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                              Module {mod.n}
                           </span>
                           <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-200">
                              Days {mod.days.join('–')}
                           </span>
                        </div>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                           {mod.title}
                        </h3>
                     </div>
                  ))}
               </div>
            </section>

            {/* Topics Covered Grid */}
            <section className="mb-12">
               <h2 className="mb-6 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Core Evaluation Areas
               </h2>
               <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                  {/* Topic 1 */}
                  <div className="rounded-2xl border border-white/50 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/70 dark:hover:bg-slate-800/50 hover:shadow-md">
                     <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        <Search className="h-5 w-5" />
                     </div>
                     <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">RAG & Retrieval</h3>
                     <p className="text-sm text-slate-600 dark:text-slate-300">
                        Vector search, chunking strategies, hybrid matching, and query routing.
                     </p>
                  </div>

                  {/* Topic 2 */}
                  <div className="rounded-2xl border border-white/50 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/70 dark:hover:bg-slate-800/50 hover:shadow-md">
                     <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        <Database className="h-5 w-5" />
                     </div>
                     <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Vector Databases</h3>
                     <p className="text-sm text-slate-600 dark:text-slate-300">
                        ChromaDB, Pinecone, distance metrics, and indexing strategies.
                     </p>
                  </div>

                  {/* Topic 3 */}
                  <div className="rounded-2xl border border-white/50 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/70 dark:hover:bg-slate-800/50 hover:shadow-md">
                     <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <Terminal className="h-5 w-5" />
                     </div>
                     <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Prompt Engineering & MCP</h3>
                     <p className="text-sm text-slate-600 dark:text-slate-300">
                        Chain-of-thought, function calling, and Model Context Protocol servers.
                     </p>
                  </div>

                  {/* Topic 4 */}
                  <div className="rounded-2xl border border-white/50 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/70 dark:hover:bg-slate-800/50 hover:shadow-md">
                     <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <Zap className="h-5 w-5" />
                     </div>
                     <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Agentic AI</h3>
                     <p className="text-sm text-slate-600 dark:text-slate-300">
                        ReAct loops, LangChain agents, tool execution, and multi-agent systems.
                     </p>
                  </div>

                  {/* Topic 5 */}
                  <div className="rounded-2xl border border-white/50 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/70 dark:hover:bg-slate-800/50 hover:shadow-md">
                     <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                        <Server className="h-5 w-5" />
                     </div>
                     <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">AI Deployment</h3>
                     <p className="text-sm text-slate-600 dark:text-slate-300">
                        FastAPI, Docker containerization, Kubernetes, and streaming responses.
                     </p>
                  </div>

                  {/* Topic 6 */}
                  <div className="rounded-2xl border border-white/50 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/70 dark:hover:bg-slate-800/50 hover:shadow-md">
                     <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        <BarChart3 className="h-5 w-5" />
                     </div>
                     <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Production Systems</h3>
                     <p className="text-sm text-slate-600 dark:text-slate-300">
                        Observability, logging, evaluation metrics, and guardrails.
                     </p>
                  </div>

               </div>
            </section>

         </div>
      </div>
   );
}
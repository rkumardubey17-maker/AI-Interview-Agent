import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, Bot, ArrowLeft, Send, RotateCcw, Clock, HelpCircle, AlertCircle, User, Briefcase } from 'lucide-react';

export default function InterviewPage() {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve candidate object passed via navigate state
  const candidate = location.state?.candidate;

  // Theme state synced with landing/selection design language
  const [isDarkMode, setIsDarkMode] = useState(false);

  // State Management
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Question Progress Tracking
  const [progress, setProgress] = useState({ questionNumber: 1, totalQuestions: 5 });

  // Interview Timer State
  const [elapsedTime, setElapsedTime] = useState(0);

  const chatEndRef = useRef(null);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // Auto-scroll to latest message
  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, error]);

  // Interview Timer
  useEffect(() => {
    const timer = setInterval(() => setElapsedTime((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format seconds into MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Initial Session Initialization (Mocked)
  const startSession = async () => {
    setIsLoading(true);
    setError(null);

    // DUMMY SIMULATION
    setTimeout(() => {
      setSessionId(`mock-session-${Date.now()}`);
      setProgress({ questionNumber: 1, totalQuestions: 5 });
      setMessages([
        {
          sender: 'interviewer',
          text: `Welcome, ${candidate?.name || 'Candidate'}! I am your AI Technical Interviewer today. To start off, could you explain your experience with vector search, chunking strategies, and hybrid retrieval in RAG systems?`
        }
      ]);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (candidateId) startSession();
  }, [candidateId]);

  // Send Message Handler (Mocked)
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setError(null);

    // Append user message immediately
    setMessages((prev) => [...prev, { sender: 'candidate', text: userText }]);
    setIsLoading(true);

    // DUMMY SIMULATION
    setTimeout(() => {
      const nextQ = progress.questionNumber + 1;

      if (nextQ <= progress.totalQuestions) {
        setProgress({ questionNumber: nextQ, totalQuestions: progress.totalQuestions });
        setMessages((prev) => [
          ...prev,
          {
            sender: 'interviewer',
            text: `Great insights on question ${progress.questionNumber}! For question ${nextQ}, how do you handle indexing strategies and distance metrics in vector databases like ChromaDB or Pinecone when scaling to millions of embeddings?`
          }
        ]);
      } 
      else {
        // Mock result payload passed to separate route
        const mockFeedback = {
          summary: 'The candidate demonstrated a solid technical grasp of modern AI engineering, retrieval-augmented generation, and vector indexing.',
          strengths: [
            'Clear understanding of hybrid search techniques and chunking strategies.',
            'Strong background in vector database indexing and distance calculations.',
            'Good articulation of edge-case handling in agentic workflows.'
          ],
          gaps: [
            'Could provide more specific metric calculations for high-concurrency database deployments.',
            'Deepen operational insights around Docker and Kubernetes monitoring metrics.'
          ],
          next: 'Proceed to system architecture deep-dive and multi-agent coordination scenarios.'
        };

        navigate('/result', {
          state: {
            feedback: mockFeedback,
            candidate: candidate,
            elapsedTime: elapsedTime
          }
        });
      }
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 font-sans ${isDarkMode ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>

      {/* Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl dark:bg-blue-600/20" />
        <div className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl dark:bg-indigo-600/20" />
        <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl dark:bg-purple-600/20" />
      </div>

      <div className="mx-auto max-w-6xl w-full px-4 py-6 sm:px-6 lg:px-8 flex flex-col flex-1 h-screen">

        {/* Global Navigation Bar */}
        <header className="mb-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate('/candidate')} className="flex items-center space-x-2 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
              <span>Exit Interview</span>
            </button>

            <div className="hidden sm:flex items-center space-x-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/10 border border-blue-500/30 dark:bg-cyan-500/10 dark:border-cyan-500/30">
                <Bot className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
              </div>
              <span className="text-sm font-bold tracking-wider uppercase text-slate-700 dark:text-slate-300">
                AI Interview Session
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
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

        {/* Candidate & Interview Context Bar */}
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

          {/* Metrics Dashboard */}
          <div className="flex items-center gap-3 sm:gap-6 ml-auto">
            {progress.questionNumber && progress.totalQuestions && (
              <div className="flex items-center space-x-2 bg-slate-100/80 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                <HelpCircle className="h-4 w-4 text-cyan-500" />
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 block uppercase font-medium leading-none">Progress</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Question {progress.questionNumber} of {progress.totalQuestions}
                  </span>
                </div>
              </div>
            )}

            {/* Timer */}
            <div className="flex items-center space-x-2 bg-slate-100/80 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
              <Clock className="h-4 w-4 text-indigo-500" />
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block uppercase font-medium leading-none">Duration</span>
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                  {formatTime(elapsedTime)}
                </span>
              </div>
            </div>

            {/* Live Indicator */}
            <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Live Assessment</span>
            </div>
          </div>
        </section>

        {/* Main Work Area */}
        <main className="flex-1 flex flex-col min-h-0 mb-4">
          <div className="flex-1 flex flex-col min-h-0">
            {/* Chat Container */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 rounded-2xl border border-white/40 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-4 sm:p-6 shadow-inner">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'candidate' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[88%] sm:max-w-[78%] rounded-2xl p-4 text-sm leading-relaxed transition-all shadow-md ${msg.sender === 'candidate' ? 'bg-blue-600 text-white rounded-br-none shadow-blue-500/10' : 'bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none shadow-slate-200/50 dark:shadow-none'}`}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${msg.sender === 'candidate' ? 'text-blue-100' : 'text-blue-600 dark:text-cyan-400'}`}>
                        {msg.sender === 'candidate' ? 'You' : 'AI Interviewer'}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}

              {/* Loading State */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl rounded-bl-none px-4 py-3.5 text-sm text-slate-600 dark:text-slate-300 flex items-center gap-3 shadow-md">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 dark:text-cyan-400">
                      <Bot className="h-3.5 w-3.5 animate-spin" />
                    </div>
                    <span className="text-xs font-medium">Evaluating response...</span>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-cyan-400 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}

              {/* Inline Error State with Retry Button */}
              {error && (
                <div className="flex justify-center my-2">
                  <div className="bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 px-4 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-3 shadow-lg max-w-lg w-full justify-between backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                      <span>{error}</span>
                    </div>
                    <button onClick={messages.length === 0 ? startSession : handleSendMessage} className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl font-semibold text-xs transition-all shrink-0 cursor-pointer shadow-sm">
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Retry</span>
                    </button>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Chat Input Field */}
            <form onSubmit={handleSendMessage} className="mt-4 flex gap-3">
              <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="Type your technical answer here..." disabled={isLoading} className="flex-1 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md px-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 shadow-lg shadow-slate-200/50 dark:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all" />
              <button type="submit" disabled={isLoading || !inputMessage.trim()} className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shrink-0">
                <span>Send</span>
                <Send className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
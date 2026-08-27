import React from 'react';

export default function WelcomeCards({ userName, onOpenAbout }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-8 max-w-2xl mx-auto w-full animate-fadeIn select-none">
      {/* Official Brand Logo Icon & Hero */}
      <div 
        className="mb-5 flex flex-col items-center cursor-pointer group" 
        onClick={onOpenAbout} 
        title="Click to view About Abyntra AI & Creator Abhinav Giri"
      >
        <img
          src="/logo.png"
          alt="Abyntra AI Official Logo"
          className="w-24 h-24 rounded-3xl object-contain shadow-glow-cyan mb-3 group-hover:scale-105 transition-transform duration-300"
        />
        <span className="text-xs font-mono tracking-[0.25em] text-cyan-300 font-bold uppercase drop-shadow-sm">
          THINK • CREATE • EXPLORE
        </span>
      </div>

      {/* Greeting Hero */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
        <span className="text-white">Hello, </span>
        <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
          {userName || 'Abhinav'}
        </span>
      </h1>
      
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-400 tracking-tight mb-6">
        What would you like to explore today?
      </h2>

      {/* Clean Quick Tip Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] text-gray-400 text-xs font-mono shadow-inner">
        <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[10px]">/</span>
        <span>Type <strong className="text-gray-200">/</strong> for commands or ask anything below</span>
      </div>
    </div>
  );
}

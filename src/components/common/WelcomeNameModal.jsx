import React, { useState } from 'react';
import { Sparkles, ArrowRight, User, Award } from 'lucide-react';
import { storage } from '../../services/storage';

export default function WelcomeNameModal({ isOpen, onSaveName }) {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalName = name.trim() || 'Abhinav';
    storage.setUserName(finalName);
    onSaveName(finalName);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-[#090B15] border border-cyan-500/30 p-8 shadow-2xl flex flex-col items-center text-center overflow-hidden shadow-glow-cyan">
        {/* Background ambient glow */}
        <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-purple-500/20 blur-3xl" />

        {/* Official Brand Logo */}
        <img
          src="/logo.png"
          alt="Girionix AI Official Logo"
          className="w-16 h-16 rounded-2xl object-contain shadow-glow-cyan mb-3 hover:scale-105 transition-transform"
        />

        <h2 className="text-2xl font-extrabold text-white tracking-tight mb-1">
          Welcome to <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-rose-400 bg-clip-text text-transparent">Girionix AI</span>
        </h2>

        {/* Updated Slogan & Tagline */}
        <div className="flex flex-col items-center gap-1 mb-6">
          <span className="text-xs font-mono font-extrabold tracking-[0.25em] text-cyan-300 uppercase drop-shadow-sm">
            THINK • CREATE • EXPLORE
          </span>
          <span className="text-[11px] text-gray-400 font-mono">
            Omnipotent Superhuman AI • Created by Abhinav Giri
          </span>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="text-left space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5 font-mono">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>What should I call you?</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Abhinav"
              autoFocus
              className="w-full px-4 py-3 rounded-2xl bg-[#0F1122] border border-white/15 focus:border-cyan-400 text-white placeholder-gray-500 text-sm font-sans focus:outline-none shadow-inner"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-rose-500 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-glow-cyan hover:opacity-95 transition-all"
          >
            <span>Get Started with Girionix</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[10px] text-gray-500 font-mono mt-4">
          🔒 Your name and preferences are safely saved in your browser.
        </p>
      </div>
    </div>
  );
}

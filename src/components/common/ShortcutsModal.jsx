import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';

export default function ShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Enter', desc: 'Send message / Submit prompt' },
    { key: 'Shift + Enter', desc: 'Add new line in prompt box' },
    { key: 'Ctrl + K / ⌘K', desc: 'Open Command Palette & Global Search' },
    { key: 'Ctrl + Shift + V', desc: 'Launch Live Voice Mode' },
    { key: 'Ctrl + Shift + S', desc: 'Toggle Side-by-Side Split Workspace' },
    { key: 'Ctrl + Shift + N', desc: 'Start a New Chat Session' },
    { key: 'Esc', desc: 'Close any active modal or overlay' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-[#0C0E1B] border border-white/15 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">Keyboard Shortcuts</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5">
          {shortcuts.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
              <span className="text-gray-300 font-medium">{item.desc}</span>
              <kbd className="px-2 py-1 rounded-lg bg-black/60 border border-white/10 text-cyan-300 font-mono text-[11px] shadow-sm">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Plus, MessageSquare, Trash2, Edit2, Check, X, Search, Sparkles } from 'lucide-react';

export default function ChatHistorySidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onCreateNewSession,
  onDeleteSession,
  onRenameSession,
  isOpen,
  onClose
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  if (!isOpen) return null;

  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startRename = (s) => {
    setEditingId(s.id);
    setEditTitle(s.title);
  };

  const saveRename = (id) => {
    if (editTitle.trim()) {
      onRenameSession(id, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 z-40 flex bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div 
        className="w-80 h-full bg-[#090B16] border-r border-white/10 p-4 flex flex-col shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white tracking-wider uppercase font-mono">Chat History</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* New Chat Button */}
        <button
          onClick={() => {
            onCreateNewSession();
            onClose();
          }}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 text-white font-bold text-xs border border-cyan-500/30 flex items-center justify-center gap-2 transition-all shadow-glow-cyan"
        >
          <Plus className="w-4 h-4 text-cyan-400" />
          <span>New Chat Session</span>
        </button>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono"
          />
        </div>

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto space-y-1 py-1">
          {filteredSessions.map((session) => {
            const isActive = session.id === activeSessionId;
            const isEditing = editingId === session.id;

            return (
              <div
                key={session.id}
                onClick={() => {
                  if (!isEditing) {
                    onSelectSession(session.id);
                    onClose();
                  }
                }}
                className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all border ${
                  isActive
                    ? 'bg-cyan-500/15 border-cyan-500/30 text-white font-semibold'
                    : 'border-transparent hover:bg-white/[0.03] text-gray-400 hover:text-gray-200'
                }`}
              >
                <div className="flex items-center gap-2 truncate flex-1">
                  <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-gray-500'}`} />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') saveRename(session.id); }}
                      autoFocus
                      className="bg-black/80 px-2 py-0.5 rounded text-xs text-white border border-cyan-400 focus:outline-none w-full font-sans"
                    />
                  ) : (
                    <span className="text-xs truncate">{session.title}</span>
                  )}
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {isEditing ? (
                    <button onClick={(e) => { e.stopPropagation(); saveRename(session.id); }} className="p-1 hover:text-emerald-400">
                      <Check className="w-3 h-3" />
                    </button>
                  ) : (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); startRename(session); }} className="p-1 hover:text-white" title="Rename">
                        <Edit2 className="w-3 h-3" />
                      </button>
                      {sessions.length > 1 && (
                        <button onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }} className="p-1 hover:text-rose-400" title="Delete">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { X, Bookmark, Trash2, ArrowUpRight, Copy, Check } from 'lucide-react';

export default function PinnedDrawer({ isOpen, onClose, pinnedItems, onRemovePinned, onOpenCode }) {
  const [copiedId, setCopiedId] = React.useState(null);

  if (!isOpen) return null;

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div 
        className="w-96 h-full bg-[#090B16] border-l border-white/10 p-5 flex flex-col shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">Pinned Items & Bookmarks ({pinnedItems.length})</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3">
          {pinnedItems.length === 0 ? (
            <div className="text-center py-16 text-gray-500 text-xs font-mono">
              No pinned items yet.<br />Click the ⭐ bookmark icon on any message to pin it here.
            </div>
          ) : (
            pinnedItems.map((item) => (
              <div key={item.id} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 hover:border-purple-500/30 transition-all">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-purple-300 truncate">{item.title || 'Pinned Snippet'}</span>
                  <span className="text-gray-500 font-mono text-[9px]">{item.time}</span>
                </div>
                <p className="text-xs text-gray-300 line-clamp-3 font-mono leading-relaxed bg-black/40 p-2 rounded-xl">
                  {item.content}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <button
                    onClick={() => handleCopy(item.content, item.id)}
                    className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 font-mono"
                  >
                    {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => onRemovePinned(item.id)}
                    className="p-1 text-gray-500 hover:text-rose-400"
                    title="Unpin"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

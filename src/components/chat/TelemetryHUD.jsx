import React from 'react';
import { Activity, Zap, DollarSign, Clock } from 'lucide-react';

export default function TelemetryHUD({ modelName, tokenCount = 1420, latency = 210, speed = 88 }) {
  const estCost = ((tokenCount / 1000) * 0.002).toFixed(4);

  return (
    <div className="flex items-center gap-3 px-3 py-1 bg-[#090B16]/90 border-b border-white/[0.06] text-[10px] font-mono text-gray-400 overflow-x-auto flex-shrink-0">
      <div className="flex items-center gap-1 text-cyan-400">
        <Activity className="w-3 h-3 animate-pulse" />
        <span>{modelName}</span>
      </div>

      <div className="flex items-center gap-1">
        <Clock className="w-3 h-3 text-purple-400" />
        <span>{latency}ms</span>
      </div>

      <div className="flex items-center gap-1">
        <Zap className="w-3 h-3 text-emerald-400" />
        <span>{speed} tok/s</span>
      </div>

      <div className="flex items-center gap-1">
        <DollarSign className="w-3 h-3 text-amber-400" />
        <span>${estCost}</span>
      </div>
    </div>
  );
}

import React from 'react';
import { GitFork, ArrowDown, ZoomIn } from 'lucide-react';

export default function MermaidVisualizer({ chartCode, title = 'Architecture Flowchart' }) {
  // Simple clean SVG flowchart generator from text definitions (A -> B -> C)
  const steps = chartCode
    .split('\n')
    .map(line => line.replace(/^[-\s*>]+/, '').trim())
    .filter(line => line.length > 0)
    .slice(0, 6);

  return (
    <div className="my-3 rounded-2xl bg-[#090B16] border border-purple-500/30 p-4 shadow-2xl max-w-lg space-y-3">
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5 text-purple-300 font-bold">
          <GitFork className="w-4 h-4 text-purple-400" />
          <span>{title}</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">Visual Diagram</span>
      </div>

      <div className="flex flex-col items-center space-y-2 py-2">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/30 text-center text-xs font-mono text-cyan-200 shadow-md">
              {step}
            </div>
            {idx < steps.length - 1 && (
              <ArrowDown className="w-4 h-4 text-purple-400 animate-bounce" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

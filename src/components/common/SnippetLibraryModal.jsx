import React, { useState } from 'react';
import { X, Layers, Code2, Sigma, ArrowRight, Copy, Check } from 'lucide-react';

export default function SnippetLibraryModal({ isOpen, onClose, onInsertCode }) {
  const [activeCategory, setActiveCategory] = useState('react');
  const [copiedId, setCopiedId] = useState(null);

  if (!isOpen) return null;

  const templates = [
    {
      id: 'shader-orb',
      category: 'react',
      title: '3D Glowing Hologram Orb',
      desc: 'Interactive 3D particle sphere using HTML5 Canvas & React Hooks.',
      code: `export default function HologramOrb() {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = 400;
    let height = canvas.height = 400;
    let frame = 0;
    const anim = () => {
      ctx.fillStyle = 'rgba(7, 8, 15, 0.3)';
      ctx.fillRect(0, 0, width, height);
      ctx.beginPath();
      ctx.arc(200 + Math.sin(frame*0.05)*40, 200 + Math.cos(frame*0.05)*40, 60, 0, Math.PI*2);
      ctx.fillStyle = '#00F0FF';
      ctx.shadowBlur = 25;
      ctx.shadowColor = '#00F0FF';
      ctx.fill();
      frame++;
      requestAnimationFrame(anim);
    };
    anim();
  }, []);
  return <canvas ref={canvasRef} className="rounded-2xl border border-cyan-500/30" />;
}`
    },
    {
      id: 'tailwind-dashboard',
      category: 'react',
      title: 'Glassmorphism Metric Cards',
      desc: 'Responsive crypto/telemetry cards with glowing border animations.',
      code: `export default function MetricGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 p-6 bg-slate-950 rounded-2xl border border-cyan-500/20">
      <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10">
        <span className="text-xs font-mono text-cyan-400">Quantum TPS</span>
        <div className="text-2xl font-bold text-white mt-1">142,800/s</div>
      </div>
      <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10">
        <span className="text-xs font-mono text-purple-400">Memory Pressure</span>
        <div className="text-2xl font-bold text-white mt-1">12.4%</div>
      </div>
    </div>
  );
}`
    },
    {
      id: 'math-navier',
      category: 'math',
      title: 'Navier-Stokes Dissipation Proof',
      desc: 'Energy inequality derivation in incompressible fluid dynamics.',
      code: `\\frac{d}{dt} \\int_{\\Omega} \\frac{1}{2} |u|^2 dx + \\nu \\int_{\\Omega} |\\nabla u|^2 dx = \\int_{\\Omega} f \\cdot u dx`
    }
  ];

  const filtered = templates.filter(t => t.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-2xl rounded-3xl bg-[#0C0E1B] border border-cyan-500/30 p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">Code & Math Snippet Library</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {['react', 'math'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-mono uppercase transition-all ${
                activeCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'bg-white/[0.03] text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {cat === 'react' ? '💻 React / UI' : '🧮 Math Theorems'}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto space-y-3">
          {filtered.map((item) => (
            <div key={item.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2 hover:border-cyan-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{item.title}</span>
                <button
                  onClick={() => { onInsertCode(item.code); onClose(); }}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-mono border border-cyan-500/30 flex items-center gap-1"
                >
                  <span>Insert</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <p className="text-[11px] text-gray-400">{item.desc}</p>
              <pre className="p-2.5 rounded-xl bg-black/60 text-[11px] font-mono text-cyan-200 overflow-x-auto max-h-28">
                <code>{item.code}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

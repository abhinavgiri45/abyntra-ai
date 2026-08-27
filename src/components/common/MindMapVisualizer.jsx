import React, { useState, useEffect, useRef } from 'react';
import { 
  Network, 
  Sparkles, 
  Maximize2, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Layers,
  Check
} from 'lucide-react';

export default function MindMapVisualizer({ topic = "Artificial Intelligence", data = null }) {
  const [zoom, setZoom] = useState(1);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  // Generate nodes based on topic
  const nodes = data || [
    { id: 'core', label: topic, x: 250, y: 150, color: '#00F0FF', radius: 36, isCenter: true },
    { id: 'n1', label: 'Neural Architectures', x: 100, y: 70, color: '#9D4EDD', radius: 24, parent: 'core' },
    { id: 'n2', label: 'Mathematical Logic', x: 400, y: 70, color: '#10B981', radius: 24, parent: 'core' },
    { id: 'n3', label: '8K Vision Synthesis', x: 100, y: 230, color: '#FF007A', radius: 24, parent: 'core' },
    { id: 'n4', label: 'Realtime Voice NLP', x: 400, y: 230, color: '#F59E0B', radius: 24, parent: 'core' },
    { id: 'n1_1', label: 'Transformers', x: 30, y: 40, color: '#9D4EDD', radius: 18, parent: 'n1' },
    { id: 'n1_2', label: 'Diffusers', x: 30, y: 100, color: '#9D4EDD', radius: 18, parent: 'n1' },
    { id: 'n2_1', label: 'Calculus', x: 470, y: 40, color: '#10B981', radius: 18, parent: 'n2' },
    { id: 'n2_2', label: 'Tensors', x: 470, y: 100, color: '#10B981', radius: 18, parent: 'n2' }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = (canvas.width = canvas.parentElement.clientWidth || 500);
    const height = (canvas.height = 300);

    let animId;
    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-250, -150);

      // Draw Connection Links
      nodes.forEach(node => {
        if (node.parent) {
          const parentNode = nodes.find(n => n.id === node.parent);
          if (parentNode) {
            ctx.strokeStyle = node.color + '66';
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 2]);

            ctx.beginPath();
            ctx.moveTo(parentNode.x, parentNode.y);
            ctx.lineTo(node.x, node.y);
            ctx.stroke();
            ctx.setLineDash([]);

            // Flowing data particle
            const progress = (time * 0.5 + (node.x % 10) * 0.1) % 1;
            const px = parentNode.x + (node.x - parentNode.x) * progress;
            const py = parentNode.y + (node.y - parentNode.y) * progress;
            ctx.fillStyle = node.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = node.color;
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      });

      // Draw Nodes
      nodes.forEach(node => {
        const floatY = Math.sin(time + node.x * 0.05) * 3;

        // Node Glow Ring
        ctx.fillStyle = node.color + '22';
        ctx.strokeStyle = node.color;
        ctx.lineWidth = node.isCenter ? 3 : 1.5;

        ctx.beginPath();
        ctx.arc(node.x, node.y + floatY, node.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Node Text Label
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${node.isCenter ? 'bold 11px' : '9px'} system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, node.x, node.y + floatY);
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [zoom, nodes]);

  return (
    <div className="my-4 rounded-3xl overflow-hidden border border-cyan-500/30 bg-[#070914] shadow-2xl space-y-2 max-w-2xl">
      <div className="px-4 py-2.5 bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-slate-900 border-b border-white/10 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-cyan-300 font-bold">
          <Network className="w-4 h-4 text-cyan-400" />
          <span>Interactive AI Knowledge & Mind Map</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoom(prev => Math.min(1.6, prev + 0.15))}
            className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(0.6, prev - 0.15))}
            className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="relative w-full h-[280px] bg-black/60 flex items-center justify-center">
        <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      </div>

      <div className="p-2.5 px-4 bg-[#05060A] border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-400">
        <span>Topic: <strong className="text-cyan-300">{topic}</strong> • Drag & Zoom Interactive</span>
        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Live Graph</span>
      </div>
    </div>
  );
}

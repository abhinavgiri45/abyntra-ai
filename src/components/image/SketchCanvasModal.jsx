import React, { useRef, useState, useEffect } from 'react';
import { X, Brush, Eraser, Trash2, Sparkles, Check } from 'lucide-react';

export default function SketchCanvasModal({ isOpen, onClose, onGenerateFromSketch }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#00F0FF');
  const [brushSize, setBrushSize] = useState(6);
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#050711';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startDraw = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#050711';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleGenerate = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    onGenerateFromSketch(prompt || 'Synthesize photorealistic 8K render from this shape sketch', dataUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-[#090B16] border border-rose-500/30 p-6 shadow-2xl space-y-4 shadow-glow-rose">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Brush className="w-5 h-5 text-rose-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">Sketch-to-Image Canvas Studio</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {['#00F0FF', '#FF007A', '#10B981', '#F59E0B', '#FFFFFF'].map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  color === c ? 'scale-125 border-white' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="range"
              min="2"
              max="24"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-20 accent-rose-400"
            />
            <button onClick={clearCanvas} className="p-1.5 rounded-lg bg-white/[0.04] text-gray-400 hover:text-rose-400">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="w-full h-64 rounded-2xl overflow-hidden border border-white/10 bg-[#050711] relative">
          <canvas
            ref={canvasRef}
            width={480}
            height={260}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={() => setIsDrawing(false)}
            onMouseLeave={() => setIsDrawing(false)}
            className="w-full h-full cursor-crosshair"
          />
        </div>

        {/* Concept Prompt */}
        <input
          type="text"
          placeholder="Concept description (e.g. glowing neon sword in cyber forest)..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-sans focus:border-rose-400 focus:outline-none"
        />

        <button
          onClick={handleGenerate}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-glow-rose"
        >
          <Sparkles className="w-4 h-4" />
          <span>Render 8K Image from Sketch</span>
        </button>
      </div>
    </div>
  );
}

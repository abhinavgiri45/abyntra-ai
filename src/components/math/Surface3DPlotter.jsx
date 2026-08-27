import React, { useState, useEffect, useRef } from 'react';
import { Rotate3d, Compass } from 'lucide-react';

export default function Surface3DPlotter() {
  const canvasRef = useRef(null);
  const [equation, setEquation] = useState('Math.sin(Math.sqrt(x*x + y*y)) / (Math.sqrt(x*x + y*y) || 0.1)');
  const [rotX, setRotX] = useState(0.8);
  const [rotY, setRotY] = useState(0.6);
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight || 240);

    ctx.fillStyle = '#070913';
    ctx.fillRect(0, 0, width, height);

    const gridSize = 20;
    const range = 6;
    const step = (range * 2) / gridSize;

    const project = (x, y, z) => {
      // Rotate around Y
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;

      // Rotate around X
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX + 15;

      const scale = 300 / z2;
      return {
        px: width / 2 + x1 * scale * 16,
        py: height / 2 - y2 * scale * 16,
        depth: z2
      };
    };

    // Calculate grid vertices
    const points = [];
    for (let i = 0; i <= gridSize; i++) {
      points[i] = [];
      const x = -range + i * step;
      for (let j = 0; j <= gridSize; j++) {
        const y = -range + j * step;
        let z = 0;
        try {
          // eslint-disable-next-line no-new-func
          const fn = new Function('x', 'y', `return ${equation};`);
          z = fn(x, y);
          if (isNaN(z) || !isFinite(z)) z = 0;
        } catch (_) { z = 0; }
        points[i][j] = project(x, z, y);
      }
    }

    // Draw 3D wireframe mesh
    ctx.lineWidth = 1;
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const p1 = points[i][j];
        const p2 = points[i + 1][j];
        const p3 = points[i + 1][j + 1];
        const p4 = points[i][j + 1];

        ctx.strokeStyle = `rgba(0, 240, 255, ${Math.max(0.15, 1 - p1.depth / 25)})`;
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.lineTo(p3.px, p3.py);
        ctx.lineTo(p4.px, p4.py);
        ctx.closePath();
        ctx.stroke();
      }
    }
  }, [equation, rotX, rotY]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    setRotY(prev => prev + dx * 0.01);
    setRotX(prev => prev + dy * 0.01);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <div className="p-3 rounded-2xl bg-[#0C0E1B] border border-cyan-500/30 shadow-xl space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-white flex items-center gap-1.5">
          <Rotate3d className="w-3.5 h-3.5 text-cyan-400" />
          <span>3D Surface & Waveform Plotter (Drag to Rotate)</span>
        </span>
        <span className="text-[10px] text-cyan-400 font-mono">3D Perspective</span>
      </div>

      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        className="w-full h-52 rounded-xl overflow-hidden border border-cyan-500/20 bg-[#070913] cursor-grab active:cursor-grabbing"
      >
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      <div className="flex gap-1 overflow-x-auto text-[10px] font-mono">
        {[
          { name: 'Sinc Wave z=sin(r)/r', fn: 'Math.sin(Math.sqrt(x*x + y*y)) / (Math.sqrt(x*x + y*y) || 0.1)' },
          { name: 'Hyperbolic Saddle z=x²-y²', fn: '(x*x - y*y) * 0.08' },
          { name: 'Ripple z=cos(x)*sin(y)', fn: 'Math.cos(x) * Math.sin(y) * 1.5' }
        ].map((p, idx) => (
          <button
            key={idx}
            onClick={() => setEquation(p.fn)}
            className="px-2 py-0.5 rounded bg-white/[0.03] hover:bg-white/[0.08] text-gray-300 border border-white/5 whitespace-nowrap"
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}

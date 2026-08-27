import React, { useEffect, useRef } from 'react';
import { BarChart3, TrendingUp, PieChart as PieIcon } from 'lucide-react';

export default function ChartRenderer({ data, type = 'bar', title = 'Data Visualization' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = (canvas.width = canvas.parentElement.clientWidth || 400);
    const height = (canvas.height = 200);

    ctx.fillStyle = '#090B16';
    ctx.fillRect(0, 0, width, height);

    const labels = data?.labels || ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'];
    const values = data?.values || [45, 78, 62, 95, 84];
    const maxVal = Math.max(...values, 100);

    if (type === 'bar') {
      const barWidth = (width - 60) / values.length;
      values.forEach((val, i) => {
        const barHeight = (val / maxVal) * (height - 60);
        const x = 40 + i * barWidth + barWidth * 0.15;
        const y = height - 30 - barHeight;
        const w = barWidth * 0.7;

        // Gradient Bar
        const grad = ctx.createLinearGradient(0, y, 0, height - 30);
        grad.addColorStop(0, '#00F0FF');
        grad.addColorStop(1, '#9D4EDD');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, w, barHeight, [6, 6, 0, 0]);
        ctx.fill();

        // Label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(labels[i] || `${i + 1}`, x + w / 2, height - 12);
        ctx.fillText(`${val}`, x + w / 2, y - 6);
      });
    } else if (type === 'line') {
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 3;
      ctx.beginPath();

      const step = (width - 80) / (values.length - 1 || 1);
      values.forEach((val, i) => {
        const x = 40 + i * step;
        const y = height - 35 - (val / maxVal) * (height - 70);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Points
      values.forEach((val, i) => {
        const x = 40 + i * step;
        const y = height - 35 - (val / maxVal) * (height - 70);
        ctx.fillStyle = '#FF007A';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(labels[i] || '', x, height - 12);
        ctx.fillText(`${val}`, x, y - 8);
      });
    }
  }, [data, type]);

  return (
    <div className="my-3 rounded-2xl bg-[#090B16] border border-cyan-500/30 p-3.5 shadow-xl space-y-2 max-w-lg">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-cyan-400 font-bold flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <span>{title}</span>
        </span>
        <span className="text-[10px] text-gray-400 uppercase">{type} Chart</span>
      </div>

      <div className="w-full h-52 rounded-xl overflow-hidden bg-[#07080F] border border-white/5">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  );
}

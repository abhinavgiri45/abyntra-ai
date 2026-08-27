import React, { useState } from 'react';
import { X, Upload, FileText, Image as ImageIcon, Check, Paperclip } from 'lucide-react';

export default function FileUploadModal({ isOpen, onClose, onFileAttached }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (file) => {
    if (!file) return;
    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleAttach = () => {
    if (selectedFile) {
      onFileAttached({
        name: selectedFile.name,
        size: (selectedFile.size / 1024).toFixed(1) + ' KB',
        type: selectedFile.type,
        preview: filePreview
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-[#0C0E1B] border border-white/15 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Paperclip className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">Upload File or Image</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files?.[0]) handleFileChange(e.dataTransfer.files[0]);
          }}
          className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            dragActive ? 'border-cyan-400 bg-cyan-500/10' : 'border-white/10 bg-white/[0.02] hover:border-white/20'
          }`}
          onClick={() => document.getElementById('file-input-modal').click()}
        >
          <input
            id="file-input-modal"
            type="file"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0])}
            accept="image/*,.pdf,.txt,.js,.jsx,.py,.cpp,.json"
          />

          {filePreview ? (
            <div className="max-h-40 overflow-hidden rounded-xl mb-2">
              <img src={filePreview} alt="Upload Preview" className="max-h-40 object-contain rounded-xl" />
            </div>
          ) : (
            <Upload className="w-8 h-8 text-cyan-400 mb-2 animate-bounce" />
          )}

          <p className="text-xs font-semibold text-white">
            {selectedFile ? selectedFile.name : 'Click to browse or drag & drop files here'}
          </p>
          <p className="text-[10px] text-gray-500 font-mono mt-1">
            Supports Images, Code Files, PDFs, Data Text (Max 25MB)
          </p>
        </div>

        {selectedFile && (
          <button
            onClick={handleAttach}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 hover:opacity-90 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-glow-cyan transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Attach to Message</span>
          </button>
        )}
      </div>
    </div>
  );
}

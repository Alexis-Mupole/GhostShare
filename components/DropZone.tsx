
import React, { useState, useCallback } from 'react';
import { UploadCloud, File } from 'lucide-react';

interface DropZoneProps {
  onFileDropped: (file: File) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFileDropped }) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileDropped(files[0]);
    }
  }, [onFileDropped]);

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileDropped(files[0]);
    }
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`relative group cursor-pointer h-64 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl transition-all duration-300 ${
        isDragging 
          ? 'border-sky-500 bg-sky-500/10 scale-[1.01]' 
          : 'border-slate-800 bg-slate-900/30 hover:border-slate-700 hover:bg-slate-900/50'
      }`}
    >
      <input
        type="file"
        onChange={onFileInputChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      <div className="flex flex-col items-center text-center p-6 space-y-4">
        <div className={`p-4 rounded-full transition-transform duration-300 ${isDragging ? 'scale-110' : 'group-hover:scale-105'} bg-sky-500/10`}>
          <UploadCloud className={`w-12 h-12 ${isDragging ? 'text-sky-400' : 'text-slate-600 group-hover:text-sky-400'} transition-colors`} />
        </div>
        <div>
          <p className="text-lg font-bold text-white mb-1">Send a file</p>
          <p className="text-sm text-slate-400">Drag & drop or click to browse</p>
        </div>
        <div className="px-4 py-1.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-700">
          Max performance: Unlimited size
        </div>
      </div>
    </div>
  );
};

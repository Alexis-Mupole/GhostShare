
import React from 'react';
import { ShieldAlert, X } from 'lucide-react';
import { AppError } from '../types';

interface ErrorDisplayProps {
  error: AppError;
  onDismiss: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onDismiss }) => {
  return (
    <div className="w-full mb-6 animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="relative overflow-hidden glass border border-rose-500/30 rounded-2xl bg-rose-500/5 p-4 flex items-start gap-4 shadow-lg shadow-rose-500/5">
        <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
        <div className="p-2 bg-rose-500/10 rounded-xl">
          <ShieldAlert className="w-5 h-5 text-rose-500" />
        </div>
        <div className="flex-1 pr-8">
          <h4 className="text-rose-400 font-bold text-sm uppercase tracking-wider mb-1">System Alert</h4>
          <p className="text-slate-200 text-sm leading-relaxed">{error.message}</p>
        </div>
        <button 
          onClick={onDismiss}
          className="absolute top-4 right-4 p-1 hover:bg-rose-500/10 rounded-lg text-rose-500/70 hover:text-rose-500 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

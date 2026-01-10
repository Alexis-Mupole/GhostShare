
import React from 'react';

interface ProgressBarProps {
  progress: number;
  status: 'connecting' | 'transferring' | 'completed' | 'error';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, status }) => {
  const isCompleted = status === 'completed';
  const isError = status === 'error';

  return (
    <div className="w-full h-2 bg-slate-800/50 rounded-full overflow-hidden">
      <div
        className={`h-full transition-all duration-300 ease-out rounded-full ${
          isCompleted 
            ? 'bg-emerald-500' 
            : isError 
              ? 'bg-rose-500' 
              : 'bg-sky-500'
        }`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

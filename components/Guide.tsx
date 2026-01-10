
import React from 'react';
import { X, UserPlus, Share2, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

interface GuideProps {
  onClose: () => void;
}

export const Guide: React.FC<GuideProps> = ({ onClose }) => {
  const steps = [
    {
      icon: <UserPlus className="w-6 h-6 text-sky-400" />,
      title: "Generate your ID",
      description: "As soon as you open GhostShare, a unique cryptographic ID is generated just for your browser session."
    },
    {
      icon: <Share2 className="w-6 h-6 text-indigo-400" />,
      title: "Share with a Friend",
      description: "Copy your ID or let your friend scan your QR code. They must enter this ID in their 'Join a Tunnel' section."
    },
    {
      icon: <Zap className="w-6 h-6 text-emerald-400" />,
      title: "Establish Tunnel",
      description: "Once the ID is entered, a direct WebRTC DataChannel is created between your devices. No servers sit in between."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-purple-400" />,
      title: "Secure Transfer",
      description: "Drag and drop any file. It is sliced into encrypted chunks and sent directly to your friend's memory and downloaded."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="glass w-full max-w-2xl rounded-3xl overflow-hidden border border-slate-800 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-sky-400" />
            How to use GhostShare
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="relative p-5 rounded-2xl bg-slate-900/30 border border-slate-800/50 hover:border-slate-700 transition-colors">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-sky-400 shadow-lg">
                  {idx + 1}
                </div>
                <div className="mb-3">{step.icon}</div>
                <h3 className="text-white font-bold mb-1">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-sky-500/5 border border-sky-500/10 text-center">
            <p className="text-sky-300 text-sm italic">
              "Privacy by Architecture: Your data never touches our infrastructure. 
              The connection is destroyed the moment you close the tab."
            </p>
          </div>
        </div>

        <div className="p-6 bg-slate-900/40 border-t border-slate-800 flex justify-center">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-sky-500/20 flex items-center gap-2 group"
          >
            Got it, let's go
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

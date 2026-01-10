
import React, { useState } from 'react';
import { GhostShare } from './components/GhostShare';
import { Guide } from './components/Guide';
import { Shield, Share2, Info, HelpCircle } from 'lucide-react';

const App: React.FC = () => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 md:p-8 bg-slate-950 text-slate-200">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Header */}
      <header className="w-full max-w-4xl flex items-center justify-between mb-8 z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Share2 className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Ghost<span className="text-sky-400">Share</span></h1>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={() => setShowGuide(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/50 border border-slate-800 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
          >
            <HelpCircle className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">How it works</span>
          </button>
          
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/50 border border-slate-800 text-sm text-slate-400">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>P2P Direct Tunnel</span>
          </div>
        </div>
      </header>

      <main className="w-full max-w-2xl z-10">
        <GhostShare />
      </main>

      <footer className="mt-auto pt-12 pb-6 text-center text-slate-500 text-sm z-10 max-w-xl">
        <p className="flex items-center justify-center gap-1.5 mb-2 px-4 leading-relaxed">
          <Info className="w-4 h-4 flex-shrink-0" />
          GhostShare uses end-to-end P2P encryption. No files are ever stored on a server.
        </p>
        <p>© 2024 GhostShare P2P Protocol. Optimized for mobile and desktop.</p>
      </footer>

      {showGuide && <Guide onClose={() => setShowGuide(false)} />}
    </div>
  );
};

export default App;

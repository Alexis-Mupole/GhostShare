
import React, { useState } from 'react';
import { ArrowRight, Wifi, ShieldAlert, ScanLine } from 'lucide-react';
import { QRScanner } from './QRScanner';

interface ConnectionManagerProps {
  status: string;
  onConnect: (id: string) => void;
}

export const ConnectionManager: React.FC<ConnectionManagerProps> = ({ status, onConnect }) => {
  const [remoteId, setRemoteId] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (remoteId.trim()) {
      onConnect(remoteId.trim());
    }
  };

  const handleScan = (scannedId: string) => {
    setRemoteId(scannedId);
    setShowScanner(false);
    onConnect(scannedId);
  };

  return (
    <div className="glass rounded-2xl p-8 border border-slate-800 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-lg font-bold text-white">Join a Tunnel</h2>
        <p className="text-sm text-slate-400">Enter a Ghost ID to establish a direct connection</p>
      </div>

      <div className="flex flex-col gap-4">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={remoteId}
            onChange={(e) => setRemoteId(e.target.value)}
            placeholder="Paste ID here..."
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-4 px-6 pr-16 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all font-mono"
          />
          <button
            type="submit"
            disabled={!remoteId.trim() || status === 'connecting'}
            className="absolute right-2 top-2 bottom-2 px-4 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-all flex items-center justify-center"
          >
            {status === 'connecting' ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <ArrowRight className="w-5 h-5" />
            )}
          </button>
        </form>

        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-800"></div>
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">or</span>
          <div className="h-px flex-1 bg-slate-800"></div>
        </div>

        <button
          onClick={() => setShowScanner(true)}
          className="w-full py-3 bg-slate-900/50 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800 text-slate-300 rounded-xl transition-all flex items-center justify-center gap-3 font-medium group"
        >
          <ScanLine className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
          Scan QR Code
        </button>
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <p>Unable to connect. Please check the ID and ensure your peer is online.</p>
        </div>
      )}

      <div className="pt-2">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Wifi className="w-4 h-4" />
          <span>REAL-TIME P2P SIGNALING ACTIVE</span>
        </div>
      </div>

      {showScanner && (
        <QRScanner 
          onScan={handleScan} 
          onClose={() => setShowScanner(false)} 
        />
      )}
    </div>
  );
};

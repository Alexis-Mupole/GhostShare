
import React, { useState } from 'react';
import { Copy, Check, Send, Download, X } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useGhostP2P } from '../hooks/useGhostP2P';
import { ConnectionManager } from './ConnectionManager';
import { DropZone } from './DropZone';
import { ProgressBar } from './ProgressBar';
import { ErrorDisplay } from './ErrorDisplay';

export const GhostShare: React.FC = () => {
  const { 
    myId, 
    connectionStatus, 
    transfers, 
    sendFile, 
    startConnection,
    activeConnection,
    error,
    clearError
  } = useGhostP2P();
  
  const [copied, setCopied] = useState(false);

  const copyId = () => {
    if (!myId) return;
    navigator.clipboard.writeText(myId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Global Errors */}
      {error && <ErrorDisplay error={error} onDismiss={clearError} />}

      {/* Identity Card */}
      <div className="glass rounded-2xl p-6 border border-slate-800 stealth-glow transition-all duration-300">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="bg-white p-2 rounded-xl shrink-0">
             <QRCodeCanvas value={myId || 'initializing'} size={120} />
          </div>
          <div className="flex-1 space-y-3 text-center sm:text-left min-w-0">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Your Ghost ID</p>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <code className="text-xl font-mono text-sky-400 font-bold truncate">
                  {connectionStatus === 'initializing' ? 'generating...' : myId}
                </code>
                <button 
                  onClick={copyId}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white shrink-0"
                  title="Copy ID"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Share this ID or QR code with someone to start a private, direct encrypted tunnel.
            </p>
          </div>
        </div>
      </div>

      {/* Connection Interface */}
      {connectionStatus === 'connected' ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Direct Connection Established
            </span>
            <button 
              onClick={() => activeConnection?.close()}
              className="text-emerald-400 hover:text-emerald-300"
              title="Close Tunnel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <DropZone onFileDropped={sendFile} />
        </div>
      ) : (
        <ConnectionManager 
          status={connectionStatus} 
          onConnect={startConnection} 
        />
      )}

      {/* Transfer List */}
      {transfers.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider px-1">Active Transfers</h3>
          <div className="space-y-2">
            {[...transfers].reverse().map((transfer) => (
              <div key={transfer.fileId} className="glass rounded-xl p-4 border border-slate-800/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`p-2 rounded-lg shrink-0 ${transfer.direction === 'send' ? 'bg-sky-500/10' : 'bg-indigo-500/10'}`}>
                      {transfer.direction === 'send' ? 
                        <Send className={`w-4 h-4 text-sky-400`} /> : 
                        <Download className="w-4 h-4 text-indigo-400" />
                      }
                    </div>
                    <span className="text-sm font-medium truncate text-slate-200">
                      {transfer.fileName}
                    </span>
                  </div>
                  <span className={`text-xs font-mono font-bold shrink-0 ${
                    transfer.status === 'completed' ? 'text-emerald-400' : 
                    transfer.status === 'error' ? 'text-rose-400' : 'text-sky-400'
                  }`}>
                    {transfer.status.toUpperCase()} {transfer.status !== 'completed' && transfer.status !== 'error' && `${transfer.progress}%`}
                  </span>
                </div>
                <ProgressBar progress={transfer.progress} status={transfer.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

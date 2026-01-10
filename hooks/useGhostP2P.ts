
import { useState, useEffect, useCallback, useRef } from 'react';
import { FileMeta, TransferProgress, PeerMessage, AppError } from '../types';

const CHUNK_SIZE = 16384; // 16KB optimal for DataChannel buffer stability

const ERROR_MESSAGES: Record<string, string> = {
  'browser-incompatible': 'Your browser does not support WebRTC. Please try a modern browser like Chrome or Firefox.',
  'disconnected': 'You have been disconnected from the signaling server.',
  'invalid-id': 'The provided Ghost ID is invalid.',
  'network': 'A network error occurred. Please check your internet connection.',
  'peer-unavailable': 'The peer you are trying to reach is offline or does not exist.',
  'server-error': 'The signaling server encountered an error. Please try again later.',
  'socket-error': 'Underlying socket error. Your firewall might be blocking the connection.',
  'socket-closed': 'The signaling socket was closed unexpectedly.',
  'unavailable-id': 'The generated ID is already in use. Please refresh.',
};

export const useGhostP2P = () => {
  const [myId, setMyId] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<'initializing' | 'ready' | 'connecting' | 'connected' | 'error'>('initializing');
  const [transfers, setTransfers] = useState<TransferProgress[]>([]);
  const [connection, setConnection] = useState<any>(null);
  const [error, setError] = useState<AppError | null>(null);
  const peerRef = useRef<any>(null);
  
  // Storage for incoming chunks to avoid state overhead
  const activeIncomingFiles = useRef<Record<string, { meta: FileMeta; chunks: ArrayBuffer[] }>>({});

  const clearError = () => setError(null);

  const triggerError = (type: string, customMsg?: string) => {
    const message = customMsg || ERROR_MESSAGES[type] || `An unknown error occurred: ${type}`;
    setError({ message, type, timestamp: Date.now() });
    setConnectionStatus(prev => prev === 'connecting' ? 'ready' : prev);
  };

  const handleData = useCallback((data: PeerMessage, conn: any) => {
    if (data.type === 'heartbeat') return;

    switch (data.type) {
      case 'file-meta': {
        const { id, name } = data.payload;
        activeIncomingFiles.current[id] = { meta: data.payload, chunks: [] };
        setTransfers(prev => [...prev, {
          fileId: id,
          fileName: name,
          progress: 0,
          status: 'transferring',
          direction: 'receive'
        }]);
        break;
      }
      case 'file-chunk': {
        const { id, chunk, index, total } = data.payload;
        const fileData = activeIncomingFiles.current[id];
        if (fileData) {
          fileData.chunks[index] = chunk;
          const progress = Math.round(((index + 1) / total) * 100);
          
          setTransfers(prev => prev.map(t => 
            t.fileId === id ? { ...t, progress } : t
          ));

          if (index === total - 1) {
            const blob = new Blob(fileData.chunks, { type: fileData.meta.type });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = fileData.meta.name;
            a.click();
            
            setTransfers(prev => prev.map(t => 
              t.fileId === id ? { ...t, status: 'completed', progress: 100 } : t
            ));
            
            delete activeIncomingFiles.current[id];
          }
        }
        break;
      }
    }
  }, []);

  const handleConnectionLifecycle = useCallback((conn: any) => {
    conn.on('open', () => {
      setConnection(conn);
      setConnectionStatus('connected');
      clearError();
    });

    conn.on('data', (data: PeerMessage) => handleData(data, conn));

    conn.on('close', () => {
      setConnection(null);
      setConnectionStatus('ready');
      setTransfers(prev => prev.map(t => 
        t.status === 'transferring' ? { ...t, status: 'error' } : t
      ));
      triggerError('closed', 'The direct tunnel was closed by the other peer.');
    });

    conn.on('error', (err: any) => {
      console.error('Connection error:', err);
      triggerError('connection-failed', 'The direct tunnel failed to establish.');
    });
  }, [handleData]);

  useEffect(() => {
    if (!window.Peer) return;

    const peer = new window.Peer({
      debug: 1,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }
        ]
      }
    });

    peer.on('open', (id: string) => {
      setMyId(id);
      setConnectionStatus('ready');
    });

    peer.on('connection', handleConnectionLifecycle);

    peer.on('disconnected', () => {
      peer.reconnect();
    });

    peer.on('error', (err: any) => {
      console.error('PeerJS Error:', err);
      triggerError(err.type);
    });

    peerRef.current = peer;
    return () => peer.destroy();
  }, [handleConnectionLifecycle]);

  useEffect(() => {
    let interval: any;
    if (connection && connectionStatus === 'connected') {
      interval = setInterval(() => {
        if (connection.open) {
          connection.send({ type: 'heartbeat' });
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [connection, connectionStatus]);

  const startConnection = useCallback((targetId: string) => {
    if (!peerRef.current || !targetId) return;
    if (targetId === myId) {
      triggerError('self-connect', 'You cannot connect to your own Ghost ID.');
      return;
    }
    setConnectionStatus('connecting');
    const conn = peerRef.current.connect(targetId, { reliable: true });
    handleConnectionLifecycle(conn);
  }, [handleConnectionLifecycle, myId]);

  const sendFile = useCallback(async (file: File) => {
    if (!connection || !connection.open) {
      triggerError('no-connection', 'You must establish a tunnel before sending files.');
      return;
    }

    const fileId = Math.random().toString(36).substring(7);
    const meta: FileMeta = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type
    };

    try {
      connection.send({ type: 'file-meta', payload: meta });
    } catch (e) {
      triggerError('send-failed', 'Failed to initialize file transfer.');
      return;
    }

    setTransfers(prev => [...prev, {
      fileId,
      fileName: file.name,
      progress: 0,
      status: 'transferring',
      direction: 'send'
    }]);

    const reader = new FileReader();
    let offset = 0;
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

    const readNextChunk = () => {
      if (!connection.open) return;
      const slice = file.slice(offset, offset + CHUNK_SIZE);
      reader.readAsArrayBuffer(slice);
    };

    reader.onerror = () => triggerError('read-failed', 'Failed to read file from disk.');

    reader.onload = (e) => {
      if (e.target?.result instanceof ArrayBuffer && connection.open) {
        try {
          const chunkIndex = offset / CHUNK_SIZE;
          connection.send({
            type: 'file-chunk',
            payload: {
              id: fileId,
              chunk: e.target.result,
              index: chunkIndex,
              total: totalChunks
            }
          });

          offset += CHUNK_SIZE;
          const progress = Math.round((offset / file.size) * 100);
          
          setTransfers(prev => prev.map(t => 
            t.fileId === fileId ? { ...t, progress: Math.min(progress, 100) } : t
          ));

          if (offset < file.size) {
            if (connection.dataChannel && connection.dataChannel.bufferedAmount > 1024 * 1024) {
               setTimeout(readNextChunk, 20);
            } else {
               setTimeout(readNextChunk, 1);
            }
          } else {
            setTransfers(prev => prev.map(t => 
              t.fileId === fileId ? { ...t, status: 'completed', progress: 100 } : t
            ));
          }
        } catch (err) {
          triggerError('transfer-failed', 'Transfer interrupted by connection error.');
        }
      }
    };

    readNextChunk();
  }, [connection]);

  return {
    myId,
    connectionStatus,
    transfers,
    sendFile,
    startConnection,
    error,
    clearError,
    isConnected: connectionStatus === 'connected',
    activeConnection: connection
  };
};


export interface FileMeta {
  name: string;
  size: number;
  type: string;
  id: string;
}

export interface AppError {
  message: string;
  type: string;
  timestamp: number;
}

export interface TransferProgress {
  fileId: string;
  progress: number;
  status: 'connecting' | 'transferring' | 'completed' | 'error';
  direction: 'send' | 'receive';
  fileName: string;
}

export type PeerMessage = 
  | { type: 'file-meta'; payload: FileMeta }
  | { type: 'file-chunk'; payload: { id: string; chunk: ArrayBuffer; index: number; total: number } }
  | { type: 'transfer-complete'; payload: { id: string } }
  | { type: 'heartbeat' };

declare global {
  interface Window {
    Peer: any;
  }
}

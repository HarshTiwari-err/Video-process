export type ChunkStatus = 'pending' | 'uploading' | 'completed' | 'error';

export interface VideoFile {
  id: string;
  file: File;
  name: string;
  size: number;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  chunks: number;
  chunkStatus: ChunkStatus[];
  retryCount: number[];
}

export interface PresignedUrl {
  url: string;
  partNumber: number;
}

export interface UploadProgress {
  videoId: string;
  progress: number;
  chunkIndex?: number;
  chunkStatus?: ChunkStatus;
}
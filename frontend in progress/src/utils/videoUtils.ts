import { VideoFile } from '../types';
import { CHUNK_SIZE, MAX_CHUNK_SIZE } from '../config/constants';

export const calculateChunks = (fileSize: number): number => {
  if (fileSize <= MAX_CHUNK_SIZE) {
    return 1; // Single chunk for small files
  }
  return Math.ceil(fileSize / CHUNK_SIZE);
};

export const createVideoFile = (file: File): VideoFile => {
  const totalChunks = calculateChunks(file.size);
  
  return {
    id: crypto.randomUUID(),
    file,
    name: file.name,
    size: file.size,
    progress: 0,
    status: 'pending',
    chunks: totalChunks,
    chunkStatus: Array(totalChunks).fill('pending'),
    retryCount: Array(totalChunks).fill(0)
  };
};
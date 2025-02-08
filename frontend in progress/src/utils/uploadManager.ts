import { VideoFile, PresignedUrl, ChunkStatus } from '../types';
import { getPresignedUrls } from '../api/upload';
import { CHUNK_SIZE, MAX_RETRIES } from '../config/constants';

const uploadChunk = async (
  url: string,
  chunk: Blob,
  retries = 0
): Promise<Response> => {
  try {
    const response = await fetch(url, {
      method: 'PUT',
      body: chunk,
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response;
  } catch (error) {
    if (retries < MAX_RETRIES) {
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
      return uploadChunk(url, chunk, retries + 1);
    }
    throw error;
  }
};

export const uploadVideoChunks = async (
  videoFile: VideoFile,
  onProgress: (progress: number, chunkIndex?: number, status?: ChunkStatus) => void
): Promise<void> => {
  const { file, chunks, id } = videoFile;
  
  try {
    // Get presigned URLs for all chunks
    const presignedUrls = await getPresignedUrls(id, chunks);
    
    // Prepare chunk uploads
    const chunkPromises = presignedUrls.map(async (presignedUrl, index) => {
      const start = index * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);
      
      onProgress(videoFile.progress, index, 'uploading');
      
      try {
        await uploadChunk(presignedUrl.url, chunk);
        onProgress(videoFile.progress, index, 'completed');
      } catch (error) {
        onProgress(videoFile.progress, index, 'error');
        throw error;
      }
    });
    
    // Upload chunks with progress tracking
    let completedChunks = 0;
    await Promise.allSettled(chunkPromises).then(results => {
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          completedChunks++;
          const progress = (completedChunks / chunks) * 100;
          onProgress(progress);
        }
      });
      
      // Check if all chunks completed successfully
      if (completedChunks === chunks) {
        onProgress(100);
      } else {
        throw new Error('Some chunks failed to upload');
      }
    });
  } catch (error) {
    console.error('Error uploading video chunks:', error);
    throw error;
  }
};
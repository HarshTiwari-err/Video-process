import React, { useState, useCallback } from 'react';
import { UploadZone } from './components/UploadZone';
import { VideoList } from './components/VideoList';
import { VideoFile } from './types';
import { uploadVideoChunks } from './utils/uploadManager';

function App() {
  const [videos, setVideos] = useState<VideoFile[]>([]);

  const handleFilesSelected = useCallback((newVideos: VideoFile[]) => {
    setVideos(prev => [...prev, ...newVideos]);
    
    // Start uploading each video
    newVideos.forEach(video => {
      const updateProgress = (progress: number) => {
        setVideos(prev =>
          prev.map(v =>
            v.id === video.id
              ? {
                  ...v,
                  progress,
                  status: progress === 100 ? 'completed' : 'uploading',
                }
              : v
          )
        );
      };

      // Start the upload process
      uploadVideoChunks(video, updateProgress).catch(() => {
        setVideos(prev =>
          prev.map(v =>
            v.id === video.id
              ? { ...v, status: 'error' }
              : v
          )
        );
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Video Uploader
        </h1>
        <UploadZone onFilesSelected={handleFilesSelected} />
        <VideoList videos={videos} />
      </div>
    </div>
  );
}

export default App;
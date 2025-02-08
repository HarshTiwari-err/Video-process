import React from 'react';
import { VideoFile } from '../types';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface VideoItemProps {
  video: VideoFile;
}

export const VideoItem: React.FC<VideoItemProps> = ({ video }) => {
  const formatSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {video.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-500" />}
          {video.status === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
          {video.status === 'uploading' && <Upload className="w-5 h-5 text-blue-500" />}
          <span className="font-medium">{video.name}</span>
        </div>
        <span className="text-sm text-gray-500">{formatSize(video.size)}</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${
            video.status === 'completed'
              ? 'bg-green-500'
              : video.status === 'error'
              ? 'bg-red-500'
              : 'bg-blue-500'
          }`}
          style={{ width: `${video.progress}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between mt-2">
        <span className="text-sm text-gray-500">
          {video.status === 'completed'
            ? 'Upload complete'
            : video.status === 'error'
            ? 'Upload failed'
            : `${Math.round(video.progress)}%`}
        </span>
        <span className="text-sm text-gray-500">
          Chunks: {video.chunkStatus.filter(status => status === 'completed').length} / {video.chunks}
        </span>
      </div>
      
      {/* Chunk status indicators */}
      <div className="mt-2 flex gap-1 flex-wrap">
        {video.chunkStatus.map((status, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              status === 'completed'
                ? 'bg-green-500'
                : status === 'error'
                ? 'bg-red-500'
                : status === 'uploading'
                ? 'bg-blue-500'
                : 'bg-gray-300'
            }`}
            title={`Chunk ${index + 1}: ${status}`}
          />
        ))}
      </div>
    </div>
  );
};
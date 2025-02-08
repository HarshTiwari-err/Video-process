import React from 'react';
import { VideoFile } from '../types';
import { VideoItem } from './VideoItem';

interface VideoListProps {
  videos: VideoFile[];
}

export const VideoList: React.FC<VideoListProps> = ({ videos }) => {
  if (videos.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Uploads</h2>
      <div className="space-y-4">
        {videos.map(video => (
          <VideoItem key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};
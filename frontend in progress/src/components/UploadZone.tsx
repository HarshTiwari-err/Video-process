import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { VideoFile } from '../types';
import { createVideoFile } from '../utils/videoUtils';

interface UploadZoneProps {
  onFilesSelected: (files: VideoFile[]) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFilesSelected }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files).filter(file =>
        file.type.startsWith('video/')
      );
      const videoFiles = files.map(createVideoFile);
      onFilesSelected(videoFiles);
    },
    [onFilesSelected]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        const videoFiles = Array.from(files)
          .filter(file => file.type.startsWith('video/'))
          .map(createVideoFile);
        onFilesSelected(videoFiles);
      }
    },
    [onFilesSelected]
  );

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        multiple
        accept="video/*"
        onChange={handleFileSelect}
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer flex flex-col items-center"
      >
        <Upload className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-xl font-medium text-gray-700 mb-2">
          Drag and drop videos here
        </p>
        <p className="text-sm text-gray-500">or click to select files</p>
      </label>
    </div>
  );
};
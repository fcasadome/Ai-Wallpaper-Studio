
import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';
import { EditIcon } from './icons/EditIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface ImageCardProps {
  imageData: string;
  onEdit: () => void;
  onDownload: () => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ imageData, onEdit, onDownload }) => {
  const src = `data:image/jpeg;base64,${imageData}`;

  return (
    <div className="group relative aspect-[9/16] w-full bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105">
      <img src={src} alt="Generated wallpaper" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
        <div className="flex space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={onEdit}
            className="p-3 bg-white/20 rounded-full text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
            aria-label="Edit image"
          >
            <EditIcon />
          </button>
          <button
            onClick={onDownload}
            className="p-3 bg-white/20 rounded-full text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
            aria-label="Download image"
          >
            <DownloadIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

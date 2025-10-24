
import React, { useState, useRef, useEffect } from 'react';
import { ImageData } from '../types';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { UploadIcon } from './icons/UploadIcon';
import { CloseIcon } from './icons/CloseIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface EditModalProps {
  imageToEdit: ImageData;
  editedImage: string | null;
  isLoading: boolean;
  onClose: () => void;
  onPerformEdit: (prompt: string, image: ImageData) => void;
  onDownloadEdited: () => void;
  onUploadNewImage: (file: File) => void;
}

export const EditModal: React.FC<EditModalProps> = ({
  imageToEdit,
  editedImage,
  isLoading,
  onClose,
  onPerformEdit,
  onDownloadEdited,
  onUploadNewImage,
}) => {
  const [editPrompt, setEditPrompt] = useState('');
  const [currentImage, setCurrentImage] = useState(imageToEdit);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentImage(imageToEdit);
  }, [imageToEdit]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onUploadNewImage(event.target.files[0]);
    }
  };
  
  const handleEditClick = () => {
    if (editPrompt.trim() && currentImage) {
      onPerformEdit(editPrompt, currentImage);
    }
  };

  const srcOriginal = `data:${currentImage.mimeType};base64,${currentImage.data}`;
  const srcEdited = editedImage ? `data:image/jpeg;base64,${editedImage}` : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col relative text-white">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors z-10">
          <CloseIcon />
        </button>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Image Editor</h2>
        </div>

        <div className="flex-grow p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left Side: Original Image and Controls */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-gray-300">Original</h3>
            <div className="aspect-[9/16] w-full max-w-sm mx-auto bg-gray-900 rounded-md overflow-hidden">
                <img src={srcOriginal} alt="Original to edit" className="w-full h-full object-contain" />
            </div>
             <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              <UploadIcon className="w-5 h-5" />
              Upload New Image
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
            />
          </div>

          {/* Right Side: Edit Prompt and Result */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-gray-300">Edit & Result</h3>
            <div className="flex flex-col space-y-2">
                <label htmlFor="edit-prompt" className="text-sm font-medium text-gray-400">Editing Prompt</label>
                <textarea
                    id="edit-prompt"
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="e.g., Add a retro filter, make it winter..."
                    className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    rows={3}
                />
            </div>
            <button
              onClick={handleEditClick}
              disabled={isLoading || !editPrompt.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? <SpinnerIcon /> : 'Apply Edit'}
            </button>
            <div className="aspect-[9/16] w-full max-w-sm mx-auto bg-gray-900 rounded-md overflow-hidden flex items-center justify-center">
                {isLoading && !editedImage && <SpinnerIcon className="w-10 h-10 text-purple-400" />}
                {!isLoading && !editedImage && <div className="text-gray-500">Edited image will appear here</div>}
                {srcEdited && <img src={srcEdited} alt="Edited result" className="w-full h-full object-contain" />}
            </div>
            {editedImage && (
                <button
                    onClick={onDownloadEdited}
                    className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
                >
                    <DownloadIcon className="w-5 h-5" />
                    Download Edited Wallpaper
                </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

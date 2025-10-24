
import React, { useState, useCallback } from 'react';
import { generateWallpapers, editImage } from './services/geminiService';
import { downloadImage, fileToImageData } from './utils/fileUtils';
import { ImageData } from './types';
import { Header } from './components/Header';
import { ImageCard } from './components/ImageCard';
import { EditModal } from './components/EditModal';
import { SpinnerIcon } from './components/icons/SpinnerIcon';
import { CloseIcon } from './components/icons/CloseIcon';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoadingGeneration, setIsLoadingGeneration] = useState(false);
  const [isLoadingEditing, setIsLoadingEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [imageToEdit, setImageToEdit] = useState<ImageData | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt to generate wallpapers.");
      return;
    }
    setIsLoadingGeneration(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const images = await generateWallpapers(prompt);
      setGeneratedImages(images);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An unknown error occurred.");
    } finally {
      setIsLoadingGeneration(false);
    }
  };
  
  const handlePerformEdit = useCallback(async (editPrompt: string, image: ImageData) => {
    setIsLoadingEditing(true);
    setError(null);
    setEditedImage(null);
    try {
      const result = await editImage(editPrompt, image);
      setEditedImage(result);
    } catch (e: unknown) {
       setError(e instanceof Error ? e.message : "An unknown error occurred during editing.");
    } finally {
       setIsLoadingEditing(false);
    }
  }, []);

  const handleSelectImageForEdit = (imageData: string) => {
    setImageToEdit({ data: imageData, mimeType: 'image/jpeg' });
    setEditedImage(null); // Clear previous edit
  };

  const handleUploadNewImageForEdit = async (file: File) => {
    try {
        const imageData = await fileToImageData(file);
        setImageToEdit(imageData);
        setEditedImage(null); // Clear previous edit
    } catch (e) {
        setError("Could not process the uploaded file. Please try another image.");
    }
  };

  const closeModal = () => {
    setImageToEdit(null);
    setEditedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <main className="container mx-auto px-4 py-8">
        <Header />

        {/* Generation Prompt Section */}
        <div className="max-w-2xl mx-auto my-8">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="e.g., A majestic lion in a neon jungle"
              className="flex-grow p-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-lg"
              disabled={isLoadingGeneration}
            />
            <button
              onClick={handleGenerate}
              disabled={isLoadingGeneration}
              className="flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              {isLoadingGeneration ? <SpinnerIcon /> : "Generate"}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
            <div className="max-w-2xl mx-auto my-4 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md relative flex items-center justify-between">
                <span>{error}</span>
                <button onClick={() => setError(null)} className="text-red-300 hover:text-white">
                    <CloseIcon className="w-5 h-5" />
                </button>
            </div>
        )}

        {/* Image Gallery */}
        {isLoadingGeneration && (
            <div className="text-center py-10">
                <SpinnerIcon className="w-12 h-12 mx-auto text-purple-400" />
                <p className="mt-4 text-gray-400">Generating your stunning wallpapers...</p>
            </div>
        )}
        
        {generatedImages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {generatedImages.map((imgData, index) => (
              <ImageCard
                key={index}
                imageData={imgData}
                onEdit={() => handleSelectImageForEdit(imgData)}
                onDownload={() => downloadImage(imgData, 'image/jpeg', `wallpaper-${index + 1}.jpg`)}
              />
            ))}
          </div>
        )}

        {/* Initial state message */}
        {!isLoadingGeneration && generatedImages.length === 0 && (
            <div className="text-center py-20 text-gray-500">
                <p className="text-xl">Your generated wallpapers will appear here.</p>
                <p>Start by typing a prompt above!</p>
            </div>
        )}

      </main>

      {/* Edit Modal */}
      {imageToEdit && (
        <EditModal 
          imageToEdit={imageToEdit}
          editedImage={editedImage}
          isLoading={isLoadingEditing}
          onClose={closeModal}
          onPerformEdit={handlePerformEdit}
          onDownloadEdited={() => {
            if (editedImage) {
              downloadImage(editedImage, 'image/jpeg', 'edited-wallpaper.jpg');
            }
          }}
          onUploadNewImage={handleUploadNewImageForEdit}
        />
      )}
    </div>
  );
};

export default App;

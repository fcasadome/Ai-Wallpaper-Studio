
import { ImageData } from '../types';

export const fileToImageData = (file: File): Promise<ImageData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        // The result is in the format "data:image/jpeg;base64,..."
        // We need to split it to get the mimeType and the base64 data
        const [header, data] = event.target.result.split(',');
        const mimeType = header.match(/:(.*?);/)?.[1] || file.type;
        resolve({ data, mimeType });
      } else {
        reject(new Error('Failed to read file as a data URL.'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const downloadImage = (base64Data: string, mimeType: string, filename: string) => {
  const link = document.createElement('a');
  link.href = `data:${mimeType};base64,${base64Data}`;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

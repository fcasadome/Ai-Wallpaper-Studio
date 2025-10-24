
import { GoogleGenAI, Modality } from "@google/genai";
import { ImageData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateWallpapers = async (prompt: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `${prompt}, phone wallpaper, vertical aspect ratio, high resolution, stunning`,
      config: {
        numberOfImages: 4,
        aspectRatio: '9:16',
        outputMimeType: 'image/jpeg',
      },
    });
    return response.generatedImages.map(img => img.image.imageBytes);
  } catch (error) {
    console.error("Error generating wallpapers:", error);
    throw new Error("Failed to generate wallpapers. Please check your prompt or API key.");
  }
};

export const editImage = async (editPrompt: string, image: ImageData): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: image.data, mimeType: image.mimeType } },
                    { text: editPrompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        throw new Error("No edited image found in the API response.");
    } catch (error) {
        console.error("Error editing image:", error);
        throw new Error("Failed to edit the image. The model may not be able to perform this edit.");
    }
};

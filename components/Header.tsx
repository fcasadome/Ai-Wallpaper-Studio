
import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="text-center p-4 md:p-6">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                AI Wallpaper Studio
            </h1>
            <p className="text-gray-400 mt-2 text-md md:text-lg">
                Generate and edit stunning phone wallpapers with the power of Gemini AI.
            </p>
        </header>
    );
};

import React from 'react';
import { SearchBar } from './SearchBar';

interface WelcomeProps {
  onTopicSubmit: (topic: string) => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onTopicSubmit }) => {
  return (
    <div className="text-center text-[#f1ede9] animate-fade-in flex flex-col items-center p-4 w-full">
      <h1 className="text-5xl md:text-7xl font-serif-display font-bold mb-4 [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
        Mood Board <span className="text-[#d1c9c0]">AI</span>
      </h1>
      <p className="text-lg md:text-xl text-[#d1c9c0] mb-10 max-w-2xl">
        Transform your ideas into visual inspiration. Describe a theme, a feeling, or a scene, and let our AI curate a unique and aesthetic mood board just for you.
      </p>
      <div className="w-full flex justify-center">
        <SearchBar onTopicSubmit={onTopicSubmit} />
      </div>
    </div>
  );
};

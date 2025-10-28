import React, { useState } from 'react';
import { SearchBar } from './SearchBar';

interface WelcomeProps {
  onTopicSubmit: (topic: string) => void;
}

const suggestions = [
  "Vintage Parisian café on a rainy afternoon",
  "A tranquil Japanese zen garden in spring",
  "Cozy autumn reading nook with a warm blanket",
  "Futuristic solarpunk city with lush greenery",
];

export const Welcome: React.FC<WelcomeProps> = ({ onTopicSubmit }) => {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async () => {
    if (topic.trim()) {
      setIsLoading(true);
      // The parent component's onTopicSubmit is async, so we await it.
      await onTopicSubmit(topic);
      // No need to set isLoading to false, as the component will unmount on success.
    }
  };

  return (
    <div className="text-center text-[#f1ede9] animate-fade-in flex flex-col items-center p-4 w-full">
      <h1 className="text-5xl md:text-7xl font-serif-display font-bold mb-4 [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
        Mood Board <span className="text-[#d1c9c0]">AI</span>
      </h1>
      <p className="text-lg md:text-xl text-[#d1c9c0] mb-8 max-w-2xl">
        Transform your ideas into visual inspiration. Describe a theme, a feeling, or a scene, and let our AI curate a unique and aesthetic mood board just for you.
      </p>

      <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-3xl">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setTopic(suggestion)}
            className="px-4 py-2 bg-[#544c44]/50 text-[#f1ede9] rounded-full hover:bg-[#70665c] transition-colors text-sm backdrop-blur-sm"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <div className="w-full flex justify-center">
        <SearchBar 
          topic={topic}
          onTopicChange={setTopic}
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

import React, { useState } from 'react';

interface SearchBarProps {
  onTopicSubmit: (topic: string) => void;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onTopicSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      onTopicSubmit(topic);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-0 w-full max-w-xl shadow-lg">
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="e.g., 'Retro-futuristic synthwave diner'"
        className="w-full p-4 bg-[#f1ede9]/90 text-[#544c44] placeholder:text-[#8a8178] rounded-l-md border border-transparent focus:outline-none focus:ring-2 focus:ring-[#d1c9c0] focus:border-transparent transition-all backdrop-blur-sm"
        disabled={isLoading}
        required
      />
      <button
        type="submit"
        className="px-8 py-4 bg-[#70665c] text-white rounded-r-md hover:bg-[#544c44] transition-colors font-semibold disabled:bg-gray-500 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? '...' : 'Create'}
      </button>
    </form>
  );
};

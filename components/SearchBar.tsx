
import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (topic: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onSearch(topic);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-lg mx-auto">
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="e.g., 'A cozy corner for reading' or 'Data structures in Python'"
        className="flex-grow p-3 bg-[#f1ede9]/80 text-[#544c44] placeholder:text-[#8a8178] rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-[#d1c9c0] focus:border-transparent transition-all shadow-inner"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="px-6 py-3 bg-[#70665c] text-white rounded-md hover:bg-[#544c44] disabled:bg-[#8a8178] disabled:cursor-not-allowed transition-colors font-semibold"
        disabled={isLoading}
      >
        {isLoading ? 'Creating...' : 'Generate'}
      </button>
    </form>
  );
};

import React, { useState, useRef, useEffect } from 'react';

interface SearchBarProps {
  onTopicSubmit: (topic: string) => void;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onTopicSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 200; // Max height in pixels
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
      if (scrollHeight > maxHeight) {
        textarea.style.overflowY = 'auto';
      } else {
        textarea.style.overflowY = 'hidden';
      }
    }
  }, [topic]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      onTopicSubmit(topic);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative w-full shadow-lg rounded-lg bg-[#f1ede9]/90 backdrop-blur-sm transition-all focus-within:ring-2 focus-within:ring-[#d1c9c0]">
        <textarea
          ref={textareaRef}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g., 'A moody cyberpunk city alleyway on a rainy night, glowing neon signs reflecting on wet pavement...'"
          className="w-full p-4 pr-14 bg-transparent text-[#544c44] placeholder:text-[#8a8178] rounded-lg border-none focus:outline-none focus:ring-0 resize-none transition-all duration-200"
          disabled={isLoading}
          rows={1}
          style={{ overflowY: 'hidden' }}
          required
        />
        <button
          type="submit"
          className="absolute bottom-3 right-3 w-10 h-10 bg-[#70665c] text-white rounded-md hover:bg-[#544c44] transition-colors font-semibold disabled:bg-[#8a8178] disabled:cursor-not-allowed flex items-center justify-center"
          disabled={isLoading || !topic.trim()}
          aria-label="Create Mood Board"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
          )}
        </button>
      </div>
    </form>
  );
};

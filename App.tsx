
import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { MoodBoard } from './components/MoodBoard';
import { Loader } from './components/Loader';
import { Welcome } from './components/Welcome';
import { generateMoodBoardContent } from './services/geminiService';
import type { MoodBoardItem } from './types';

const App: React.FC = () => {
  const [moodBoardItems, setMoodBoardItems] = useState<MoodBoardItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateMoodBoard = async (topic: string) => {
    if (!topic.trim()) {
      setError('Please enter a topic.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setMoodBoardItems([]);

    try {
      const items = await generateMoodBoardContent(topic);
      // Shuffle items for a more organic feel
      const shuffledItems = items.sort(() => Math.random() - 0.5);
      setMoodBoardItems(shuffledItems);
    } catch (err) {
      console.error(err);
      setError('Sorry, something went wrong while creating your mood board. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#a1988e] p-4 sm:p-8 md:p-12 relative overflow-hidden flex flex-col items-center">
       {/* Shadow overlay to mimic lighting from a window */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-black/10 pointer-events-none"></div>
      
      <div className="w-full max-w-4xl z-10 mb-8">
        <h1 className="text-4xl sm:text-5xl font-serif-display text-center text-[#f1ede9] mb-2 font-bold tracking-wider">
          Visual Muse
        </h1>
        <p className="text-center text-[#d1c9c0] mb-6">Enter a topic and let AI craft your inspiration.</p>
        <SearchBar onSearch={handleGenerateMoodBoard} isLoading={isLoading} />
        {error && <p className="text-center text-red-200 mt-4 bg-red-800/50 p-2 rounded-md">{error}</p>}
      </div>
      
      <div className="w-full flex-grow flex items-center justify-center">
        {isLoading ? (
          <Loader />
        ) : moodBoardItems.length > 0 ? (
          <MoodBoard items={moodBoardItems} />
        ) : (
          <Welcome />
        )}
      </div>
    </main>
  );
};

export default App;

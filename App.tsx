
import React, { useState, useRef } from 'react';
import { SearchBar } from './components/SearchBar';
import { MoodBoard } from './components/MoodBoard';
import { Loader } from './components/Loader';
import { Welcome } from './components/Welcome';
import { ClarificationForm } from './components/ClarificationForm';
import { analyzeTopic, generateMoodBoardContent, generateMoreItems } from './services/geminiService';
import type { MoodBoardItem } from './types';

type AppState = 'idle' | 'analyzing' | 'needsClarification' | 'generating' | 'success' | 'error';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('idle');
  const [moodBoardItems, setMoodBoardItems] = useState<MoodBoardItem[]>([]);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [clarificationQuestions, setClarificationQuestions] = useState<string[]>([]);
  
  const [draggedItem, setDraggedItem] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const moodBoardRef = useRef<HTMLDivElement>(null);

  const handleProgress = (message: string) => {
    setLoadingMessage(message);
  };

  const handleSearch = async (topic: string) => {
    if (!topic.trim()) {
      setError('Please enter a topic.');
      return;
    }
    setAppState('analyzing');
    setError(null);
    setMoodBoardItems([]);
    setCurrentTopic(topic);
    setLoadingMessage('Analyzing topic...');

    try {
      const analysis = await analyzeTopic(topic);
      if (analysis.isClear) {
        await handleGenerate(topic);
      } else {
        setClarificationQuestions(analysis.questions || []);
        setAppState('needsClarification');
      }
    } catch (err) {
      console.error(err);
      setError('Sorry, something went wrong during analysis. Please try again.');
      setAppState('error');
    }
  };

  const handleGenerate = async (topic: string, answers: Record<string, string> = {}) => {
    setAppState('generating');
    try {
      const items = await generateMoodBoardContent(topic, answers, handleProgress);
      const shuffledItems = items.sort(() => Math.random() - 0.5);
      setMoodBoardItems(shuffledItems);
      setAppState('success');
    } catch (err) {
      console.error(err);
      setError('Sorry, something went wrong while creating your mood board. Please try again.');
      setAppState('error');
    }
  };

  const handleAddMore = async () => {
    setAppState('generating');
    setLoadingMessage('Adding new inspiration...');
     try {
      const newItems = await generateMoreItems(currentTopic, moodBoardItems.length, handleProgress);
      setMoodBoardItems(prevItems => [...prevItems, ...newItems]);
      setAppState('success');
    } catch (err) {
      console.error(err);
      setError('Could not add more items. Please try again.');
      setAppState('error');
    }
  }

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    const target = e.currentTarget as HTMLElement;
    // Find the draggable parent
    const itemEl = target.closest('[data-draggable="true"]');
    if (itemEl && moodBoardRef.current) {
        const rect = itemEl.getBoundingClientRect();
        const boardRect = moodBoardRef.current.getBoundingClientRect();
        setDraggedItem({
            id,
            offsetX: e.clientX - rect.left,
            offsetY: e.clientY - rect.top,
        });
        // Prevent default text selection behavior
        e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      if (!draggedItem || !moodBoardRef.current) return;
      const boardRect = moodBoardRef.current.getBoundingClientRect();
      
      const newLeft = e.clientX - draggedItem.offsetX - boardRect.left;
      const newTop = e.clientY - draggedItem.offsetY - boardRect.top;

      setMoodBoardItems(prevItems =>
          prevItems.map(item =>
              item.id === draggedItem.id
                  ? {
                      ...item,
                      style: {
                          ...item.style,
                          left: `${newLeft}px`,
                          top: `${newTop}px`,
                          zIndex: 99, // Bring to front while dragging
                      },
                  }
                  : item
          )
      );
  };

  const handleMouseUp = () => {
      if(draggedItem) {
        // Reset z-index after dropping
        setMoodBoardItems(prevItems =>
          prevItems.map(item =>
              item.id === draggedItem.id
                  ? {
                      ...item,
                      style: {
                          ...item.style,
                          zIndex: parseInt(String(item.style.zIndex), 10) > 10 ? undefined : item.style.zIndex,
                      },
                  }
                  : item
          )
      );
      }
      setDraggedItem(null);
  };


  const renderContent = () => {
    switch (appState) {
      case 'analyzing':
      case 'generating':
        return <Loader message={loadingMessage} />;
      case 'needsClarification':
        return <ClarificationForm questions={clarificationQuestions} onSubmit={(answers) => handleGenerate(currentTopic, answers)} />;
      case 'success':
        return <MoodBoard ref={moodBoardRef} items={moodBoardItems} onMouseDown={handleMouseDown} />;
      case 'idle':
      case 'error':
      default:
        return <Welcome />;
    }
  }

  return (
    <main 
      className="min-h-screen w-full bg-[#a1988e] p-4 sm:p-8 md:p-12 relative overflow-hidden flex flex-col items-center select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-black/10 pointer-events-none"></div>
      
      <div className="w-full max-w-4xl z-10 mb-8">
        <h1 className="text-4xl sm:text-5xl font-serif-display text-center text-[#f1ede9] mb-2 font-bold tracking-wider">
          Visual Muse
        </h1>
        <p className="text-center text-[#d1c9c0] mb-6">Enter a topic and let AI craft your inspiration.</p>
        <SearchBar onSearch={handleSearch} isLoading={appState === 'analyzing' || appState === 'generating'} />
        {appState === 'success' && (
           <div className="text-center mt-4">
            <button
              onClick={handleAddMore}
              className="px-6 py-2 bg-[#70665c]/80 text-white rounded-md hover:bg-[#544c44] disabled:bg-[#8a8178] disabled:cursor-not-allowed transition-colors font-semibold backdrop-blur-sm"
              disabled={appState === 'generating'}
            >
              + Add More
            </button>
           </div>
        )}
        {error && <p className="text-center text-red-200 mt-4 bg-red-800/50 p-2 rounded-md">{error}</p>}
      </div>
      
      <div className="w-full flex-grow flex items-center justify-center">
        {renderContent()}
      </div>
    </main>
  );
};

export default App;

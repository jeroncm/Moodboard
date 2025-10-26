import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Welcome } from './components/Welcome';
import { Loader } from './components/Loader';
import { ClarificationForm } from './components/ClarificationForm';
import { MoodBoard } from './components/MoodBoard';
import { analyzeTopic, generateMoodBoardContent, generateMoreItems } from './services/geminiService';
import type { MoodBoardItem } from './types';

type AppState = 'welcome' | 'clarifying' | 'loading' | 'board' | 'error';

function App() {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [topic, setTopic] = useState('');
  const [clarificationQuestions, setClarificationQuestions] = useState<string[]>([]);
  const [progressMessage, setProgressMessage] = useState('');
  const [items, setItems] = useState<MoodBoardItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);

  const boardRef = useRef<HTMLDivElement>(null);
  const [draggedItem, setDraggedItem] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);

  const handleTopicSubmit = async (newTopic: string) => {
    setTopic(newTopic);
    setItems([]);
    setAppState('loading');
    setProgressMessage('Analyzing your topic...');
    setError(null);
    try {
      const analysis = await analyzeTopic(newTopic);
      if (analysis.isClear) {
        await handleStartGeneration(newTopic, {});
      } else {
        setClarificationQuestions(analysis.questions || []);
        setAppState('clarifying');
      }
    } catch (e) {
      console.error(e);
      setError('Sorry, something went wrong while analyzing your topic. Please try again.');
      setAppState('error');
    }
  };

  const handleClarificationSubmit = async (newAnswers: Record<string, string>) => {
    await handleStartGeneration(topic, newAnswers);
  };

  const handleStartGeneration = async (currentTopic: string, currentAnswers: Record<string, string>) => {
    setAppState('loading');
    setProgressMessage('Starting mood board generation...');
    setError(null);
    try {
      const newItems = await generateMoodBoardContent(currentTopic, currentAnswers, setProgressMessage);
      setItems(newItems);
      setAppState('board');
    } catch (e) {
      console.error(e);
      setError('An error occurred while generating the mood board. Please try again.');
      setAppState('error');
    }
  };

  const handleGenerateMore = async () => {
    setIsGeneratingMore(true);
    setError(null);
    try {
        const newItems = await generateMoreItems(topic, items.length, () => {});
        setItems(prev => [...prev, ...newItems]);
    } catch (e) {
        console.error(e);
        setError('Could not generate more items. Please try again.');
    } finally {
        setIsGeneratingMore(false);
    }
  };

  const handleReset = () => {
    setAppState('welcome');
    setTopic('');
    setItems([]);
    setError(null);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    
    const maxZ = items.reduce((max, item) => Math.max(max, (item.style.zIndex as number) || 0), 0);
    setItems(prev => prev.map(item => item.id === id ? { ...item, style: { ...item.style, zIndex: maxZ + 1 } } : item));
    
    setDraggedItem({
      id,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    });
    e.preventDefault();
  }, [items]);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggedItem || !boardRef.current) return;
    
    const boardRect = boardRef.current.getBoundingClientRect();
    const newLeft = e.clientX - boardRect.left - draggedItem.offsetX;
    const newTop = e.clientY - boardRect.top - draggedItem.offsetY;

    setItems(prevItems => prevItems.map(item => {
        if (item.id === draggedItem.id) {
            const newLeftPercent = (newLeft / boardRect.width) * 100;
            const newTopPercent = (newTop / boardRect.height) * 100;

            const clampedTop = Math.max(-10, Math.min(90, newTopPercent));
            const clampedLeft = Math.max(-10, Math.min(90, newLeftPercent));

            return {
                ...item,
                style: {
                    ...item.style,
                    top: `${clampedTop}%`,
                    left: `${clampedLeft}%`,
                }
            };
        }
        return item;
    }));
  }, [draggedItem]);

  const handleMouseUp = useCallback(() => {
    setDraggedItem(null);
  }, []);

  useEffect(() => {
    if (!draggedItem) return;

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseUp);

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [draggedItem, handleMouseMove, handleMouseUp]);
  
  const renderContent = () => {
    switch(appState) {
        case 'welcome':
            return <Welcome onTopicSubmit={handleTopicSubmit} />;
        case 'clarifying':
            return <ClarificationForm questions={clarificationQuestions} onSubmit={handleClarificationSubmit} />;
        case 'loading':
            return <Loader message={progressMessage} />;
        case 'board':
            return (
                <div className="w-full h-full flex flex-col items-center animate-fade-in">
                    <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between gap-4 flex-wrap">
                        <h2 className="text-xl font-bold text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.5)] truncate">{topic}</h2>
                        <div className="flex items-center gap-2">
                            <button onClick={handleGenerateMore} disabled={isGeneratingMore} className="px-4 py-2 bg-[#70665c]/80 text-white rounded-md hover:bg-[#544c44] transition-colors backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed">
                                {isGeneratingMore ? 'Adding...' : '✨ Add More'}
                            </button>
                            <button onClick={handleReset} className="px-4 py-2 bg-[#f1ede9]/80 text-[#544c44] rounded-md hover:bg-white transition-colors backdrop-blur-sm">
                                New Topic
                            </button>
                        </div>
                    </div>
                    {error && <p className="absolute top-20 text-red-300 bg-red-900/50 p-2 rounded-md z-30">{error}</p>}
                    <MoodBoard ref={boardRef} items={items} onMouseDown={handleMouseDown} />
                </div>
            );
        case 'error':
            return (
                <div className="text-center text-[#f1ede9] animate-fade-in">
                    <h2 className="text-3xl font-serif-display font-bold mb-2">Oops!</h2>
                    <p className="text-[#d1c9c0] mb-8 max-w-md">{error}</p>
                    <button onClick={handleReset} className="px-6 py-3 bg-[#70665c] text-white rounded-md hover:bg-[#544c44] transition-colors font-semibold">
                        Try Again
                    </button>
                </div>
            );
    }
  };

  return (
    <main className="w-full min-h-screen bg-[#221f1c] bg-gradient-to-br from-[#221f1c] to-[#3a342f] flex items-center justify-center p-4 font-sans overflow-hidden">
        {renderContent()}
    </main>
  );
}

export default App;

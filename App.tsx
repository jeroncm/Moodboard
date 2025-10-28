import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Welcome } from './components/Welcome';
import { Loader } from './components/Loader';
import { ClarificationForm } from './components/ClarificationForm';
import { MoodBoard } from './components/MoodBoard';
import { ZoomView } from './components/ZoomView';
import { GalleryView } from './components/GalleryView';
import { analyzeTopic, generateMoodBoardContent, generateMoreItems } from './services/geminiService';
import { MoodBoardItem, ItemType, ImageItem } from './types';

type AppState = 'welcome' | 'clarifying' | 'loading' | 'board' | 'error';

interface Texture {
  name: string;
  className: string;
}

interface TextureSelectorProps {
  textures: Texture[];
  selectedTexture: string;
  onChange: (className: string) => void;
}

const TextureSelector: React.FC<TextureSelectorProps> = ({ textures, selectedTexture, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="px-4 py-2 bg-[#70665c]/80 text-white rounded-md hover:bg-[#544c44] transition-colors backdrop-blur-sm flex items-center gap-2"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l.34 3.44 3.44.34-2.6 2.6.62 3.6-3.26-1.72-3.26 1.72.62-3.6-2.6-2.6 3.44-.34L12 2.69zM2 12l.34-3.44L5.78 8.2l-2.6 2.6L3.8 14.4l-3.26 1.72 3.26-1.72L2.18 10.8l2.6-2.6-3.44.34L2 12zM12 21.31l-.34-3.44-3.44-.34 2.6-2.6-.62-3.6 3.26 1.72 3.26-1.72-.62 3.6 2.6 2.6-3.44.34L12 21.31z"/></svg>
        Texture
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-[#3a342f] border border-[#544c44] rounded-md shadow-lg z-50 overflow-hidden animation-fade-in">
          <ul role="menu">
            {textures.map(texture => (
              <li key={texture.className}>
                <button 
                  role="menuitemradio"
                  aria-checked={selectedTexture === texture.className}
                  onClick={() => {
                    onChange(texture.className);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-white/80 hover:bg-[#544c44] hover:text-white transition-colors flex justify-between items-center"
                >
                  <span>{texture.name}</span>
                  {selectedTexture === texture.className && <span className="text-sm">✔</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


function App() {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [topic, setTopic] = useState('');
  const [clarificationQuestions, setClarificationQuestions] = useState<string[]>([]);
  const [progressMessage, setProgressMessage] = useState('');
  const [items, setItems] = useState<MoodBoardItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);
  const [zoomedItem, setZoomedItem] = useState<MoodBoardItem | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [backgroundTexture, setBackgroundTexture] = useState('texture-noise');

  const boardRef = useRef<HTMLDivElement>(null);
  const [draggedItem, setDraggedItem] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);

  const textures: Texture[] = [
    { name: 'Subtle Noise', className: 'texture-noise' },
    { name: 'Paper Fiber', className: 'texture-paper' },
    { name: 'Linen Weave', className: 'texture-linen' },
    { name: 'Wood Grain', className: 'texture-wood' },
  ];

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
  
  const handleItemClick = (item: MoodBoardItem) => {
    setZoomedItem(item);
  };

  const handleCloseZoom = () => {
    setZoomedItem(null);
  };
  
  const handleOpenGallery = () => {
    setIsGalleryOpen(true);
  };

  const handleCloseGallery = () => {
    setIsGalleryOpen(false);
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
                            <TextureSelector textures={textures} selectedTexture={backgroundTexture} onChange={setBackgroundTexture} />
                            <button onClick={handleOpenGallery} className="px-4 py-2 bg-[#70665c]/80 text-white rounded-md hover:bg-[#544c44] transition-colors backdrop-blur-sm flex items-center gap-2">
                               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                                Gallery
                            </button>
                            <button onClick={handleGenerateMore} disabled={isGeneratingMore} className="px-4 py-2 bg-[#70665c]/80 text-white rounded-md hover:bg-[#544c44] transition-colors backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed">
                                {isGeneratingMore ? 'Adding...' : '✨ Add More'}
                            </button>
                            <button onClick={handleReset} className="px-4 py-2 bg-[#f1ede9]/80 text-[#544c44] rounded-md hover:bg-white transition-colors backdrop-blur-sm">
                                New Topic
                            </button>
                        </div>
                    </div>
                    {error && <p className="absolute top-20 text-red-300 bg-red-900/50 p-2 rounded-md z-30">{error}</p>}
                    <MoodBoard ref={boardRef} items={items} onMouseDown={handleMouseDown} onItemClick={handleItemClick} />
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
    <main className={`w-full min-h-screen bg-[#221f1c] bg-gradient-to-br from-[#221f1c] to-[#3a342f] flex items-center justify-center p-4 font-sans overflow-hidden relative ${backgroundTexture}`}>
        {renderContent()}
        {isGalleryOpen && (
            <GalleryView
                items={items.filter(item => item.type === ItemType.Image) as ImageItem[]}
                onClose={handleCloseGallery}
                onImageClick={handleItemClick}
            />
        )}
        {zoomedItem && <ZoomView item={zoomedItem} onClose={handleCloseZoom} />}
    </main>
  );
}

export default App;
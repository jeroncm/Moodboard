
import React from 'react';

const IdeaBubble: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`bg-[#f1ede9]/80 text-[#544c44] rounded-lg px-4 py-2 shadow-md text-sm ${className}`}>
        {children}
    </div>
);

export const Welcome: React.FC = () => {
    return (
        <div className="text-center text-[#f1ede9] max-w-2xl p-8 rounded-lg bg-black/10 backdrop-blur-sm">
            <h2 className="text-3xl font-serif-display font-bold mb-4">Unlock Your Next Big Idea</h2>
            <p className="text-[#d1c9c0] mb-8">
                Whether you're designing a room, planning a project, or just seeking clarity,
                our AI-powered mood board is here to help visualize your thoughts.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
                <IdeaBubble>🎨 Plan a color scheme for a website</IdeaBubble>
                <IdeaBubble>🌱 Get ideas for a small balcony garden</IdeaBubble>
                <IdeaBubble>💻 Visualize a 'focused study' desktop setup</IdeaBubble>
                <IdeaBubble>📚 Brainstorm a theme for a fantasy novel</IdeaBubble>
                <IdeaBubble>🛋️ Mood board for a mid-century modern living room</IdeaBubble>
                <IdeaBubble>📈 Create visuals for a sales pitch on sustainability</IdeaBubble>
            </div>
        </div>
    );
};

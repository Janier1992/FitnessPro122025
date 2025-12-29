import React, { useState } from 'react';

export const MusicPlayer: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentPlaylist, setCurrentPlaylist] = useState('workout'); // workout, cardio, yoga

    const playlists: { [key: string]: string } = {
        workout: 'https://www.youtube.com/embed/videoseries?list=PLw-VjHDlEOgvtnnnqWlTqByAtC7tXCcAa',
        cardio: 'https://www.youtube.com/embed/videoseries?list=PLw-VjHDlEOgtL5yGvFVJgJ8E_sYVn_h1X',
        yoga: 'https://www.youtube.com/embed/videoseries?list=PLw-VjHDlEOgsj5fHh2yXF9wLzC2gqBw7X'
    };

    return (
        <div className={`fixed bottom-4 right-4 z-40 transition-all duration-300 ${isOpen ? 'w-80' : 'w-12'}`}>
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-12 h-12 bg-brand-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-brand-secondary transition-colors animate-pulse"
                    title="Música Fitness"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
                </button>
            )}

            {isOpen && (
                <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-3 bg-slate-800 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
                            <span className="font-bold text-sm">Fitness Flow Music</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>

                    <div className="p-2 flex gap-2 overflow-x-auto">
                        {Object.keys(playlists).map(type => (
                            <button
                                key={type}
                                onClick={() => setCurrentPlaylist(type)}
                                className={`px-3 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap ${currentPlaylist === type ? 'bg-brand-primary text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    <div className="aspect-video">
                        <iframe
                            width="100%"
                            height="100%"
                            src={playlists[currentPlaylist]}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
};

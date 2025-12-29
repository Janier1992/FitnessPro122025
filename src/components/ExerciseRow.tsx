
import React, { useState, useRef, useEffect } from 'react';
import { type Exercise } from '../types';
// import { EXERCISE_DATA } from '../data/exercises'; // Removed

interface ExerciseRowProps {
    exercise: Exercise;
}

export const ExerciseRow: React.FC<ExerciseRowProps> = ({ exercise }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isVideoLoading, setIsVideoLoading] = useState(true);
    const [videoError, setVideoError] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Logic simplified: use properties directly
    const imageUrl = exercise.imageUrl || `https://loremflickr.com/320/240/${exercise.imageSearchQuery.replace(/\s/g, ',')},gym,exercise/all?lock=${encodeURIComponent(exercise.name)}`;
    const videoUrl = exercise.videoUrl;

    // Handle video playback logic
    useEffect(() => {
        if (isExpanded && videoRef.current && videoUrl && !videoError) {
            // Reset loading state when expanded
            setIsVideoLoading(true);
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        // Playback started successfully
                    })
                    .catch(e => {
                        console.log('Autoplay prevented or interrupted', e);
                        // If play fails, we might want to show the poster/image
                    });
            }
        } else if (!isExpanded && videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }, [isExpanded, videoUrl, videoError]);

    const handleVideoLoaded = () => {
        setIsVideoLoading(false);
    };

    const handleVideoError = () => {
        setVideoError(true);
        setIsVideoLoading(false);
    };

    return (
        <div className="border-b border-gray-700/50 last:border-b-0">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
                className="w-full text-left p-4 hover:bg-gray-700/40 focus:outline-none focus:bg-gray-700/60 transition-colors duration-200"
            >
                <div className="grid grid-cols-4 gap-2 items-center">
                    <div className="col-span-4 sm:col-span-2 flex items-center gap-2">
                        {videoUrl && (
                            <span className="bg-brand-primary text-brand-dark text-[10px] px-1.5 py-0.5 rounded font-bold flex-shrink-0">VIDEO</span>
                        )}
                        <p className="font-semibold text-gray-100">{exercise.name}</p>
                    </div>
                    <div className="text-center">
                        <span className="text-xs text-gray-400 sm:hidden">Series</span>
                        <p className="text-gray-200">{exercise.sets}</p>
                    </div>
                    <div className="text-center">
                        <span className="text-xs text-gray-400 sm:hidden">Reps</span>
                        <p className="text-gray-200">{exercise.reps}</p>
                    </div>
                </div>
            </button>
            {isExpanded && (
                <div className="p-4 bg-gray-900/50 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <h5 className="font-semibold text-brand-accent mb-2">Instrucciones Técnicas</h5>
                            <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed">{exercise.description}</p>
                            <div className="flex flex-wrap gap-4 mt-4">
                                <div className="bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700">
                                    <span className="text-xs text-gray-400 block uppercase">Descanso</span>
                                    <span className="font-bold text-white">{exercise.rest} seg</span>
                                </div>
                                {/* Category display removed as it depended on static library match */}
                            </div>
                        </div>
                        <div className="md:col-span-1 flex items-center justify-center">
                            <div className="w-full max-w-xs rounded-lg shadow-lg overflow-hidden border border-gray-700 bg-black relative group aspect-video">
                                {videoUrl && !videoError ? (
                                    <>
                                        <video
                                            ref={videoRef}
                                            src={videoUrl}
                                            poster={imageUrl}
                                            className={`w-full h-full object-cover transition-opacity duration-300 ${isVideoLoading ? 'opacity-0' : 'opacity-100'}`}
                                            muted
                                            loop
                                            playsInline
                                            controls={false}
                                            onLoadedData={handleVideoLoaded}
                                            onError={handleVideoError}
                                            preload="metadata"
                                        />
                                        {/* Loading Spinner */}
                                        {isVideoLoading && (
                                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                                <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                        {/* Poster Image (shown while loading) */}
                                        {isVideoLoading && (
                                            <img
                                                src={imageUrl}
                                                alt={`Loading ${exercise.name}`}
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                        )}

                                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1 z-20">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 animate-pulse" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                            Video Instruccional
                                        </div>
                                    </>
                                ) : (
                                    <img
                                        src={imageUrl}
                                        alt={`Demostración de ${exercise.name}`}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


import React, { useState, useRef, useEffect } from 'react';
import { getAICoachResponse, getDailyWellnessTip, generateFitnessVideoPreview } from '../services/geminiService';
import { type ChatMessage } from '../types';
import { User } from '../types';
import { GoogleGenAI, LiveServerMessage, Modality, type Blob as GenAIBlob } from "@google/genai";

// Helper functions for base64 encoding/decoding
function encode(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

// Helper function for decoding raw PCM audio data
async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}


const AiIcon = () => (
    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        AI
    </div>
);

const UserIcon: React.FC<{ name: string }> = ({ name }) => (
    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm flex-shrink-0">
        {name.substring(0, 1).toUpperCase()}
    </div>
);

const LinkIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>);

const MicIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-14 0m7 6v4m0 0H9m4 0h-4m-1-11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1h-2a1 1 0 01-1-1v-5z" /> </svg>);
const StopIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M9 10h6v4H9z" /> </svg>);

const VideoIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /> </svg>);


const AIMessage: React.FC<{ message: ChatMessage }> = ({ message }) => (
    <div className="flex gap-3 my-4">
        <AiIcon />
        <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm border border-slate-200 max-w-lg animate-fade-in">
            <p className="text-slate-700 whitespace-pre-wrap">{message.text}</p>
            {message.sources && message.sources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-200/60">
                    <h5 className="text-xs font-semibold text-slate-500 mb-1">Fuentes:</h5>
                    <ul className="space-y-1">
                        {message.sources.map((source, index) => (
                            <li key={index} className="text-xs">
                                <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate block">
                                    <LinkIcon />
                                    {source.title || source.uri}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    </div>
);

const UserMessage: React.FC<{ text: string; name: string; }> = ({ text, name }) => (
    <div className="flex gap-3 my-4 justify-end">
        <div className="bg-brand-primary text-white p-3 rounded-lg rounded-br-none shadow-sm max-w-lg animate-fade-in">
            <p className="whitespace-pre-wrap">{text}</p>
        </div>
        <UserIcon name={name} />
    </div>
);

const DailyTip: React.FC = () => {
    const [tip, setTip] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTip = async () => {
            try {
                const dailyTip = await getDailyWellnessTip();
                setTip(dailyTip);
            } catch (error) {
                setTip("Recuerda que cada pequeño paso cuenta en tu camino hacia el bienestar. ¡Sigue adelante!");
            } finally {
                setIsLoading(false);
            }
        };
        fetchTip();
    }, []);

    return (
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-xl shadow-lg border border-yellow-200">
            <h3 className="font-bold text-yellow-900 mb-3 text-lg flex items-center gap-2">💡 Consejo de Bienestar del Día</h3>
            {isLoading ? (
                <p className="text-yellow-800 text-sm animate-pulse">Generando tu consejo...</p>
            ) : (
                <p className="text-yellow-800">{tip}</p>
            )}
        </div>
    );
};

// Veo Video Generator Component
const VideoGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);
        setVideoUrl(null);
        try {
            const url = await generateFitnessVideoPreview(prompt);
            if (url) {
                setVideoUrl(url);
            } else {
                alert("No se pudo generar el video. Intenta de nuevo.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-2 text-lg flex items-center gap-2">🎥 Generador de Video (Veo)</h3>
            <p className="text-sm text-slate-500 mb-4">Visualiza ejercicios que no existen. Describe el movimiento.</p>

            <div className="space-y-3">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ej: Squat futurista en marte con luces de neón"
                    className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary focus:outline-none"
                    rows={3}
                />
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt}
                    className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 transition-colors flex justify-center items-center gap-2"
                >
                    {isGenerating ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <VideoIcon />}
                    {isGenerating ? 'Generando (esto demora)...' : 'Generar Preview Veo'}
                </button>
            </div>

            {videoUrl && (
                <div className="mt-4 rounded-lg overflow-hidden border border-slate-200 animate-fade-in">
                    <video src={videoUrl} controls autoPlay muted loop className="w-full aspect-video bg-black"></video>
                </div>
            )}
        </div>
    );
};

// New Live Coach component
const LiveCoach: React.FC = () => {
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [transcription, setTranscription] = useState<string[]>([]);
    const [currentInterim, setCurrentInterim] = useState('');
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const audioStreamRef = useRef<MediaStream | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);

    const startSession = async () => {
        if (!import.meta.env.VITE_GEMINI_API_KEY) {
            alert("La clave API no está configurada.");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioStreamRef.current = stream;

            const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

            const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            inputAudioContextRef.current = inputAudioContext;
            const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            const outputNode = outputAudioContext.createGain();
            outputNode.connect(outputAudioContext.destination);

            let nextStartTime = 0;
            const sources = new Set<AudioBufferSourceNode>();

            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setIsSessionActive(true);
                        setTranscription(['AI: ¡Hola! Soy tu coach de voz. ¿En qué puedo ayudarte?']);
                        const source = inputAudioContext.createMediaStreamSource(stream);
                        sourceNodeRef.current = source;
                        const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const l = inputData.length;
                            const int16 = new Int16Array(l);
                            for (let i = 0; i < l; i++) {
                                int16[i] = inputData[i] * 32768;
                            }
                            const pcmBlob: GenAIBlob = {
                                data: encode(new Uint8Array(int16.buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };

                            sessionPromise.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContext.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) {
                            setCurrentInterim(message.serverContent?.inputTranscription?.text || '');
                        }
                        if (message.serverContent?.turnComplete) {
                            const userInput = currentInterim;
                            if (userInput) setTranscription(prev => [...prev, `Tú: ${userInput}`]);
                            setCurrentInterim('');
                        }
                        const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                        if (base64Audio) {
                            if (message.serverContent?.modelTurn?.parts?.[0]?.text) {
                                setTranscription(prev => [...prev, `AI: ${message.serverContent?.modelTurn?.parts?.[0]?.text}`]);
                            }
                            nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
                            const source = outputAudioContext.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputNode);
                            source.addEventListener('ended', () => sources.delete(source));
                            source.start(nextStartTime);
                            nextStartTime += audioBuffer.duration;
                            sources.add(source);
                        }
                    },
                    onerror: (e) => {
                        console.error('Live session error:', e);
                        setTranscription(prev => [...prev, 'Error: Hubo un problema con la conexión.']);
                        stopSession();
                    },
                    onclose: () => {
                        stopSession();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                },
            });
            sessionPromiseRef.current = sessionPromise;

        } catch (error) {
            console.error('Failed to start session:', error);
            alert('No se pudo acceder al micrófono. Por favor, verifica los permisos.');
        }
    };

    const stopSession = () => {
        sessionPromiseRef.current?.then((session: any) => session.close());
        sessionPromiseRef.current = null;

        audioStreamRef.current?.getTracks().forEach(track => track.stop());
        audioStreamRef.current = null;

        scriptProcessorRef.current?.disconnect();
        scriptProcessorRef.current = null;
        sourceNodeRef.current?.disconnect();
        sourceNodeRef.current = null;

        inputAudioContextRef.current?.close();
        inputAudioContextRef.current = null;

        setIsSessionActive(false);
        setCurrentInterim('');
    };

    useEffect(() => {
        return () => {
            if (isSessionActive) {
                stopSession();
            }
        };
    }, [isSessionActive]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-2 text-lg">🎙️ AI Live Coach</h3>
            <p className="text-sm text-slate-500 mb-4">Habla directamente con tu coach para obtener respuestas y motivación al instante.</p>

            <div className="bg-slate-100 p-4 rounded-lg min-h-[150px] max-h-[300px] overflow-y-auto text-sm text-slate-700 space-y-2">
                {transcription.map((line, index) => <p key={index}>{line}</p>)}
                {currentInterim && <p className="text-slate-500 italic">Tú: {currentInterim}...</p>}
            </div>

            <div className="mt-4">
                {!isSessionActive ? (
                    <button onClick={startSession} className="w-full flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors">
                        <MicIcon /> Iniciar Conversación
                    </button>
                ) : (
                    <button onClick={stopSession} className="w-full flex items-center justify-center gap-2 bg-red-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-600 transition-colors">
                        <StopIcon /> Detener Conversación
                    </button>
                )}
            </div>
        </div>
    );
}


interface AIWellnessHubProps {
    user: User;
}

export const AIWellnessHub: React.FC<AIWellnessHubProps> = ({ user }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { sender: 'ai', text: `¡Hola, ${user.name.split(' ')[0]}! 👋 Soy tu Coach de Bienestar de FitnessFlow.\n\nEstoy aquí para ayudarte con tus dudas sobre fitness, nutrición o para darte un empujón de motivación. ¿En qué te puedo ayudar hoy?`, }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: ChatMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const { text, sources } = await getAICoachResponse(currentInput);
            const aiMessage: ChatMessage = { sender: 'ai', text, sources };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = { sender: 'ai', text: 'Lo siento, hubo un error al procesar tu solicitud.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 animate-fade-in">
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Centro de Bienestar AI</h1>
                <p className="mt-2 text-lg text-slate-600 max-w-2xl">Tu espacio para el equilibrio entre mente y cuerpo.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chat Column */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-slate-100 flex flex-col h-[70vh] lg:h-auto">
                    <div className="p-4 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                            <AiIcon />
                            <div>
                                <h2 className="font-bold text-slate-800">Coach de Bienestar FitnessFlow ✨</h2>
                                <p className="text-sm text-green-600 font-semibold">En línea</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-grow p-4 overflow-y-auto bg-slate-50 h-96">
                        {messages.map((msg, index) => (
                            msg.sender === 'ai' ? <AIMessage key={index} message={msg} /> : <UserMessage key={index} text={msg.text} name={user.name} />
                        ))}
                        {isLoading && (
                            <div className="flex gap-3 my-4">
                                <AiIcon />
                                <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm border border-slate-200">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0.1s]"></div>
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="p-4 border-t border-slate-200">
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Escribe tu pregunta sobre bienestar..."
                                className="w-full pl-4 pr-12 py-3 border border-slate-300 rounded-full focus:ring-2 focus:ring-brand-primary focus:outline-none"
                                disabled={isLoading}
                            />
                            <button onClick={handleSend} disabled={isLoading} className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-white bg-brand-primary rounded-full hover:bg-brand-secondary disabled:bg-slate-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-8">
                    <DailyTip />
                    <LiveCoach />
                    <VideoGenerator />
                </div>
            </div>
        </div>
    );
};

import React, { useState, useEffect } from 'react';
import { User, DailyCheckin, AIInsight } from '../types';
import { ChecklistWidget } from '../components/ChecklistWidget';
import { DailyCheckinModal } from '../components/DailyCheckinModal';
import { SmartRecommendations } from '../components/SmartRecommendations';
import { AIGuideWidget } from '../components/AIGuideWidget';
import { GamificationWidget } from '../components/GamificationWidget';
import { SocialFeed } from '../components/SocialFeed';
import { LeaderboardWidget } from '../components/LeaderboardWidget';
import { generateContextualInsight } from '../services/geminiService';
import { ACTIVE_CHALLENGES, SOCIAL_FEED, LEADERBOARD_DATA } from '../data/gamification';

const StatCard: React.FC<{ label: string; value: string | number; trend?: string; icon: string; delay: string }> = ({ label, value, trend, icon, delay }) => (
    <div className={`glass-panel p-5 rounded-2xl flex flex-col justify-between h-full relative overflow-hidden group hover:bg-white/5 transition-colors duration-300 animate-fade-in ${delay}`}>
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-6xl select-none grayscale">
            {icon}
        </div>
        <div className="flex justify-between items-start z-10">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</p>
            {trend && <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-500/30">{trend}</span>}
        </div>
        <div className="z-10 mt-4">
            <p className="text-3xl font-black text-white tracking-tight group-hover:scale-105 transition-transform duration-300 origin-left">{value}</p>
        </div>
    </div>
);

interface DashboardProps {
    user: User;
    onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
    const [showCheckin, setShowCheckin] = useState(false);
    const [dailyStatus, setDailyStatus] = useState<DailyCheckin | null>(null);
    const [aiInsight, setAiInsight] = useState<AIInsight | null>(null);

    useEffect(() => {
        const checkinKey = `checkin_${new Date().toDateString()}_${user.email}`;
        const hasCheckedIn = localStorage.getItem(checkinKey);
        const insightKey = `insight_${new Date().toDateString()}_${user.email}`;
        const savedInsight = localStorage.getItem(insightKey);

        if (!hasCheckedIn) {
            const timer = setTimeout(() => setShowCheckin(true), 1200);
            return () => clearTimeout(timer);
        } else {
            const savedData = JSON.parse(hasCheckedIn);
            setDailyStatus(savedData);

            if (savedInsight) {
                setAiInsight(JSON.parse(savedInsight));
            } else {
                fetchInsight(savedData);
            }
        }
    }, [user.email]);

    const fetchInsight = async (status: DailyCheckin) => {
        try {
            const insight = await generateContextualInsight(status, user.name.split(' ')[0]);
            setAiInsight(insight);
            localStorage.setItem(`insight_${new Date().toDateString()}_${user.email}`, JSON.stringify(insight));
        } catch (error) {
            console.error("Failed to fetch insight");
        }
    };

    const handleCheckinComplete = async (data: Omit<DailyCheckin, 'date'>) => {
        const fullData: DailyCheckin = {
            ...data,
            date: new Date().toISOString()
        };
        setDailyStatus(fullData);
        localStorage.setItem(`checkin_${new Date().toDateString()}_${user.email}`, JSON.stringify(fullData));
        setShowCheckin(false);
        await fetchInsight(fullData);
    };

    const handleAIAction = () => {
        if (!aiInsight) return;
        switch (aiInsight.type) {
            case 'recovery': onNavigate('Clases Grupales'); break;
            case 'performance': onNavigate('Mis Rutinas'); break;
            case 'caution': onNavigate('Bienestar AI'); break;
            default: onNavigate('Mis Rutinas');
        }
    };

    const checklistItems = [
        { id: '1', label: 'Completa tu perfil físico', isCompleted: true },
        { id: '2', label: 'Genera tu rutina con IA', isCompleted: false, actionLabel: 'Ir a Rutinas' },
        { id: '3', label: 'Reserva una clase', isCompleted: false, actionLabel: 'Ver Clases' },
    ];

    return (
        <div className="container mx-auto px-4 py-6 md:py-8 space-y-6 animate-fade-in max-w-7xl">

            {/* Header Moderno */}
            {/* SinFlow Hero Section */}
            <div className="relative overflow-hidden rounded-3xl glass-panel p-6 md:p-8 mb-2 group">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-brand-primary/10 blur-3xl rounded-full pointer-events-none group-hover:bg-brand-primary/20 transition-all duration-700"></div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-brand-secondary/10 blur-3xl rounded-full pointer-events-none group-hover:bg-brand-secondary/20 transition-all duration-700"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <p className="text-brand-primary text-xs font-bold uppercase tracking-widest mb-3">
                            {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
                            Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">{user.name.split(' ')[0]}</span>
                        </h1>
                        <p className="text-slate-400 max-w-lg text-sm md:text-base">
                            ¿Listo para superar tus límites hoy? Tu entrenador AI está analizando tu progreso en tiempo real.
                        </p>
                    </div>

                    {/* Level Badge Refined */}
                    <div className="flex items-center gap-4 bg-black/20 border border-white/5 px-5 py-3 rounded-2xl backdrop-blur-md hover:border-brand-primary/30 transition-colors">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold shadow-neon">
                                {user.gamification?.level || 5}
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-brand-dark rounded-full p-0.5">
                                <span className="block w-3 h-3 bg-green-500 rounded-full border-2 border-brand-dark"></span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rango Actual</span>
                            <span className="text-base font-bold text-white">{user.gamification?.title || 'Élite'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* BENTO GRID LAYOUT */}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(180px,auto)]">

                {/* 1. AI Hero Widget (Large, Col Span 2 or 3) */}
                <div className="md:col-span-4 lg:col-span-3 row-span-1 min-h-[220px]">
                    {aiInsight ? (
                        <AIGuideWidget
                            insight={aiInsight}
                            userName={user.name.split(' ')[0]}
                            onAction={handleAIAction}
                        />
                    ) : (
                        <div className="glass-panel rounded-2xl h-full flex items-center justify-center animate-pulse border border-white/5">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-8 h-8 border-t-2 border-l-2 border-brand-primary rounded-full animate-spin"></div>
                                <p className="text-slate-400 font-mono text-sm">Sincronizando Neural Core...</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. Gamification Widget (Side, Tall) */}
                <div className="md:col-span-2 lg:col-span-1 lg:row-span-2 h-full">
                    <GamificationWidget user={user} challenges={ACTIVE_CHALLENGES} />
                </div>

                {/* 3. Quick Stats (Small Squares) */}
                <div className="md:col-span-2 lg:col-span-1">
                    <StatCard label="Entrenamientos" value="3/4" trend="Semanal" icon="🏋️" delay="delay-[100ms]" />
                </div>
                <div className="md:col-span-2 lg:col-span-1">
                    <StatCard label="Calorías" value="2,150" trend="+12%" icon="🔥" delay="delay-[200ms]" />
                </div>
                <div className="md:col-span-2 lg:col-span-1">
                    <StatCard label="Racha" value="5 Días" trend="En llamas" icon="⚡" delay="delay-[300ms]" />
                </div>

                {/* 4. Smart Recommendations (Wide) */}
                {dailyStatus && (
                    <div className="md:col-span-4 lg:col-span-3">
                        <div className="glass-panel p-6 rounded-2xl border border-slate-700/50">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-brand-primary">✦</span> Recomendado para Hoy
                            </h2>
                            <SmartRecommendations status={dailyStatus} onNavigate={onNavigate} />
                        </div>
                    </div>
                )}

                {/* 5. Checklist (Compact) */}
                <div className="md:col-span-2 lg:col-span-2">
                    <ChecklistWidget title="Tu Camino" items={checklistItems} />
                </div>

                {/* 6. Action Cards */}
                <div className="md:col-span-2 lg:col-span-2 grid grid-cols-2 gap-4">
                    <div
                        onClick={() => onNavigate('Explorar Gimnasios')}
                        className="glass-panel p-4 rounded-2xl cursor-pointer hover:border-brand-primary/50 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-2 text-brand-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <h3 className="font-bold text-white">Explorar</h3>
                            <p className="text-xs text-slate-400">Gimnasios cerca</p>
                        </div>
                    </div>
                    <div
                        onClick={() => onNavigate('Bienestar AI')}
                        className="glass-panel p-4 rounded-2xl cursor-pointer hover:border-brand-secondary/50 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-2 text-brand-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                            </div>
                            <h3 className="font-bold text-white">Coach AI</h3>
                            <p className="text-xs text-slate-400">Consulta 24/7</p>
                        </div>
                    </div>
                </div>

                {/* 7. Social & Leaderboard (Full Width Bottom) */}
                <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <LeaderboardWidget data={LEADERBOARD_DATA} currentUserId={user.name} />
                    <SocialFeed activities={SOCIAL_FEED} />
                </div>

            </div>

            {showCheckin && (
                <DailyCheckinModal
                    userName={user.name.split(' ')[0]}
                    onComplete={handleCheckinComplete}
                />
            )}
        </div>
    );
};
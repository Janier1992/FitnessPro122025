import React from 'react';
import { User, Challenge } from '../types';
import { LEVEL_TITLES } from '../data/gamification';

interface GamificationWidgetProps {
    user: User;
    challenges: Challenge[];
}

export const GamificationWidget: React.FC<GamificationWidgetProps> = ({ user, challenges }) => {
    const xp = user.gamification?.xp || 12050;
    const level = user.gamification?.level || 5;
    const title = user.gamification?.title || 'Élite';
    
    const nextLevelData = LEVEL_TITLES.find(l => l.level === level + 1) || { minXP: xp * 1.5 };
    const currentLevelData = LEVEL_TITLES.find(l => l.level === level) || { minXP: 0 };
    
    const range = nextLevelData.minXP - currentLevelData.minXP;
    const progress = xp - currentLevelData.minXP;
    const percentage = Math.min(100, Math.max(0, (progress / range) * 100));

    return (
        <div className="glass-panel rounded-2xl p-6 h-full flex flex-col justify-between relative overflow-hidden border-l-4 border-l-brand-primary">
            {/* Background decorative grid */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
            
            {/* Header: Level & Title */}
            <div className="flex justify-between items-start mb-6 z-10">
                <div>
                    <p className="text-[10px] text-brand-primary font-bold uppercase tracking-widest mb-1">Status Actual</p>
                    <h3 className="font-black text-2xl text-white tracking-tighter uppercase italic">{title}</h3>
                </div>
                <div className="relative">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-primary to-blue-600 flex items-center justify-center text-white font-black text-3xl shadow-[0_0_20px_rgba(0,224,198,0.4)] border border-white/20 transform rotate-3">
                        {level}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded border border-slate-700">LVL</div>
                </div>
            </div>

            {/* XP Progress Bar HUD */}
            <div className="mb-8 z-10">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    <span>XP: {xp.toLocaleString()}</span>
                    <span>Next: {nextLevelData.minXP.toLocaleString()}</span>
                </div>
                <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700 relative shadow-inner">
                    {/* Grid lines on bar */}
                    <div className="absolute inset-0 flex justify-between px-1 z-20">
                        {[...Array(10)].map((_, i) => <div key={i} className="w-px h-full bg-slate-900/50"></div>)}
                    </div>
                    <div 
                        className="h-full bg-gradient-to-r from-blue-600 via-brand-primary to-white transition-all duration-1000 ease-out relative"
                        style={{ width: `${percentage}%` }}
                    >
                        <div className="absolute inset-0 bg-white/30 animate-[pulse_1s_infinite]"></div>
                    </div>
                </div>
            </div>

            {/* Active Challenges List */}
            <div className="z-10 flex-grow">
                <h4 className="font-bold text-white text-xs uppercase tracking-wide mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-brand-accent rounded-full animate-pulse"></span>
                    Misiones Activas
                </h4>
                <div className="space-y-3">
                    {challenges.map(challenge => (
                        <div key={challenge.id} className="bg-slate-800/50 p-3 rounded-xl border border-white/5 hover:border-brand-primary/30 transition-colors group cursor-default">
                            <div className="flex justify-between items-start mb-2">
                                <p className="font-bold text-slate-200 text-xs group-hover:text-brand-primary transition-colors">{challenge.title}</p>
                                <span className="bg-brand-accent/10 text-brand-accent text-[9px] font-bold px-1.5 py-0.5 rounded border border-brand-accent/20">+{challenge.rewardXP} XP</span>
                            </div>
                            
                            {/* Mini Progress */}
                            <div className="flex items-center gap-2">
                                <div className="flex-grow h-1 bg-slate-700 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-brand-primary rounded-full shadow-[0_0_5px_rgba(0,224,198,0.8)]" 
                                        style={{ width: `${(challenge.current / challenge.target) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-[9px] font-mono text-slate-400">
                                    {challenge.current}/{challenge.target}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <button className="w-full mt-4 py-2 rounded-lg border border-white/10 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors uppercase tracking-widest">
                Ver Todos Los Logros
            </button>
        </div>
    );
};
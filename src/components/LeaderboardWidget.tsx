
import React from 'react';
import { LeaderboardEntry } from '../types';

interface LeaderboardWidgetProps {
    data: LeaderboardEntry[];
    currentUserId?: string; // To highlight the user
}

export const LeaderboardWidget: React.FC<LeaderboardWidgetProps> = ({ data, currentUserId }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">Top Semanal 🏆</h3>
                <select className="text-xs border-none bg-slate-100 dark:bg-slate-700 rounded-md p-1 text-slate-600 dark:text-slate-300 focus:ring-0">
                    <option>Global</option>
                    <option>Mi Gimnasio</option>
                    <option>Amigos</option>
                </select>
            </div>
            
            <div className="space-y-2">
                {data.map((entry, index) => {
                    const isTop3 = index < 3;
                    const isMe = entry.userName === 'Ana García'; // Mocked check

                    return (
                        <div 
                            key={index} 
                            className={`flex items-center p-3 rounded-xl ${isMe ? 'bg-brand-primary/10 border border-brand-primary/30' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-transparent'} transition-colors`}
                        >
                            <div className={`w-8 h-8 flex items-center justify-center font-bold rounded-full mr-3 ${
                                index === 0 ? 'bg-yellow-100 text-yellow-600' :
                                index === 1 ? 'bg-gray-100 text-slate-600' :
                                index === 2 ? 'bg-orange-100 text-orange-600' :
                                'text-slate-400'
                            }`}>
                                {entry.rank}
                            </div>
                            
                            <div className="flex-grow">
                                <p className={`text-sm font-bold ${isMe ? 'text-brand-primary' : 'text-slate-700 dark:text-slate-200'}`}>
                                    {entry.userName} {isMe && '(Tú)'}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{entry.xp.toLocaleString()} XP</p>
                            </div>

                            <div className="text-xs font-medium">
                                {entry.trend === 'up' && <span className="text-green-500">▲</span>}
                                {entry.trend === 'down' && <span className="text-red-500">▼</span>}
                                {entry.trend === 'same' && <span className="text-slate-400">-</span>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

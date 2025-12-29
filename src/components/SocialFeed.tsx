
import React from 'react';
import { SocialActivity } from '../types';
import { useFeedback } from './FeedbackSystem';

interface SocialFeedProps {
    activities: SocialActivity[];
}

const getActionIcon = (type: SocialActivity['type']) => {
    switch (type) {
        case 'workout': return '💪';
        case 'level_up': return '🚀';
        case 'achievement': return '🏆';
        default: return '📢';
    }
};

export const SocialFeed: React.FC<SocialFeedProps> = ({ activities }) => {
    const { showToast } = useFeedback();

    const handleLike = (_id: string) => {
        // In a real app, this would update backend
        showToast('¡Le diste un pulgar arriba! 👍', 'success');
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">Comunidad FitnessFlow</h3>
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
            </div>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {activities.map(activity => (
                    <div key={activity.id} className="flex gap-3 border-b border-slate-50 dark:border-slate-700 pb-3 last:border-0 last:pb-0">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-lg shadow-sm flex-shrink-0">
                            {getActionIcon(activity.type)}
                        </div>
                        <div className="flex-grow">
                            <p className="text-sm text-slate-800 dark:text-slate-200">
                                <span className="font-bold">{activity.user}</span> {activity.action}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                                <p className="text-xs text-slate-400">{activity.timeAgo}</p>
                                <button
                                    onClick={() => handleLike(activity.id)}
                                    className="text-xs font-semibold text-slate-500 hover:text-brand-primary flex items-center gap-1 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                    </svg>
                                    {activity.likes}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

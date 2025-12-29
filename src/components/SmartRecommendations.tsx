
import React from 'react';
import { DailyCheckin } from '../types';

interface SmartRecommendationsProps {
    status: DailyCheckin;
    onNavigate: (page: string) => void;
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({ status, onNavigate }) => {
    
    const getNutritionTip = () => {
        if (status.energyLevel < 5 || status.sleepQuality === 'poor') {
            return {
                title: 'Boost de Energía Pre-Entreno',
                content: 'Hoy tu energía está baja. Prioriza carbohidratos de rápida absorción (fruta, avena) 30 min antes de entrenar.',
                icon: '🍌'
            };
        }
        if (status.soreness === 'high' || status.soreness === 'medium') {
            return {
                title: 'Nutrición Anti-inflamatoria',
                content: 'Para el dolor muscular, aumenta la ingesta de Omega-3 (pescado, nueces) y cúrcuma hoy.',
                icon: '🐟'
            };
        }
        return {
            title: 'Comida Post-Entreno Ideal',
            content: 'Para maximizar tus resultados hoy, asegura 20-30g de proteína en la hora siguiente a tu sesión.',
            icon: '🥩'
        };
    };

    const getClassRecommendation = () => {
        if (status.mood === 'stressed' || status.soreness === 'high') {
            return {
                name: 'Yoga Restaurativo',
                time: '19:00',
                coach: 'Ana María',
                image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=600'
            };
        }
        if (status.energyLevel > 7) {
             return {
                name: 'CrossFit WOD',
                time: '18:00',
                coach: 'Diego V.',
                image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=600'
            };
        }
        return {
            name: 'Pilates Mat',
            time: '08:00',
            coach: 'Laura M.',
            image: 'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=600'
        };
    };

    const nutrition = getNutritionTip();
    const recommendedClass = getClassRecommendation();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nutrition Card */}
            <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-2xl border border-orange-100 dark:border-orange-800/50 flex items-start gap-4 transition-transform hover:scale-[1.02]">
                <div className="text-4xl bg-white dark:bg-slate-800 w-14 h-14 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                    {nutrition.icon}
                </div>
                <div>
                    <h3 className="font-bold text-orange-900 dark:text-orange-100 mb-2">{nutrition.title}</h3>
                    <p className="text-sm text-orange-800 dark:text-orange-200 leading-relaxed">{nutrition.content}</p>
                </div>
            </div>

            {/* Recommended Class Card */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex gap-4 transition-transform hover:scale-[1.02]">
                <img src={recommendedClass.image} alt={recommendedClass.name} className="w-24 h-24 rounded-xl object-cover" />
                <div className="flex flex-col justify-between flex-grow">
                    <div>
                        <p className="text-xs font-bold text-brand-primary uppercase tracking-wide mb-1">Sugerido para ti</p>
                        <h3 className="font-bold text-slate-800 dark:text-white leading-tight">{recommendedClass.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{recommendedClass.time} • {recommendedClass.coach}</p>
                    </div>
                    <button 
                        onClick={() => onNavigate('Clases Grupales')}
                        className="self-start text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity shadow-md"
                    >
                        Reservar Ahora
                    </button>
                </div>
            </div>
        </div>
    );
};

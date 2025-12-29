
import React, { useState } from 'react';
import { useFeedback } from '../components/FeedbackSystem';

interface Campaign {
    id: string;
    name: string;
    trigger: string;
    status: 'active' | 'paused';
    message: string;
    stats: {
        sent: number;
        opened: string;
        roi: string;
    };
}

const INITIAL_CAMPAIGNS: Campaign[] = [
    {
        id: '1',
        name: 'Recuperación de Riesgo',
        trigger: 'Ausencia > 7 días',
        status: 'active',
        message: "Hola {nombre}, ¡te extrañamos en el gimnasio! 💪 Tu salud es lo primero. Vuelve esta semana y recibe un batido de cortesía.",
        stats: { sent: 142, opened: '68%', roi: 'High' }
    },
    {
        id: '2',
        name: 'Felicitación de Cumpleaños',
        trigger: 'Fecha de Nacimiento = Hoy',
        status: 'active',
        message: "¡Feliz Cumpleaños {nombre}! 🎉 Hoy tu entrenamiento corre por nuestra cuenta. ¡Pásala increíble!",
        stats: { sent: 45, opened: '92%', roi: 'N/A' }
    },
    {
        id: '3',
        name: 'Renovación de Plan',
        trigger: 'Vencimiento en 3 días',
        status: 'paused',
        message: "{nombre}, tu plan está por vencer. Renueva hoy online para asegurar tu tarifa actual.",
        stats: { sent: 89, opened: '45%', roi: 'Med' }
    },
    {
        id: '4',
        name: 'Bienvenida Nuevo Miembro',
        trigger: 'Nuevo Registro',
        status: 'active',
        message: "Bienvenido a la familia, {nombre}. Recuerda agendar tu valoración física inicial desde la app.",
        stats: { sent: 210, opened: '88%', roi: 'N/A' }
    }
];

export const MarketingAutomations: React.FC = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
    const { showToast } = useFeedback();

    const toggleStatus = (id: string) => {
        setCampaigns(prev => prev.map(c => {
            if (c.id === id) {
                const newStatus = c.status === 'active' ? 'paused' : 'active';
                showToast(`Campaña "${c.name}" ${newStatus === 'active' ? 'activada' : 'pausada'}`, newStatus === 'active' ? 'success' : 'info');
                return { ...c, status: newStatus };
            }
            return c;
        }));
    };

    const handleEditMessage = (id: string, newMessage: string) => {
        setCampaigns(prev => prev.map(c => c.id === id ? { ...c, message: newMessage } : c));
    };

    const handleTest = (campaignName: string) => {
        showToast(`Mensaje de prueba para "${campaignName}" enviado a tu móvil.`, 'success');
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 animate-fade-in">
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Automatización y Retención</h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">El piloto automático para el crecimiento de tu gimnasio.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {campaigns.map(campaign => (
                    <div key={campaign.id} className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border transition-all duration-300 ${campaign.status === 'active' ? 'border-green-200 dark:border-green-900/30 shadow-green-100/50' : 'border-slate-200 dark:border-slate-700 opacity-90'}`}>
                        <div className="p-6 flex flex-col lg:flex-row gap-6">
                            
                            {/* Info & Toggle */}
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${campaign.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">{campaign.name}</h3>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={campaign.status === 'active'} onChange={() => toggleStatus(campaign.id)} />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                                    </label>
                                </div>
                                <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg text-xs font-mono text-slate-600 dark:text-slate-300 mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    Disparador: {campaign.trigger}
                                </div>
                                
                                {/* Stats Row */}
                                <div className="flex gap-6 mt-2 text-sm">
                                    <div>
                                        <p className="text-slate-400 text-xs uppercase font-bold">Enviados</p>
                                        <p className="font-bold text-slate-800 dark:text-white">{campaign.stats.sent}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-xs uppercase font-bold">Apertura</p>
                                        <p className="font-bold text-green-600">{campaign.stats.opened}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-xs uppercase font-bold">Impacto</p>
                                        <p className="font-bold text-brand-primary">{campaign.stats.roi}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Message Editor */}
                            <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Plantilla del Mensaje (SMS/WhatsApp/Push)</label>
                                <textarea 
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md p-3 text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-brand-primary outline-none resize-none"
                                    rows={3}
                                    value={campaign.message}
                                    onChange={(e) => handleEditMessage(campaign.id, e.target.value)}
                                />
                                <div className="flex justify-end mt-2">
                                    <button 
                                        onClick={() => handleTest(campaign.name)}
                                        className="text-xs font-bold text-brand-primary hover:text-brand-secondary flex items-center gap-1"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                        Enviar Prueba
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

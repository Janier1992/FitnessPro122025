import React, { useState } from 'react';
import { GroupClass, User } from '../types';
import { AvailabilityModal } from '../components/AvailabilityModal';
import { ChecklistWidget } from '../components/ChecklistWidget';

// TODO: Fetch clients from Supabase
const mockClients = [
    { id: 1, name: 'Carlos Gomez', notes: ['Objetivo: Hipertrofia', 'Lesión rodilla izquierda'], progress: 75 },
    { id: 2, name: 'Ana Lopez', notes: ['Objetivo: Pérdida peso', 'Prefiere mañanas'], progress: 40 },
    { id: 3, name: 'Juan Perez', notes: ['Objetivo: Flexibilidad', 'Principiante'], progress: 20 },
    { id: 4, name: 'Maria Rodriguez', notes: ['Objetivo: Tonificación', 'Post-parto'], progress: 60 },
];

const KpiCard: React.FC<{ icon: string; value: string | number; label: string; color?: string }> = ({ icon, value, label, color = 'bg-slate-50 dark:bg-slate-700' }) => (
    <div className={`p-5 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-4 transition-all hover:shadow-md ${color}`}>
        <div className="text-3xl bg-white dark:bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center shadow-sm">
            {icon}
        </div>
        <div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{value}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wide">{label}</p>
        </div>
    </div>
);

interface CoachDashboardProps {
    user: User;
    onNavigate: (page: string) => void;
    onUpdateUser: (originalEmail: string, updatedUser: User) => void;
    allClasses: GroupClass[];
}

export const CoachDashboard: React.FC<CoachDashboardProps> = ({ user, onNavigate, onUpdateUser, allClasses }) => {
    const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
    const upcomingClasses = allClasses.filter(c => c.coach === user.name).slice(0, 3);
    const nextClass = upcomingClasses.length > 0 ? upcomingClasses[0] : null;

    const handleSaveAvailability = (newAvailability: { day: string; hours: string[] }[]) => {
        const updatedUser = { ...user, availability: newAvailability };
        onUpdateUser(user.email, updatedUser);
        setIsAvailabilityModalOpen(false);
    };

    const checklistItems = [
        { id: '1', label: 'Define tus especialidades', isCompleted: true },
        { id: '2', label: 'Establece tu horario de disponibilidad', isCompleted: user.availability && user.availability.length > 0 ? true : false, actionLabel: 'Editar' },
        { id: '3', label: 'Crea tu primer servicio', isCompleted: false, actionLabel: 'Servicios' },
        { id: '4', label: 'Acepta tu primera solicitud', isCompleted: false }
    ];

    return (
        <div className="container mx-auto px-4 py-8 md:py-10 space-y-8 animate-fade-in">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end pb-6 border-b border-slate-200 dark:border-slate-700">
                <div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Panel de Entrenador</p>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Hola, {user.name.split(' ')[0]}</h1>
                </div>
                <div className="flex gap-3 mt-4 md:mt-0">
                    <button onClick={() => setIsAvailabilityModalOpen(true)} className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold py-2 px-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                        Disponibilidad
                    </button>
                    <button onClick={() => onNavigate('Mi Horario')} className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary transition-colors text-sm shadow-lg shadow-brand-primary/20">
                        Ver Agenda
                    </button>
                </div>
            </div>

            {/* Hero: Next Session Focus */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {nextClass ? (
                    <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden group cursor-pointer" onClick={() => onNavigate('Mi Horario')}>
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-40 w-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div className="relative z-10">
                            <span className="bg-brand-primary text-slate-900 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide mb-3 inline-block">Próxima Sesión</span>
                            <h2 className="text-3xl md:text-4xl font-extrabold mb-2">{nextClass.name}</h2>
                            <p className="text-slate-300 text-lg mb-6">con <span className="text-white font-bold">{nextClass.bookedBy || 'Grupo'}</span> • {nextClass.schedule[0].time}</p>

                            <div className="flex gap-4">
                                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                                    <p className="text-xs text-slate-400 uppercase">Ubicación</p>
                                    <p className="font-bold">{nextClass.locationType}</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                                    <p className="text-xs text-slate-400 uppercase">Duración</p>
                                    <p className="font-bold">{nextClass.duration} min</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="lg:col-span-2 bg-slate-100 dark:bg-slate-800 rounded-2xl p-8 flex flex-col justify-center items-center text-center border-2 border-dashed border-slate-300 dark:border-slate-700">
                        <div className="text-4xl mb-4">☕</div>
                        <h3 className="text-xl font-bold text-slate-700 dark:text-white">Tiempo Libre</h3>
                        <p className="text-slate-500 dark:text-slate-400">No tienes sesiones próximas. ¡Buen momento para planificar!</p>
                        <button onClick={() => onNavigate('Mi Horario')} className="mt-4 text-brand-primary font-bold hover:underline">Gestionar Horario</button>
                    </div>
                )}

                {/* Quick Stats */}
                <div className="space-y-4">
                    <KpiCard icon="👥" value={mockClients.length} label="Clientes Activos" color="bg-white dark:bg-slate-800" />
                    <KpiCard icon="🗓️" value={upcomingClasses.length} label="Sesiones Hoy" color="bg-white dark:bg-slate-800" />
                </div>
            </div>

            {/* Main Content Grid (2/3 + 1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Schedule & Tasks */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Agenda del Día</h2>
                        <div className="space-y-4">
                            {upcomingClasses.length > 0 ? upcomingClasses.map(c => (
                                <div key={c.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <div className="flex-shrink-0 w-16 text-center">
                                        <p className="text-lg font-bold text-slate-800 dark:text-white">{c.schedule[0].time}</p>
                                        <p className="text-xs text-slate-500 uppercase">{c.duration} min</p>
                                    </div>
                                    <div className="w-px h-10 bg-slate-200 dark:bg-slate-600"></div>
                                    <div className="flex-grow">
                                        <p className="font-bold text-slate-800 dark:text-white">{c.name}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{c.bookedBy ? `Cliente: ${c.bookedBy}` : 'Clase Grupal'}</p>
                                    </div>
                                    <div className={`text-xs font-bold px-3 py-1 rounded-full ${c.locationType === 'A Domicilio' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                        {c.locationType}
                                    </div>
                                </div>
                            )) : (
                                <p className="text-slate-500 text-center italic py-4">No hay más eventos hoy.</p>
                            )}
                        </div>
                    </div>

                    <ChecklistWidget title="Tu Carrera Pro" items={checklistItems} />
                </div>

                {/* Right Column: Clients */}
                <div className="space-y-8">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Actividad Reciente</h2>
                            <button onClick={() => onNavigate('Mis Clientes')} className="text-xs font-bold text-brand-primary hover:underline">Ver Todos</button>
                        </div>
                        <ul className="space-y-4">
                            {mockClients.slice(0, 4).map(client => (
                                <li key={client.id} className="flex gap-3 items-start pb-3 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                        {client.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{client.name}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{client.notes[0] || 'Sin notas recientes'}</p>
                                        <div className="mt-1 w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 w-24">
                                            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${client.progress}%` }}></div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {isAvailabilityModalOpen && (
                <AvailabilityModal
                    user={user}
                    onClose={() => setIsAvailabilityModalOpen(false)}
                    onSave={handleSaveAvailability}
                />
            )}
        </div>
    );
};

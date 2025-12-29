


import React, { useState, useMemo } from 'react';
import { CLASS_CATEGORIES } from '../constants';
import { ClassCard } from '../components/ClassCard';
import { type GroupClass } from '../types';

const KpiCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color: string }> = ({ icon, label, value, color }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-slate-500 text-sm">{label}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const InfoTooltip: React.FC<{ text: string }> = ({ text }) => {
    return (
        <div className="relative flex items-center group ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-slate-800 text-white text-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 shadow-lg">
                {text}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-800"></div>
            </div>
        </div>
    );
};

const CoachAvailability: React.FC<{ allClasses: GroupClass[] }> = ({ allClasses }) => {
    const availability = useMemo(() => {
        const coachSchedules: { [key: string]: { day: string, time: string }[] } = {};
        allClasses.forEach(cls => {
            if (!coachSchedules[cls.coach]) {
                coachSchedules[cls.coach] = [];
            }
            coachSchedules[cls.coach].push(...cls.schedule);
        });
        return coachSchedules;
    }, [allClasses]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Disponibilidad de Entrenadores</h2>
            <div className="space-y-4">
                {Object.entries(availability).map(([coach, schedule]) => (
                    <div key={coach}>
                        <h3 className="font-semibold text-slate-700">{coach}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {/* FIX: The 'schedule' variable from Object.entries is of type 'unknown'. Cast it to the correct type to allow mapping. */}
                            {(schedule as { day: string; time: string }[]).map((s, i) => (
                                <span key={i} className="px-2 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded-full">
                                    Ocupado: {s.day} {s.time}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

interface GroupClassesProps {
    allClasses: GroupClass[];
}

export const GroupClasses: React.FC<GroupClassesProps> = ({ allClasses }) => {
    const [activeTab, setActiveTab] = useState('Todas');

    const groupClasses = useMemo(() => allClasses.filter(c => c.capacity > 1), [allClasses]);

    const filteredClasses = useMemo(() => {
        if (activeTab === 'Todas' || activeTab === 'Mis Reservas') {
            return groupClasses;
        }
        return groupClasses.filter(c => c.category === activeTab);
    }, [activeTab, groupClasses]);

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 animate-fade-in">
            {/* Header */}
            <div className="mb-8 md:mb-12">
                <div className="flex items-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Clases Grupales</h1>
                    <InfoTooltip text="Explora y reserva tu lugar en nuestras clases grupales. Filtra por tipo de clase y revisa los horarios para planificar tu semana." />
                </div>
                <p className="mt-2 text-lg text-slate-600 max-w-2xl">Únete a nuestras clases grupales y entrena con la comunidad FitnessFlow</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 md:mb-12">
                <KpiCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} label="Clases Disponibles" value={groupClasses.length} color="bg-blue-100" />
                <KpiCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} label="Mis Reservas" value={1} color="bg-green-100" />
                <KpiCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} label="Esta Semana" value={15} color="bg-orange-100" />
                <KpiCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>} label="Coaches" value={3} color="bg-purple-100" />
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 mb-8">
                <nav className="-mb-px flex space-x-6 overflow-x-auto">
                    {CLASS_CATEGORIES.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === tab
                                    ? 'border-brand-primary text-brand-primary'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Classes Grid */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {filteredClasses.map(classData => (
                        <ClassCard key={classData.id} classData={classData} />
                    ))}
                </div>
                {/* Coach Availability Sidebar */}
                <div className="lg:col-span-1">
                    <CoachAvailability allClasses={allClasses} />
                </div>
            </div>
        </div>
    );
};
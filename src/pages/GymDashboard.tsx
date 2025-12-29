
import React from 'react';
import { mockMembers, financialSummary } from '../data/gym';
import { SimpleBarChart } from '../components/charts/SimpleBarChart';
import { ChecklistWidget } from '../components/ChecklistWidget';
import { LEADERBOARD_DATA } from '../data/gamification';
import { useFeedback } from '../components/FeedbackSystem';

const KpiCard: React.FC<{ icon: string; value: string | number; label: string; sublabel: string; trend?: 'up' | 'down' | 'neutral' }> = ({ icon, value, label, sublabel, trend }) => (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-start justify-between transition-all hover:shadow-md hover:-translate-y-1">
        <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-1">{value}</h3>
            <p className="text-slate-400 dark:text-slate-500 text-xs flex items-center gap-1">
                {trend === 'up' && <span className="text-green-500 font-bold">↑</span>}
                {trend === 'down' && <span className="text-red-500 font-bold">↓</span>}
                {sublabel}
            </p>
        </div>
        <div className="text-2xl bg-slate-50 dark:bg-slate-700 w-10 h-10 rounded-xl flex items-center justify-center shadow-inner">
            {icon}
        </div>
    </div>
);

const statusColors: { [key: string]: string } = {
    'Al día': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'Vencido': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

interface GymDashboardProps {
    onNavigate: (page: string) => void;
}

export const GymDashboard: React.FC<GymDashboardProps> = ({ onNavigate }) => {
    const totalMembers = mockMembers.length;
    const activeMembers = mockMembers.filter(m => m.status === 'Al día').length;
    const membersAtRisk = mockMembers.filter(m => m.status === 'Vencido');
    const { showToast } = useFeedback();

    const handleCreateReport = () => {
        showToast('Reporte generado y enviado a tu correo.', 'success');
    };

    const handleChargeMember = (memberName: string) => {
        showToast(`Recordatorio de pago enviado a ${memberName}`, 'success');
    };

    const checklistItems = [
        { id: '1', label: 'Configura el horario de tu gimnasio', isCompleted: true },
        { id: '2', label: 'Registra tu primer miembro', isCompleted: true, actionLabel: 'Ir a Miembros' },
        { id: '3', label: 'Añade equipo al inventario', isCompleted: false, actionLabel: 'Gestionar Inventario' },
        { id: '4', label: 'Crea un Reto Semanal', isCompleted: false, actionLabel: 'Gamificación' }
    ];

    return (
        <div className="container mx-auto px-4 py-8 md:py-10 space-y-8 animate-fade-in">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 dark:border-slate-700 pb-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Panel de Control</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">Resumen operativo de <span className="font-bold text-brand-primary">Gimnasio El Templo</span></p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => onNavigate('Miembros')} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm">
                        + Miembro
                    </button>
                    <button onClick={handleCreateReport} className="bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-secondary transition-colors text-sm shadow-lg shadow-brand-primary/20">
                        Crear Reporte
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 <KpiCard icon="👥" value={totalMembers} label="Miembros Totales" sublabel="+5% vs mes anterior" trend="up" />
                 <KpiCard icon="✅" value={activeMembers} label="Miembros Activos" sublabel="85% Retención" trend="neutral" />
                 <KpiCard icon="💰" value={`$${(financialSummary.monthlyIncome/1000000).toFixed(1)}M`} label="Ingresos Mes" sublabel="Meta: $2.5M" trend="up" />
                 <KpiCard icon="⚡" value="3" label="Retos Activos" sublabel="Gamificación" />
            </div>
            
            {/* Checklist for Onboarding/Tasks */}
            <ChecklistWidget title="Tareas Administrativas" items={checklistItems} />

            {/* Main Content Grid (2/3 + 1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column (Main Data) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Financial Chart */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Rendimiento Financiero</h2>
                            <select className="bg-slate-50 dark:bg-slate-700 border-none text-xs rounded-md p-2 text-slate-600 dark:text-slate-300 focus:ring-0 cursor-pointer">
                                <option>Últimos 6 meses</option>
                                <option>Este Año</option>
                            </select>
                        </div>
                        <div className="h-64">
                            <SimpleBarChart data={financialSummary.chartData} />
                        </div>
                    </div>

                     {/* Recent Members Table */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
                         <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Miembros Recientes</h2>
                            <button onClick={() => onNavigate('Miembros')} className="text-sm font-bold text-brand-primary hover:underline">Ver Todos</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                    <tr>
                                        <th className="p-3 font-semibold rounded-l-lg">Miembro</th>
                                        <th className="p-3 font-semibold">Plan</th>
                                        <th className="p-3 font-semibold text-center">Estado</th>
                                        <th className="p-3 font-semibold rounded-r-lg">Ingreso</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {mockMembers.slice(0, 5).map(member => (
                                        <tr key={member.id} className="border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                            <td className="p-3 font-bold text-slate-700 dark:text-slate-200">{member.name}</td>
                                            <td className="p-3 text-slate-500 dark:text-slate-400 capitalize">{member.plan}</td>
                                            <td className="p-3 text-center">
                                                <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${statusColors[member.status]}`}>
                                                    {member.status}
                                                </span>
                                            </td>
                                            <td className="p-3 text-slate-400">{member.joinDate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column (Secondary Info) */}
                <div className="space-y-8">
                    {/* Gamification Leaderboard */}
                     <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                             <h2 className="text-lg font-bold text-slate-800 dark:text-white">Top Miembros</h2>
                             <span className="text-xs bg-brand-accent text-brand-dark px-2 py-1 rounded font-bold">XP</span>
                        </div>
                        <div className="space-y-3">
                            {LEADERBOARD_DATA.slice(0, 5).map((entry, index) => (
                                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                         <span className={`font-bold w-6 text-center ${index < 3 ? 'text-brand-primary' : 'text-slate-400'}`}>#{entry.rank}</span>
                                         <div>
                                             <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">{entry.userName}</p>
                                             <p className="text-[10px] text-slate-400">{entry.trend === 'up' ? '🔥 En racha' : 'Mantiene ritmo'}</p>
                                         </div>
                                    </div>
                                    <div className="text-xs font-bold text-slate-600 dark:text-slate-400">{entry.xp.toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Risk Alerts */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
                         <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Alertas de Riesgo</h2>
                            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">{membersAtRisk.length}</span>
                        </div>
                        {membersAtRisk.length > 0 ? (
                            <div className="space-y-3">
                                {membersAtRisk.map(member => (
                                    <div key={member.id} className="flex justify-between items-center bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/30">
                                        <div>
                                            <p className="font-bold text-red-800 dark:text-red-300 text-sm">{member.name}</p>
                                            <p className="text-[10px] text-red-600 dark:text-red-400">Venció: {member.lastPayment}</p>
                                        </div>
                                        <button 
                                            onClick={() => handleChargeMember(member.name)}
                                            className="text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                                        >
                                            Cobrar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-4">
                                <p className="text-green-600 font-medium text-sm">¡Todo en orden!</p>
                             </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

import React, { useState, useMemo } from 'react';
import { mockTransactions, Transaction } from '../data/gym';
import { SimpleBarChart } from '../components/charts/SimpleBarChart';
import { AddTransactionModal } from '../components/AddTransactionModal';

const KpiCard: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <p className="text-slate-500 text-sm">{label}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
);

const transactionTypeColors = {
    'Ingreso': 'bg-green-100 text-green-800',
    'Gasto': 'bg-red-100 text-red-800',
};

export const FinanceManagement: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
    const [filterType, setFilterType] = useState<'Todos' | 'Ingreso' | 'Gasto'>('Todos');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const financialSummary = useMemo(() => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentTransactions = transactions.filter(tx => new Date(tx.date) >= thirtyDaysAgo);

        const monthlyIncome = recentTransactions
            .filter(tx => tx.type === 'Ingreso')
            .reduce((sum, tx) => sum + tx.amount, 0);

        const monthlyExpenses = recentTransactions
            .filter(tx => tx.type === 'Gasto')
            .reduce((sum, tx) => sum + tx.amount, 0);
            
        const chartData = [
            { name: 'Feb', income: 1500000, expenses: 700000 },
            { name: 'Mar', income: 1600000, expenses: 750000 },
            { name: 'Abr', income: 1750000, expenses: 800000 },
            { name: 'May', income: 1700000, expenses: 780000 },
            { name: 'Jun', income: 1900000, expenses: 850000 },
            { name: 'Jul', income: 1850000, expenses: 650000 },
        ].map(d => ({...d, income: d.income / 1000, expenses: d.expenses / 1000}));


        return {
            monthlyIncome,
            monthlyExpenses,
            netProfit: monthlyIncome - monthlyExpenses,
            chartData
        };
    }, [transactions]);
    
    const filteredTransactions = useMemo(() => {
        if (filterType === 'Todos') return transactions;
        return transactions.filter(tx => tx.type === filterType);
    }, [transactions, filterType]);

    const handleAddTransaction = (newTransactionData: Omit<Transaction, 'id'>) => {
        const newId = transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1;
        const newTransaction: Transaction = {
            id: newId,
            ...newTransactionData
        };
        // Add to the top of the list and re-sort
        setTransactions(prev => [...prev, newTransaction].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setIsAddModalOpen(false);
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Gestión Financiera</h1>
                    <p className="mt-2 text-lg text-slate-600">Un resumen de la salud financiera de tu gimnasio.</p>
                </div>
                 <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-secondary transition-colors flex items-center gap-2 self-start md:self-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    Registrar Transacción
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard 
                    label="Ingresos (Últimos 30 días)" 
                    value={`$${financialSummary.monthlyIncome.toLocaleString('es-CO')}`}
                    color="text-green-600"
                />
                 <KpiCard 
                    label="Gastos (Últimos 30 días)" 
                    value={`$${financialSummary.monthlyExpenses.toLocaleString('es-CO')}`}
                    color="text-red-600"
                />
                 <KpiCard 
                    label="Utilidad Neta (Últimos 30 días)" 
                    value={`$${financialSummary.netProfit.toLocaleString('es-CO')}`}
                    color="text-slate-800"
                />
            </div>
            
             {/* Transaction History */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
                    <h2 className="text-xl font-bold text-slate-800">Historial de Transacciones</h2>
                    <div className="self-start md:self-center">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as any)}
                            className="p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-brand-primary"
                        >
                            <option value="Todos">Todas las transacciones</option>
                            <option value="Ingreso">Solo Ingresos</option>
                            <option value="Gasto">Solo Gastos</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-sm text-slate-600">
                             <tr>
                                <th className="p-4 font-semibold">Fecha</th>
                                <th className="p-4 font-semibold">Descripción</th>
                                <th className="p-4 font-semibold">Categoría</th>
                                <th className="p-4 font-semibold text-center">Tipo</th>
                                <th className="p-4 font-semibold text-right">Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map(tx => (
                                <tr key={tx.id} className="border-t border-slate-200">
                                    <td className="p-4 text-slate-500">{tx.date}</td>
                                    <td className="p-4 font-medium text-slate-800">{tx.description}</td>
                                    <td className="p-4 text-slate-600">{tx.category}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${transactionTypeColors[tx.type]}`}>{tx.type}</span>
                                    </td>
                                    <td className={`p-4 text-right font-bold ${tx.type === 'Ingreso' ? 'text-green-600' : 'text-red-600'}`}>
                                        {tx.type === 'Ingreso' ? '+' : '-'} ${tx.amount.toLocaleString('es-CO')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                 <h2 className="text-xl font-bold text-slate-800 mb-4">Proyección de Ingresos vs Gastos</h2>
                 <p className="text-slate-500 text-sm mb-4">Visualización de los últimos 6 meses (en miles de COP).</p>
                 <div className="h-80">
                    <SimpleBarChart data={financialSummary.chartData} />
                 </div>
            </div>
            
            {isAddModalOpen && (
                <AddTransactionModal
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleAddTransaction}
                />
            )}
        </div>
    );
};

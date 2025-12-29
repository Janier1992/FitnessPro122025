import React, { useState, useMemo } from 'react';
import { AddInventoryModal } from '../components/AddInventoryModal';
import { EditInventoryModal } from '../components/EditInventoryModal';
import { DeleteInventoryModal } from '../components/DeleteInventoryModal';


interface InventoryItem {
    id: number;
    name: string;
    quantity: number;
    status: 'Disponible' | 'En Mantenimiento' | 'Fuera de Servicio';
}

const initialInventory: InventoryItem[] = [
    { id: 1, name: 'Mancuernas de 10kg', quantity: 8, status: 'Disponible' },
    { id: 2, name: 'Barra Olímpica', quantity: 4, status: 'Disponible' },
    { id: 3, name: 'Caminadora ProForm 500', quantity: 2, status: 'En Mantenimiento' },
    { id: 4, name: 'Banco de Press', quantity: 3, status: 'Disponible' },
    { id: 5, name: 'Pesa Rusa 16kg', quantity: 5, status: 'Disponible' },
];

const statusColors = {
    'Disponible': 'bg-green-100 text-green-800',
    'En Mantenimiento': 'bg-yellow-100 text-yellow-800',
    'Fuera de Servicio': 'bg-red-100 text-red-800',
};

const KpiCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; }> = ({ icon, label, value }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
        <div className="text-3xl">{typeof icon === 'string' ? icon : icon}</div>
        <div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-slate-500 text-sm">{label}</p>
        </div>
    </div>
);

export const InventoryManagement: React.FC = () => {
    const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null);
    const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);

    const filteredInventory = inventory.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const kpis = useMemo(() => {
        const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
        const inMaintenance = inventory.filter(i => i.status === 'En Mantenimiento').length;
        const outOfService = inventory.filter(i => i.status === 'Fuera de Servicio').length;
        const distinctItems = new Set(inventory.map(i => i.name)).size;
        return { totalItems, inMaintenance, outOfService, distinctItems };
    }, [inventory]);

    const handleAddItem = (newItemData: Omit<InventoryItem, 'id'>) => {
        const newId = inventory.length > 0 ? Math.max(...inventory.map(i => i.id)) + 1 : 1;
        const newItem: InventoryItem = {
            id: newId,
            ...newItemData
        };
        setInventory(prev => [newItem, ...prev]);
        setIsAddModalOpen(false);
    };

    const handleUpdateItem = (updatedItem: InventoryItem) => {
        setInventory(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
        setItemToEdit(null);
    };

    const handleDeleteItem = () => {
        if (itemToDelete) {
            setInventory(prev => prev.filter(item => item.id !== itemToDelete.id));
            setItemToDelete(null);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex justify-between items-center mb-8">
                 <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Gestión de Inventario</h1>
                    <p className="mt-2 text-lg text-slate-600">Administra el equipamiento de tu gimnasio en tiempo real.</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-secondary transition-colors flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Añadir Equipo
                </button>
            </div>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KpiCard icon="📦" label="Total de Equipos" value={kpis.totalItems} />
                <KpiCard icon="🔧" label="En Mantenimiento" value={kpis.inMaintenance} />
                <KpiCard icon="⚠️" label="Fuera de Servicio" value={kpis.outOfService} />
                <KpiCard icon="📋" label="Tipos de Equipos" value={kpis.distinctItems} />
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200 mb-8">
                <input
                    type="text"
                    placeholder="Buscar equipo por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none"
                />
            </div>

            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-sm text-slate-600">
                            <tr>
                                <th className="p-4 font-semibold">ID</th>
                                <th className="p-4 font-semibold">Nombre del Equipo</th>
                                <th className="p-4 font-semibold text-center">Cantidad</th>
                                <th className="p-4 font-semibold text-center">Estado</th>
                                <th className="p-4 font-semibold text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInventory.map(item => (
                                <tr key={item.id} className="border-t border-slate-200">
                                    <td className="p-4 text-slate-500">{item.id}</td>
                                    <td className="p-4 font-medium text-slate-800">{item.name}</td>
                                    <td className="p-4 text-slate-700 text-center">{item.quantity}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[item.status]}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center space-x-2">
                                        <button onClick={() => setItemToEdit(item)} className="text-slate-500 hover:text-brand-primary p-1 inline-block" title="Editar">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                        </button>
                                        <button onClick={() => setItemToDelete(item)} className="text-slate-500 hover:text-red-500 p-1 inline-block" title="Eliminar">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {isAddModalOpen && (
                <AddInventoryModal 
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleAddItem}
                />
            )}

            {itemToEdit && (
                <EditInventoryModal 
                    item={itemToEdit}
                    onClose={() => setItemToEdit(null)}
                    onUpdate={handleUpdateItem}
                />
            )}

            {itemToDelete && (
                <DeleteInventoryModal 
                    item={itemToDelete}
                    onClose={() => setItemToDelete(null)}
                    onConfirm={handleDeleteItem}
                />
            )}
        </div>
    );
};
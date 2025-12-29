import React, { useState } from 'react';

interface NewInventoryData {
  name: string;
  quantity: number;
  status: 'Disponible' | 'En Mantenimiento' | 'Fuera de Servicio';
}

interface AddInventoryModalProps {
  onClose: () => void;
  onAdd: (itemData: NewInventoryData) => void;
}

export const AddInventoryModal: React.FC<AddInventoryModalProps> = ({ onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [status, setStatus] = useState<'Disponible' | 'En Mantenimiento' | 'Fuera de Servicio'>('Disponible');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || quantity < 0) {
            setError('Por favor, completa todos los campos correctamente.');
            return;
        }
        setError('');
        onAdd({ name, quantity, status });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-xl font-bold text-slate-800">Añadir Nuevo Equipo</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Nombre del Equipo *</label>
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none" />
                        </div>
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 mb-1">Cantidad *</label>
                            <input type="number" id="quantity" min="0" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 0)} required className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none" />
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">Estado *</label>
                            <select id="status" value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-brand-primary">
                                <option value="Disponible">Disponible</option>
                                <option value="En Mantenimiento">En Mantenimiento</option>
                                <option value="Fuera de Servicio">Fuera de Servicio</option>
                            </select>
                        </div>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancelar</button>
                        <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-secondary">Guardar Equipo</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
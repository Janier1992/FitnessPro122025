import React, { useState, useEffect } from 'react';

interface InventoryItem {
    id: number;
    name: string;
    quantity: number;
    status: 'Disponible' | 'En Mantenimiento' | 'Fuera de Servicio';
}

interface EditInventoryModalProps {
  item: InventoryItem;
  onClose: () => void;
  onUpdate: (updatedItem: InventoryItem) => void;
}

export const EditInventoryModal: React.FC<EditInventoryModalProps> = ({ item, onClose, onUpdate }) => {
    const [formData, setFormData] = useState<InventoryItem>(item);

    useEffect(() => {
        setFormData(item);
    }, [item]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'quantity' ? parseInt(value) : value } as InventoryItem));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || formData.quantity < 0) return;
        onUpdate(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-xl font-bold text-slate-800">Editar Equipo</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="edit-name" className="block text-sm font-medium text-slate-700 mb-1">Nombre del Equipo *</label>
                            <input type="text" id="edit-name" name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none" />
                        </div>
                        <div>
                            <label htmlFor="edit-quantity" className="block text-sm font-medium text-slate-700 mb-1">Cantidad *</label>
                            <input type="number" id="edit-quantity" name="quantity" min="0" value={formData.quantity} onChange={handleChange} required className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none" />
                        </div>
                        <div>
                            <label htmlFor="edit-status" className="block text-sm font-medium text-slate-700 mb-1">Estado *</label>
                            <select id="edit-status" name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-brand-primary">
                                <option value="Disponible">Disponible</option>
                                <option value="En Mantenimiento">En Mantenimiento</option>
                                <option value="Fuera de Servicio">Fuera de Servicio</option>
                            </select>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancelar</button>
                        <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-secondary">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

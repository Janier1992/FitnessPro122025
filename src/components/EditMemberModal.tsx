import React, { useState, useEffect } from 'react';
import type { GymMember } from '../data/gym';

interface EditMemberModalProps {
  member: GymMember;
  onClose: () => void;
  onUpdateMember: (updatedMember: GymMember) => void;
}

export const EditMemberModal: React.FC<EditMemberModalProps> = ({ member, onClose, onUpdateMember }) => {
    const [formData, setFormData] = useState<GymMember>(member);

    useEffect(() => {
        setFormData(member);
    }, [member]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'paymentHistory') {
            const historyArray = value.split(',').map(date => date.trim()).filter(date => date);
            setFormData(prev => ({ ...prev, [name]: historyArray }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value } as GymMember));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.email.trim()) return;
        onUpdateMember(formData);
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-member-modal-title"
        >
            <div 
                className="bg-white rounded-2xl shadow-xl w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                        <h2 id="edit-member-modal-title" className="text-xl font-bold text-slate-800">Editar Miembro</h2>
                        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-800" aria-label="Cerrar modal">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo *</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none" />
                        </div>
                         <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico *</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none" />
                        </div>
                         <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Contraseña *</label>
                            <input type="text" id="password" name="password" value={formData.password} onChange={handleChange} required className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none" />
                        </div>
                        <div>
                            <label htmlFor="plan" className="block text-sm font-medium text-slate-700 mb-1">Plan *</label>
                            <select id="plan" name="plan" value={formData.plan} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-brand-primary" >
                                <option value="básico">Básico</option>
                                <option value="premium">Premium</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">Estado del Pago *</label>
                            <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-brand-primary" >
                                <option value="Al día">Al día</option>
                                <option value="Vencido">Vencido</option>
                            </select>
                        </div>
                        <div>
                           <label htmlFor="paymentHistory" className="block text-sm font-medium text-slate-700 mb-1">Historial de Pagos (fechas separadas por comas)</label>
                           <textarea
                                id="paymentHistory"
                                name="paymentHistory"
                                rows={3}
                                value={Array.isArray(formData.paymentHistory) ? formData.paymentHistory.join(', ') : ''}
                                onChange={handleChange}
                                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none"
                                placeholder="Ej: 2024-07-01, 2024-06-01, 2024-05-01"
                           />
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
                            Cancelar
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-secondary">
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
import React, { useState, useRef } from 'react';
import { CoachService } from '../types';

interface AddServiceModalProps {
  onClose: () => void;
  onAdd: (serviceData: Omit<CoachService, 'id' | 'coach' | 'availability'>) => void;
}

export const AddServiceModal: React.FC<AddServiceModalProps> = ({ onClose, onAdd }) => {
    const [serviceName, setServiceName] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('60');
    const [price, setPrice] = useState('50000');
    const [imageUrl, setImageUrl] = useState('');
    const [locationType, setLocationType] = useState<'Gimnasio' | 'A Domicilio' | 'Virtual'>('Gimnasio');
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                setError('La imagen es muy grande. El límite es 2MB.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result as string);
                setError('');
            };
            reader.onerror = () => {
                setError('No se pudo leer la imagen. Inténtalo de nuevo.');
            };
            reader.readAsDataURL(file);
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!serviceName.trim() || !description.trim() || !duration || !price || !imageUrl) {
            setError('Por favor, completa todos los campos, incluyendo la imagen.');
            return;
        }
        setError('');
        onAdd({
            serviceName,
            description,
            duration: parseInt(duration),
            price: parseInt(price),
            imageUrl,
            locationType
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-xl font-bold text-slate-800">Añadir Nuevo Servicio</h2>
                    </div>
                    <div className="p-6 space-y-4 overflow-y-auto">
                        <div>
                            <label htmlFor="serviceName" className="block text-sm font-medium text-slate-700 mb-1">Nombre del Servicio *</label>
                            <input type="text" id="serviceName" value={serviceName} onChange={(e) => setServiceName(e.target.value)} required className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Descripción *</label>
                            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="duration" className="block text-sm font-medium text-slate-700 mb-1">Duración (min) *</label>
                                <input type="number" id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} required className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none" />
                            </div>
                             <div>
                                <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1">Precio (COP) *</label>
                                <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none" />
                            </div>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Imagen del Servicio *</label>
                            <div 
                                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md cursor-pointer hover:border-brand-primary"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {imageUrl ? (
                                    <img src={imageUrl} alt="Vista previa del servicio" className="max-h-40 rounded-lg object-contain" />
                                ) : (
                                    <div className="space-y-1 text-center">
                                        <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="flex text-sm text-slate-600">
                                            <p className="pl-1">Sube un archivo</p>
                                        </div>
                                        <p className="text-xs text-slate-500">PNG, JPG hasta 2MB</p>
                                    </div>
                                )}
                            </div>
                            <input 
                                ref={fileInputRef}
                                type="file"
                                id="imageUpload"
                                name="imageUpload"
                                className="hidden"
                                accept="image/png, image/jpeg"
                                onChange={handleImageUpload}
                            />
                        </div>
                         <div>
                            <label htmlFor="locationType" className="block text-sm font-medium text-slate-700 mb-1">Tipo de Ubicación *</label>
                            <select id="locationType" value={locationType} onChange={(e) => setLocationType(e.target.value as any)} className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-brand-primary">
                                <option value="Gimnasio">Gimnasio</option>
                                <option value="A Domicilio">A Domicilio</option>
                                <option value="Virtual">Virtual</option>
                            </select>
                        </div>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 mt-auto">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancelar</button>
                        <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-secondary">Guardar Servicio</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
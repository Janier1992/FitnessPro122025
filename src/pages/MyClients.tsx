
import React, { useState, useMemo } from 'react';
import { mockClients } from '../data/coach';
import type { Client } from '../types';
import { EmptyState } from '../components/EmptyState';
import { useFeedback } from '../components/FeedbackSystem';

// A simple modal for adding notes
const NoteModal: React.FC<{ client: Client, onClose: () => void, onAddNote: (clientId: number, note: string) => void }> = ({ client, onClose, onAddNote }) => {
    const [note, setNote] = useState('');
    
    const handleAdd = () => {
        if (note.trim()) {
            onAddNote(client.id, note);
            onClose();
        }
    };

    return (
         <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800">Añadir Nota para {client.name}</h3>
                </div>
                <div className="p-6">
                    <textarea 
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={4}
                        className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-primary focus:outline-none resize-none"
                        placeholder="Escribe detalles sobre el progreso, lesiones o ajustes en la rutina..."
                        autoFocus
                    />
                </div>
                <div className="p-4 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancelar</button>
                    <button onClick={handleAdd} className="px-4 py-2 text-sm font-bold text-white bg-brand-primary rounded-lg hover:bg-brand-secondary shadow-md transition-transform hover:scale-105">Guardar Nota</button>
                </div>
            </div>
        </div>
    );
};


export const MyClients: React.FC = () => {
    const [clients, setClients] = useState<Client[]>(mockClients);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const { showToast } = useFeedback();

    const filteredClients = useMemo(() => {
        return clients.filter(client =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [clients, searchTerm]);

    const handleAddNote = (clientId: number, note: string) => {
        setClients(prevClients => 
            prevClients.map(client => {
                if (client.id === clientId) {
                    return { ...client, notes: [`${new Date().toISOString().split('T')[0]}: ${note}`, ...client.notes] };
                }
                return client;
            })
        );
        showToast('Nota añadida al expediente del cliente', 'success');
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 animate-fade-in">
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Mis Clientes</h1>
                <p className="mt-2 text-lg text-slate-600">Realiza el seguimiento del progreso y añade notas personalizadas.</p>
            </div>

            {clients.length > 0 ? (
                <>
                    <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200 mb-8 sticky top-20 z-20">
                        <div className="relative">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <input
                                type="text"
                                placeholder="Buscar cliente por nombre..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredClients.length > 0 ? filteredClients.map(client => (
                            <div key={client.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                    <div className="md:col-span-4 flex items-center gap-3">
                                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                                            {client.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-lg">{client.name}</p>
                                            <p className="text-sm text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-md inline-block">{client.goal}</p>
                                        </div>
                                    </div>
                                    <div className="md:col-span-6">
                                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                                            <span>Progreso General</span>
                                            <span>{client.progress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                            <div className="bg-brand-primary h-full rounded-full transition-all duration-1000" style={{ width: `${client.progress}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 flex justify-end">
                                        <button onClick={() => setSelectedClient(client)} className="flex items-center gap-2 bg-slate-50 text-slate-700 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-slate-200 transition-colors border border-slate-200">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            Nota
                                        </button>
                                    </div>
                                </div>
                                {client.notes.length > 0 && (
                                     <div className="mt-4 pt-4 border-t border-slate-100">
                                        <div className="flex items-start gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                            <div>
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Última Observación</p>
                                                <p className="text-sm text-slate-600 italic bg-yellow-50/50 p-2 rounded border border-yellow-100/50">"{client.notes[0]}"</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )) : (
                            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <p className="text-slate-500">No se encontraron clientes con ese nombre.</p>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <EmptyState
                    title="Aún no tienes clientes"
                    description="Cuando los usuarios reserven tus servicios, aparecerán aquí para que puedas gestionar su progreso."
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                />
            )}
            
            {selectedClient && (
                <NoteModal client={selectedClient} onClose={() => setSelectedClient(null)} onAddNote={handleAddNote} />
            )}
        </div>
    );
};

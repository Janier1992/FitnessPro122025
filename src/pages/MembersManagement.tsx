
import React, { useState, useMemo } from 'react';
import { mockMembers } from '../data/gym';
import type { GymMember } from '../data/gym';
import { AddMemberModal } from '../components/AddMemberModal';
import { EditMemberModal } from '../components/EditMemberModal';
import { DeleteMemberModal } from '../components/DeleteMemberModal';
import { User } from '../types';


const statusColors: { [key: string]: string } = {
    'Al día': 'bg-green-100 text-green-800',
    'Vencido': 'bg-red-100 text-red-800',
};

const planColors: { [key: string]: string } = {
    'básico': 'bg-blue-100 text-blue-800',
    'premium': 'bg-yellow-100 text-yellow-800',
}

interface NewMemberData {
  name: string;
  email: string;
  password: string;
  plan: 'básico' | 'premium';
  joinDate: string;
  firstPaymentDate: string;
}

interface MembersManagementProps {
    onAddUser: (user: User) => void;
    onUpdateUser: (originalEmail: string, updatedUser: User) => void;
    onDeleteUser: (email: string) => void;
}


export const MembersManagement: React.FC<MembersManagementProps> = ({ onAddUser, onUpdateUser, onDeleteUser }) => {
    const [members, setMembers] = useState<GymMember[]>(mockMembers);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [memberToEdit, setMemberToEdit] = useState<GymMember | null>(null);
    const [memberToDelete, setMemberToDelete] = useState<GymMember | null>(null);

    const filteredMembers = useMemo(() => {
        return members.filter(member => {
            const nameMatch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
            const statusMatch = statusFilter === 'Todos' || member.status === statusFilter;
            return nameMatch && statusMatch;
        }).sort((a, b) => b.id - a.id); // Sort by most recent ID
    }, [members, searchTerm, statusFilter]);

    const handleAddMember = (newMemberData: NewMemberData) => {
        const newId = members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 101;

        const newMember: GymMember = {
            id: newId,
            name: newMemberData.name,
            email: newMemberData.email,
            password: newMemberData.password,
            plan: newMemberData.plan,
            joinDate: newMemberData.joinDate,
            status: 'Al día',
            lastPayment: newMemberData.firstPaymentDate,
            paymentHistory: [newMemberData.firstPaymentDate],
        };

        setMembers(prevMembers => [newMember, ...prevMembers]);
        
        // Also add to the global user database
        // FIX: Added missing 'name' and 'notifications' properties to satisfy the User type.
        const newUserAccount: User = {
            name: newMemberData.name,
            email: newMemberData.email,
            password: newMemberData.password,
            subscriptionStatus: 'subscribed', // New members are 'Al día' by default
            isGymMember: true,
            trialEndDate: null,
            accountType: 'user', // They log in as a user
            plan: newMemberData.plan,
            notifications: [],
        };
        onAddUser(newUserAccount);

        setIsAddModalOpen(false);
    };
    
    const handleUpdateMember = (updatedMember: GymMember) => {
        const originalMember = members.find(m => m.id === updatedMember.id);
        if (!originalMember) return;

        setMembers(prevMembers => 
            prevMembers.map(member => member.id === updatedMember.id ? updatedMember : member)
        );

        // FIX: Added missing 'name' and 'notifications' properties to satisfy the User type.
        const updatedUserAccount: User = {
            name: updatedMember.name,
            email: updatedMember.email,
            password: updatedMember.password,
            subscriptionStatus: updatedMember.status === 'Al día' ? 'subscribed' : 'expired',
            isGymMember: true,
            trialEndDate: null,
            accountType: 'user',
            plan: updatedMember.plan,
            notifications: [],
        };
        onUpdateUser(originalMember.email, updatedUserAccount);
        
        setMemberToEdit(null);
    };

    const handleDeleteMember = () => {
        if (memberToDelete) {
            setMembers(prevMembers => 
                prevMembers.filter(member => member.id !== memberToDelete.id)
            );
            onDeleteUser(memberToDelete.email);
            setMemberToDelete(null);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Gestión de Miembros</h1>
                    <p className="mt-2 text-lg text-slate-600">Administra, busca y filtra los miembros de tu gimnasio.</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-secondary transition-colors flex items-center gap-2">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Añadir Miembro
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200 mb-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <input
                        type="text"
                        placeholder="Buscar miembro por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none"
                    />
                     <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none bg-white"
                    >
                        <option value="Todos">Todos los estados</option>
                        <option value="Al día">Al día</option>
                        <option value="Vencido">Vencido</option>
                    </select>
                </div>
            </div>

            {/* Members Table */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-sm text-slate-600">
                            <tr>
                                <th className="p-4 font-semibold">ID</th>
                                <th className="p-4 font-semibold">Nombre</th>
                                <th className="p-4 font-semibold">Correo</th>
                                <th className="p-4 font-semibold text-center">Plan</th>
                                <th className="p-4 font-semibold text-center">Estado</th>
                                <th className="p-4 font-semibold">Último Pago</th>
                                <th className="p-4 font-semibold">Historial de Pagos</th>
                                <th className="p-4 font-semibold">Fecha de Ingreso</th>
                                <th className="p-4 font-semibold text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMembers.map(member => (
                                <tr key={member.id} className="border-t border-slate-200 hover:bg-slate-50">
                                    <td className="p-4 text-slate-500">{member.id}</td>
                                    <td className="p-4 font-medium text-slate-800">{member.name}</td>
                                    <td className="p-4 text-slate-700">{member.email}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${planColors[member.plan]}`}>
                                            {member.plan}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[member.status]}`}>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-700">{member.lastPayment}</td>
                                    <td className="p-4 text-slate-700 text-xs">
                                        {(member.paymentHistory || []).slice(0, 3).map((date, i) => <div key={i}>{date}</div>)}
                                    </td>
                                    <td className="p-4 text-slate-700">{member.joinDate}</td>
                                    <td className="p-4 text-center space-x-2">
                                        <button onClick={() => setMemberToEdit(member)} className="text-slate-500 hover:text-brand-primary p-1" title="Editar"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg></button>
                                        <button onClick={() => setMemberToDelete(member)} className="text-slate-500 hover:text-red-500 p-1" title="Eliminar"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {isAddModalOpen && (
                <AddMemberModal 
                    onClose={() => setIsAddModalOpen(false)} 
                    onAddMember={handleAddMember} 
                />
            )}

            {memberToEdit && (
                <EditMemberModal 
                    member={memberToEdit}
                    onClose={() => setMemberToEdit(null)}
                    onUpdateMember={handleUpdateMember}
                />
            )}

            {memberToDelete && (
                <DeleteMemberModal 
                    member={memberToDelete}
                    onClose={() => setMemberToDelete(null)}
                    onConfirmDelete={handleDeleteMember}
                />
            )}
        </div>
    );
};

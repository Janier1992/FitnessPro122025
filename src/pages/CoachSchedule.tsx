
import React, { useState, useMemo } from 'react';
import { User } from '../types';
import { GroupClass } from '../types';
import { ScheduleConfirmationModal } from '../components/ScheduleConfirmationModal';
import { EmptyState } from '../components/EmptyState';
import { useFeedback } from '../components/FeedbackSystem';

interface CoachScheduleProps {
    user: User;
    allClasses: GroupClass[];
    onUpdateBookingStatus: (classId: number, newStatus: 'confirmed' | 'cancelled' | 'completed', newSchedule?: { day: string; time: string }) => void;
}

export const CoachSchedule: React.FC<CoachScheduleProps> = ({ user, allClasses, onUpdateBookingStatus }) => {
    const [sessionToConfirm, setSessionToConfirm] = useState<GroupClass | null>(null);
    const { showToast } = useFeedback();

    const coachClasses = useMemo(() => {
        return allClasses.filter(c => c.coach === user.name && c.category === 'Personalizado');
    }, [allClasses, user.name]);

    const pendingRequests = useMemo(() => coachClasses.filter(c => c.status === 'pending_confirmation'), [coachClasses]);
    const confirmedSchedule = useMemo(() => coachClasses.filter(c => c.status === 'confirmed'), [coachClasses]);
    const completedSchedule = useMemo(() => coachClasses.filter(c => c.status === 'completed'), [coachClasses]);


    const handleConfirmSchedule = (classId: number, newSchedule: { day: string; time: string }) => {
        onUpdateBookingStatus(classId, 'confirmed', newSchedule);
        setSessionToConfirm(null);
        showToast('Sesión agendada correctamente', 'success');
    };

    const handleCancelRequest = (classId: number) => {
        // In a full refactor, this would use a custom modal, but for now we rely on the Toast feedback
        // after the action is taken. To strictly follow "visual unified feedback", we can assume
        // rejection is a simple action or add a custom modal later. 
        // For this step, we'll use the browser confirm but enhance the feedback afterwards.
        if (window.confirm('¿Estás seguro de que quieres rechazar esta solicitud?')) {
            onUpdateBookingStatus(classId, 'cancelled');
            showToast('Solicitud rechazada', 'info');
        }
    };
    
    const handleCompleteSession = (classId: number) => {
        if (window.confirm('¿Marcar esta sesión como completada?')) {
            onUpdateBookingStatus(classId, 'completed');
            showToast('¡Sesión completada! Buen trabajo.', 'success');
        }
    }

    const RequestCard: React.FC<{ request: GroupClass }> = ({ request }) => (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 transition-all hover:shadow-md">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded uppercase">Solicitud</span>
                        <p className="font-bold text-slate-800">{request.name}</p>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">Cliente: <span className="font-semibold">{request.bookedBy}</span></p>
                    <p className="text-sm text-slate-500">Solicitado: {request.schedule[0].day}</p>
                    {request.locationType === 'A Domicilio' && (
                        <p className="text-sm text-blue-600 font-semibold mt-1 flex items-center gap-1">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                             {request.clientAddress}
                        </p>
                    )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                    <button 
                        onClick={() => handleCancelRequest(request.id)}
                        className="bg-red-50 text-red-600 font-semibold py-2 px-3 rounded-lg text-sm hover:bg-red-100 transition-colors border border-red-100">
                        Rechazar
                    </button>
                    <button 
                        onClick={() => setSessionToConfirm(request)}
                        className="bg-brand-primary text-white font-semibold py-2 px-3 rounded-lg text-sm hover:bg-brand-secondary transition-colors shadow-sm">
                        Agendar
                    </button>
                </div>
            </div>
        </div>
    );
    
    const ScheduleCard: React.FC<{ session: GroupClass, isCompleted?: boolean }> = ({ session, isCompleted = false }) => (
         <div className={`p-4 rounded-lg border transition-all ${isCompleted ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-white border-slate-200 hover:border-brand-primary/30 hover:shadow-sm'}`}>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <p className={`font-bold ${isCompleted ? 'text-slate-500' : 'text-slate-800'}`}>{session.name}</p>
                    <p className={`text-sm ${isCompleted ? 'text-slate-400' : 'text-slate-600'}`}>Cliente: <span className="font-semibold">{session.bookedBy}</span></p>
                    <p className={`text-sm font-semibold flex items-center gap-1 ${isCompleted ? 'text-slate-500' : 'text-green-600'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {session.schedule[0].day}, {session.schedule[0].time}
                    </p>
                </div>
                {!isCompleted && (
                    <button onClick={() => handleCompleteSession(session.id)} className="bg-green-100 text-green-700 font-semibold py-2 px-3 rounded-lg text-sm hover:bg-green-200 transition-colors">
                        Marcar como Completada
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 space-y-12 animate-fade-in">
            <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Mi Horario</h1>
                <p className="mt-2 text-lg text-slate-600">Gestiona tus solicitudes de entrenamiento y tu agenda confirmada.</p>
            </div>

            {/* Pending Requests */}
            <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    Solicitudes Pendientes 
                    {pendingRequests.length > 0 && <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded-full">{pendingRequests.length}</span>}
                </h2>
                {pendingRequests.length > 0 ? (
                    <div className="space-y-4">
                        {pendingRequests.map(req => <RequestCard key={req.id} request={req} />)}
                    </div>
                ) : (
                    <EmptyState 
                        title="Todo al día" 
                        description="No tienes nuevas solicitudes pendientes. Revisa tu agenda confirmada o promociona tus servicios."
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    />
                )}
            </section>
            
            {/* Confirmed Schedule */}
            <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Horario Confirmado</h2>
                 {confirmedSchedule.length > 0 ? (
                    <div className="space-y-4">
                        {confirmedSchedule.map(session => <ScheduleCard key={session.id} session={session} />)}
                    </div>
                ) : (
                    <EmptyState
                        title="Agenda Libre"
                        description="No tienes sesiones confirmadas próximamente. ¡Aprovecha para descansar o captar nuevos clientes!"
                    />
                )}
            </section>
            
            {/* Completed Sessions */}
            <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Historial de Sesiones</h2>
                 {completedSchedule.length > 0 ? (
                    <div className="space-y-4">
                        {completedSchedule.map(session => <ScheduleCard key={session.id} session={session} isCompleted={true} />)}
                    </div>
                ) : (
                    <p className="text-slate-400 text-sm italic">Aún no has completado sesiones. El historial aparecerá aquí.</p>
                )}
            </section>

            {sessionToConfirm && user.availability && (
                <ScheduleConfirmationModal
                    session={sessionToConfirm}
                    coachAvailability={user.availability}
                    onClose={() => setSessionToConfirm(null)}
                    onConfirm={handleConfirmSchedule}
                />
            )}
        </div>
    );
};

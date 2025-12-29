
import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { User, type Theme, type NavItem } from './types';
import { Dashboard } from './pages/Dashboard';
import { MyRoutines } from './pages/MyRoutines';
import { ExerciseLibrary } from './pages/ExerciseLibrary';
import { GroupClasses } from './pages/GroupClasses';
import { MyProgress } from './pages/MyProgress';
import { AIWellnessHub } from './pages/AIWellnessHub';
import { ExploreGyms } from './pages/ExploreGyms';
import { MobileBottomNav } from './components/MobileBottomNav';
import { OnboardingTour } from './components/OnboardingTour';

// Páginas de Gimnasio
import { GymDashboard } from './pages/GymDashboard';
import { MembersManagement } from './pages/MembersManagement';
import { InventoryManagement } from './pages/InventoryManagement';
import { FinanceManagement } from './pages/FinanceManagement';
import { MarketingAutomations } from './pages/MarketingAutomations';

// Páginas de Entrenador
import { CoachDashboard } from './pages/CoachDashboard';
import { MyClients } from './pages/MyClients';
import { CoachSchedule } from './pages/CoachSchedule';
import { PersonalTraining } from './pages/PersonalTraining';

import { type GroupClass, type CoachService } from './types';

// --- Iconos SVG ---
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const RoutinesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const LibraryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>;
const ClassesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const ProgressIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const AIIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.871 4.871a2.25 2.25 0 013.182 0l1.82 1.819a2.25 2.25 0 003.182 0l1.82-1.82a2.25 2.25 0 013.182 0l1.82 1.82a2.25 2.25 0 003.182 0l1.82-1.82a2.25 2.25 0 013.182 0M4.87 19.129a2.25 2.25 0 003.182 0l1.82-1.82a2.25 2.25 0 013.182 0l1.82 1.82a2.25 2.25 0 003.182 0l1.82-1.82a2.25 2.25 0 013.182 0" /></svg>;
const MembersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-1.781-4.121" /></svg>;
const InventoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>;
const FinanceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>;
const ClientsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const ScheduleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const ServicesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2h2" /></svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const MarketingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>;


interface MainAppProps {
    user: User;
    users: User[];
    onLogout: () => void;
    theme: Theme;
    onToggleTheme: () => void;
    onAddUser: (user: User) => void;
    onUpdateUser: (originalEmail: string, updatedUser: User) => void;
    onDeleteUser: (email: string) => void;
    onSendNotification: (userEmail: string, message: string) => void;
    onMarkNotificationsAsRead: () => void;
    coachServices: CoachService[];
    onAddService: (newServiceData: Omit<CoachService, 'id'>) => void;
    onNavigateToLogin: () => void;
    onNavigateToRegister: () => void;
}

const userNavItems: NavItem[] = [
    { name: 'Dashboard', icon: <DashboardIcon /> },
    { name: 'Mis Rutinas', icon: <RoutinesIcon /> },
    { name: 'Biblioteca', icon: <LibraryIcon /> },
    { name: 'Clases Grupales', icon: <ClassesIcon /> },
    { name: 'Entrenamiento Personal', icon: <ServicesIcon /> },
    { name: 'Explorar Gimnasios', icon: <MapPinIcon /> },
    { name: 'Mi Progreso', icon: <ProgressIcon /> },
    { name: 'Bienestar AI', icon: <AIIcon /> },
];

const gymNavItems: NavItem[] = [
    { name: 'Dashboard', icon: <DashboardIcon /> },
    { name: 'Miembros', icon: <MembersIcon /> },
    { name: 'Automatización', icon: <MarketingIcon /> },
    { name: 'Inventario', icon: <InventoryIcon /> },
    { name: 'Finanzas', icon: <FinanceIcon /> },
];

const coachNavItems: NavItem[] = [
    { name: 'Dashboard', icon: <DashboardIcon /> },
    { name: 'Mis Clientes', icon: <ClientsIcon /> },
    { name: 'Mi Horario', icon: <ScheduleIcon /> },
    { name: 'Servicios', icon: <ServicesIcon /> },
    { name: 'Bienestar AI', icon: <AIIcon /> },
];


export const MainApp: React.FC<MainAppProps> = ({ user, users, onLogout, theme, onToggleTheme, onAddUser, onUpdateUser, onDeleteUser, onSendNotification, onMarkNotificationsAsRead, coachServices, onAddService, onNavigateToLogin, onNavigateToRegister }) => {

    const [allClasses, setAllClasses] = useState<GroupClass[]>([]);

    useEffect(() => {
        import('./services/supabaseService').then(({ supabaseService }) => {
            supabaseService.getClasses()
                .then(data => {
                    console.log('Classes loaded from Supabase:', data.length);
                    setAllClasses(data);
                })
                .catch(err => console.error('Failed to load classes:', err));
        });
    }, []);
    const [showTour, setShowTour] = useState(false);

    // Efecto para mostrar el tour de bienvenida si no se ha visto
    useEffect(() => {
        const hasSeenTour = localStorage.getItem(`tour_seen_${user.email}`);
        if (!hasSeenTour && user.hasCompletedOnboarding) {
            setShowTour(true);
        }
    }, [user.email, user.hasCompletedOnboarding]);

    const handleTourComplete = () => {
        setShowTour(false);
        localStorage.setItem(`tour_seen_${user.email}`, 'true');
    };

    // Calcular items de navegación según el tipo de usuario
    const navItems = useMemo(() => {
        switch (user.accountType) {
            case 'gym':
                return gymNavItems;
            case 'entrenador':
                return coachNavItems;
            case 'user':
            default:
                return userNavItems;
        }
    }, [user.accountType]);

    const [activeItem, setActiveItem] = useState(navItems[0].name);

    // Resetear item activo si no es válido para el nuevo usuario
    useEffect(() => {
        const currentItemIsValid = navItems.some(item => item.name === activeItem);
        if (!currentItemIsValid) {
            setActiveItem(navItems[0].name);
        }
    }, [navItems]);

    // Manejador para reservar servicios
    const handleBookService = (service: CoachService, date: string, time: string, clientAddress?: string) => {
        const newBooking: GroupClass = {
            id: Date.now(),
            name: service.serviceName,
            description: service.description,
            imageUrl: service.imageUrl,
            difficulty: 'Intermedio',
            category: 'Personalizado',
            coach: service.coach,
            capacity: 1,
            duration: service.duration,
            schedule: [{ day: date, time: time }],
            locationType: service.locationType === 'Virtual' ? 'Gimnasio' : service.locationType,
            clientAddress: clientAddress,
            bookedBy: user.name,
            status: 'pending_confirmation',
        };

        setAllClasses(prev => [...prev, newBooking]);
        onSendNotification(user.email, `Tu solicitud para "${service.serviceName}" ha sido enviada. Espera la confirmación del entrenador.`);

        const coach = users.find(u => u.name === service.coach && u.accountType === 'entrenador');
        if (coach) {
            onSendNotification(coach.email, `Nueva solicitud de entrenamiento de ${user.name} para "${service.serviceName}".`);
        }
    };

    // Actualizar estado de reserva
    const handleUpdateBookingStatus = (classId: number, newStatus: 'confirmed' | 'cancelled' | 'completed', newSchedule?: { day: string, time: string }) => {
        setAllClasses(prevClasses => {
            let classToUpdate: GroupClass | undefined;
            const updatedClasses = prevClasses.map(c => {
                if (c.id === classId) {
                    classToUpdate = c;
                    const updatedClass = { ...c, status: newStatus };
                    if (newStatus === 'confirmed' && newSchedule) {
                        updatedClass.schedule = [newSchedule];
                    }
                    return updatedClass;
                }
                return c;
            });

            if (classToUpdate && classToUpdate.bookedBy) {
                let notificationMessage = '';
                if (newStatus === 'confirmed' && newSchedule) {
                    notificationMessage = `Tu sesión de "${classToUpdate.name}" ha sido confirmada para el ${newSchedule.day} a las ${newSchedule.time}.`;
                } else if (newStatus === 'cancelled') {
                    notificationMessage = `Tu solicitud para "${classToUpdate.name}" fue rechazada por el entrenador.`;
                } else if (newStatus === 'completed') {
                    notificationMessage = `¡Buen trabajo! Tu sesión de "${classToUpdate.name}" ha sido completada.`;
                }

                if (notificationMessage) {
                    const userToNotify = users.find(u => u.name === classToUpdate!.bookedBy);
                    if (userToNotify) {
                        onSendNotification(userToNotify.email, notificationMessage);
                    }
                }
            }

            return updatedClasses;
        });
    };

    // Renderizar contenido basado en el tipo de usuario y item activo
    const renderContent = () => {
        if (user.accountType === 'user') {
            switch (activeItem) {
                case 'Dashboard': return <Dashboard user={user} onNavigate={setActiveItem} />;
                case 'Mis Rutinas': return <MyRoutines />;
                case 'Biblioteca': return <ExerciseLibrary />;
                case 'Clases Grupales': return <GroupClasses allClasses={allClasses} />;
                case 'Mi Progreso': return <MyProgress user={user} />;
                case 'Bienestar AI': return <AIWellnessHub user={user} />;
                case 'Explorar Gimnasios': return <ExploreGyms />;
                case 'Entrenamiento Personal':
                    return <PersonalTraining
                        coachServices={coachServices}
                        onBookService={handleBookService}
                        user={user}
                        allClasses={allClasses}
                    />;
                default: return <Dashboard user={user} onNavigate={setActiveItem} />;
            }
        }
        if (user.accountType === 'gym') {
            switch (activeItem) {
                case 'Dashboard': return <GymDashboard onNavigate={setActiveItem} />;
                case 'Miembros': return <MembersManagement onAddUser={onAddUser} onUpdateUser={onUpdateUser} onDeleteUser={onDeleteUser} />;
                case 'Automatización': return <MarketingAutomations />;
                case 'Inventario': return <InventoryManagement />;
                case 'Finanzas': return <FinanceManagement />;
                default: return <GymDashboard onNavigate={setActiveItem} />;
            }
        }
        if (user.accountType === 'entrenador') {
            switch (activeItem) {
                case 'Dashboard': return <CoachDashboard user={user} onNavigate={setActiveItem} onUpdateUser={onUpdateUser} allClasses={allClasses} />;
                case 'Mis Clientes': return <MyClients />;
                case 'Mi Horario': return <CoachSchedule user={user} allClasses={allClasses} onUpdateBookingStatus={handleUpdateBookingStatus} />;
                case 'Servicios':
                    return <PersonalTraining
                        isCoachView={true}
                        coachServices={coachServices.filter(s => s.coach === user.name)}
                        onBookService={() => { }}
                        user={user}
                        onAddService={onAddService}
                    />;
                case 'Bienestar AI': return <AIWellnessHub user={user} />;
                default: return <CoachDashboard user={user} onNavigate={setActiveItem} onUpdateUser={onUpdateUser} allClasses={allClasses} />;
            }
        }
        return null;
    };

    // Pasos del tour de onboarding
    const getTourSteps = () => {
        if (user.accountType === 'user') {
            return [
                { targetId: 'nav-item-0', title: 'Tu Centro de Control', content: 'Aquí verás un resumen de tu actividad diaria, próximas clases y consejos rápidos.', position: 'right' as const },
                { targetId: 'nav-item-1', title: 'Rutinas con IA', content: 'Genera planes de entrenamiento personalizados en segundos usando nuestra inteligencia artificial.', position: 'right' as const },
                { targetId: 'nav-item-7', title: 'Tu Coach Personal', content: 'Habla con nuestra IA sobre nutrición, bienestar o dudas de ejercicios 24/7.', position: 'right' as const },
            ];
        } else if (user.accountType === 'gym') {
            return [
                { targetId: 'nav-item-0', title: 'Gestión Total', content: 'Monitorea KPIs clave, ingresos y miembros en riesgo desde un solo lugar.', position: 'right' as const },
                { targetId: 'nav-item-1', title: 'Base de Miembros', content: 'Administra suscripciones, estados de pago y perfiles de tus clientes.', position: 'right' as const },
                { targetId: 'nav-item-3', title: 'Salud Financiera', content: 'Registra ingresos y gastos para mantener la rentabilidad de tu negocio.', position: 'right' as const },
            ];
        } else {
            return [
                { targetId: 'nav-item-0', title: 'Tu Oficina Digital', content: 'Gestiona tus clientes, próximas sesiones y disponibilidad.', position: 'right' as const },
                { targetId: 'nav-item-2', title: 'Agenda Inteligente', content: 'Revisa solicitudes de clases y confirma tu horario semanal.', position: 'right' as const },
                { targetId: 'nav-item-3', title: 'Tus Servicios', content: 'Define qué ofreces y a qué precio. Los usuarios podrán reservarte directamente.', position: 'right' as const },
            ];
        }
    }

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
            {/* Sidebar de escritorio */}
            <Sidebar
                navItems={navItems}
                activeItem={activeItem}
                onNavigate={setActiveItem}
                onLogout={onLogout}
            />

            {/* Contenedor Principal */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Cabecera superior */}
                <Header
                    user={user}
                    onLogout={onLogout}
                    theme={theme}
                    onToggleTheme={onToggleTheme}
                    onMarkNotificationsAsRead={onMarkNotificationsAsRead}
                    onNavigateToLogin={onNavigateToLogin}
                    onNavigateToRegister={onNavigateToRegister}
                />

                {/* Contenido desplazable */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden pb-20 md:pb-0 scroll-smooth">
                    {renderContent()}
                </main>

                {/* Navegación móvil (visible solo en pantallas pequeñas) */}
                <MobileBottomNav
                    navItems={navItems}
                    activeItem={activeItem}
                    onNavigate={setActiveItem}
                />
            </div>

            {showTour && (
                <div className="hidden md:block">
                    <OnboardingTour steps={getTourSteps()} onComplete={handleTourComplete} />
                </div>
            )}
        </div>
    );
};

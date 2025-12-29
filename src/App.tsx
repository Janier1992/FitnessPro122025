
import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { supabaseService } from './services/supabaseService';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { MainApp } from './MainApp';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { GoogleLoginModal } from './components/GoogleLoginModal';
import { OnboardingWizard } from './components/OnboardingWizard';
import { FeedbackProvider } from './components/FeedbackSystem';
import { ReloadPrompt } from './components/ReloadPrompt';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';

import { USERS_DATA } from './data/users';

import { type Notification, type CoachService, type User, type Theme } from './types';

// Definición de las vistas de la aplicación
type AppView = 'landing' | 'login' | 'register' | 'subscription' | 'onboarding' | 'main';

// Estado para el proceso de registro
type RegistrationState = {
  accountType: 'user' | 'gym' | 'entrenador';
  plan: 'básico' | 'premium';
};

// Usuario invitado por defecto
const GUEST_USER: User = {
  name: 'Invitado',
  email: 'guest@fitnessflow.pro',
  accountType: 'user',
  plan: 'básico',
  subscriptionStatus: 'subscribed', // Para omitir la página de suscripción
  isGymMember: false,
  trialEndDate: null,
  notifications: [],
  hasCompletedOnboarding: true,
};

const App: React.FC = () => {
  // --- Estados de la Aplicación ---
  const [theme, setTheme] = useState<Theme>('light');
  const [users, setUsers] = useState<User[]>(USERS_DATA);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [registrationState, setRegistrationState] = useState<RegistrationState>({ accountType: 'user', plan: 'básico' });
  const [isGoogleLoginModalOpen, setIsGoogleLoginModalOpen] = useState(false);
  const [coachServices, setCoachServices] = useState<CoachService[]>([]);

  // Fetch initial data from Supabase and Handle Auth
  useEffect(() => {
    // 1. Fetch Services
    supabaseService.getCoachServices()
      .then(data => setCoachServices(data))
      .catch(err => console.error('Failed to load services:', err));

    // 2. Handle Session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) handleAuthUser(session.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        handleAuthUser(session.user);
      } else {
        setCurrentUser(null);
        // Don't force view change if user is manually navigating, 
        // but if they were in main, go to landing? 
        // For now, simple reset.
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthUser = async (authUser: any) => {
    try {
      const profile = await supabaseService.getUserProfile(authUser.id);
      if (profile) {
        // Construct User object from DB Profile + Auth Data
        const newUser: User = {
          name: profile.nombre_completo || authUser.email.split('@')[0],
          email: authUser.email,
          accountType: profile.tipo_cuenta || 'user',
          plan: 'básico',
          subscriptionStatus: 'trial',
          isGymMember: false,
          trialEndDate: null,
          notifications: [],
          hasCompletedOnboarding: !!profile.nombre_completo,
          // Default props for Trainner/Gym if needed
          ...(profile.tipo_cuenta === 'entrenador' ? { profession: '', availability: [] } : {})
        };

        setUsers(prev => {
          if (prev.find(u => u.email === newUser.email)) return prev;
          return [...prev, newUser];
        });
        setCurrentUser(newUser);

        // Redirect to main if on landing/auth pages
        setCurrentView(prev => (['landing', 'login', 'register'].includes(prev) ? 'main' : prev));
      }
    } catch (e) {
      console.error("Error handling auth user:", e);
    }
  };


  // Efecto para aplicar el tema (oscuro/claro)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Manejador para alternar tema
  const handleToggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Navegación
  const handleNavigateToLogin = () => setCurrentView('login');

  // Iniciar proceso de registro
  const handleStartRegistration = (accountType: 'user' | 'gym' | 'entrenador', plan: 'básico' | 'premium') => {
    setRegistrationState({ accountType, plan });
    setCurrentView('register');
  };

  // Manejador de inicio de sesión exitoso
  const handleLoginSuccess = ({ email }: { email: string }) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      if (user.subscriptionStatus === 'expired') {
        setCurrentUser(user);
        setCurrentView('subscription');
      } else {
        setCurrentUser(user);
        // Verificar si se necesita onboarding
        if (user.hasCompletedOnboarding) {
          setCurrentView('main');
        } else {
          setCurrentView('onboarding');
        }
      }
    } else {
      alert("Usuario no encontrado.");
    }
  };

  // Manejadores para Login con Google
  const handleGoogleLogin = () => {
    setIsGoogleLoginModalOpen(true);
  };

  const handleGoogleAccountSelect = (account: { name: string; email: string }) => {
    setIsGoogleLoginModalOpen(false);
    handleLoginSuccess({ email: account.email });
  };

  // Manejador de registro exitoso
  const handleRegisterSuccess = (data: Partial<User> & { email: string, accountType: 'user' | 'gym' | 'entrenador', plan: 'básico' | 'premium' }) => {
    const newUser: User = {
      name: data.name || 'Nuevo Usuario',
      email: data.email,
      password: data.password,
      accountType: data.accountType,
      plan: data.plan,
      subscriptionStatus: 'trial',
      isGymMember: false,
      trialEndDate: new Date(new Date().setDate(new Date().getDate() + 14)), // Prueba de 14 días
      notifications: [{ id: 1, message: '¡Bienvenido a tu prueba de FitnessFlow Pro!', date: new Date().toLocaleDateString(), read: false }],
      hasCompletedOnboarding: false,
      ...(data.accountType === 'user' && { profile: undefined }),
      ...(data.accountType === 'entrenador' && {
        profession: data.profession || '',
        professionalDescription: data.professionalDescription || '',
        phone: data.phone || '',
        address: data.address || '',
        cc: data.cc || '',
        availability: [],
      }),
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setCurrentView('onboarding'); // Ir al onboarding en lugar del main
  };

  const handleOnboardingComplete = () => {
    if (currentUser) {
      const updatedUser = { ...currentUser, hasCompletedOnboarding: true };
      handleUpdateUser(currentUser.email, updatedUser);
      setCurrentView('main');
    }
  }

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const handleGuestLogin = () => {
    setCurrentUser(GUEST_USER);
    setCurrentView('main');
  };

  const handleGoToLogin = () => {
    setCurrentUser(null);
    setCurrentView('login');
  };

  const handleGoToRegister = () => {
    setCurrentUser(null);
    handleStartRegistration('user', 'básico');
  };

  // Manejador de suscripción exitosa
  const handleSubscriptionSuccess = () => {
    if (currentUser) {
      handleUpdateUser(currentUser.email, { ...currentUser, subscriptionStatus: 'subscribed' });
      setCurrentView('main');
    } else {
      // Caso borde: usuario con sesión expirada forzado a página de suscripción
      const lastAttemptedEmail = 'ana.garcia@email.com'; // Hack para demo
      const user = users.find(u => u.email === lastAttemptedEmail);
      if (user) {
        const updatedUser: User = { ...user, subscriptionStatus: 'subscribed' };
        setUsers(prev => prev.map(u => u.email === lastAttemptedEmail ? updatedUser : u));
        setCurrentUser(updatedUser);
        setCurrentView('main');
      } else {
        setCurrentView('login');
      }
    }
  };

  // --- Funciones de Administrador/Entrenador ---

  const handleAddUser = (user: User) => setUsers(prev => [...prev, user]);

  const handleUpdateUser = (originalEmail: string, updatedUser: User) => {
    setUsers(prev => prev.map(u => (u.email === originalEmail ? updatedUser : u)));
    if (currentUser && currentUser.email === originalEmail) {
      setCurrentUser(updatedUser);
    }
  };

  const handleDeleteUser = (email: string) => setUsers(prev => prev.filter(u => u.email !== email));

  // Sistema de Notificaciones
  const handleSendNotification = (userEmail: string, message: string) => {
    setUsers(prev => prev.map(u => {
      if (u.email === userEmail) {
        const newNotif: Notification = {
          id: Date.now(),
          message,
          date: new Date().toLocaleString(),
          read: false,
        };
        return { ...u, notifications: [newNotif, ...u.notifications] };
      }
      return u;
    }));
  };

  const handleMarkNotificationsAsRead = () => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        notifications: currentUser.notifications.map(n => ({ ...n, read: true }))
      };
      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.email === currentUser.email ? updatedUser : u));
    }
  }

  const handleAddService = (newServiceData: Omit<CoachService, 'id'>) => {
    const newId = coachServices.length > 0 ? Math.max(...coachServices.map(s => s.id)) + 1 : 1;
    const newService: CoachService = { id: newId, ...newServiceData };
    setCoachServices(prev => [newService, ...prev]);
  };

  // --- Renderizado de Vistas ---

  const renderCurrentView = () => {
    if (currentUser && currentView === 'main') {
      return <MainApp
        user={currentUser}
        users={users}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onAddUser={handleAddUser}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
        onSendNotification={handleSendNotification}
        onMarkNotificationsAsRead={handleMarkNotificationsAsRead}
        coachServices={coachServices}
        onAddService={handleAddService}
        onNavigateToLogin={handleGoToLogin}
        onNavigateToRegister={handleGoToRegister}
      />;
    }

    switch (currentView) {
      case 'login': return <LoginPage onNavigateToRegister={() => handleStartRegistration('user', 'básico')} onLoginSuccess={handleLoginSuccess} onGoogleLogin={handleGoogleLogin} />;
      case 'register': return <RegisterPage onNavigateToLogin={handleNavigateToLogin} onRegisterSuccess={handleRegisterSuccess} onGoogleLogin={handleGoogleLogin} initialAccountType={registrationState.accountType} initialPlan={registrationState.plan} />;
      case 'subscription': return <SubscriptionPage onSubscriptionSuccess={handleSubscriptionSuccess} isGymMember={currentUser?.isGymMember} />;
      case 'onboarding': return currentUser ? <OnboardingWizard user={currentUser} onComplete={handleOnboardingComplete} /> : <LoginPage onNavigateToRegister={() => handleStartRegistration('user', 'básico')} onLoginSuccess={handleLoginSuccess} onGoogleLogin={handleGoogleLogin} />;
      case 'landing':
      default:
        return <LandingPage onStartRegistration={handleStartRegistration} onNavigateToLogin={handleNavigateToLogin} onGuestLogin={handleGuestLogin} />;
    }
  };

  return (
    <FeedbackProvider>
      <ReloadPrompt />
      <PWAInstallPrompt />
      <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
      {renderCurrentView()}
      {isGoogleLoginModalOpen && (
        <GoogleLoginModal
          onClose={() => setIsGoogleLoginModalOpen(false)}
          onSelectAccount={handleGoogleAccountSelect}
        />
      )}
    </FeedbackProvider>
  );
};

export default App;
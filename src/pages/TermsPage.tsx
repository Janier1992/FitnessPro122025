import React from 'react';
import { LandingHeader } from '../components/LandingHeader';
import { LandingFooter } from '../components/LandingFooter';

interface TermsPageProps {
    onNavigateToLogin: () => void;
    onNavigateToHome: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigateToLogin, onNavigateToHome }) => {
    // Dummy prop for header
    const handleRegister = () => onNavigateToHome(); // Redirect to home if clicking register from legal page for now

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
            <LandingHeader onNavigateToRegister={handleRegister} onNavigateToLogin={onNavigateToLogin} />
            <main className="flex-grow container mx-auto px-4 py-12 text-slate-700 dark:text-slate-300">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">Términos y Condiciones</h1>
                <div className="prose dark:prose-invert max-w-none">
                    <p>Última actualización: {new Date().toLocaleDateString()}</p>
                    <h2>1. Introducción</h2>
                    <p>Bienvenido a FitnessFlow. Al acceder y utilizar nuestra plataforma, aceptas cumplir con los siguientes términos y condiciones de acuerdo con la legislación colombiana.</p>
                    <h2>2. Uso del Servicio</h2>
                    <p>FitnessFlow proporciona herramientas para la gestión de entrenamiento y gimnasios. El uso indebido de la plataforma puede resultar en la suspensión de la cuenta.</p>
                    <h2>3. Pagos y Suscripciones</h2>
                    <p>Los precios están expresados en Pesos Colombianos (COP). Las suscripciones se renuevan automáticamente salvo cancelación previa.</p>
                    <h2>4. Responsabilidad</h2>
                    <p>FitnessFlow no se hace responsable por lesiones ocurridas durante la práctica de ejercicios sugeridos. Consulte a un médico antes de iniciar cualquier rutina.</p>
                    <h2>5. Ley Aplicable</h2>
                    <p>Estos términos se rigen por las leyes de la República de Colombia.</p>
                </div>
            </main>
            <LandingFooter />
        </div>
    );
};

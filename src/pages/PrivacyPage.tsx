import React from 'react';
import { LandingHeader } from '../components/LandingHeader';
import { LandingFooter } from '../components/LandingFooter';

interface PrivacyPageProps {
    onNavigateToLogin: () => void;
    onNavigateToHome: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigateToLogin, onNavigateToHome }) => {
    const handleRegister = () => onNavigateToHome();

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
            <LandingHeader onNavigateToRegister={handleRegister} onNavigateToLogin={onNavigateToLogin} />
            <main className="flex-grow container mx-auto px-4 py-12 text-slate-700 dark:text-slate-300">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">Política de Privacidad</h1>
                <div className="prose dark:prose-invert max-w-none">
                    <p>Última actualización: {new Date().toLocaleDateString()}</p>
                    <h2>1. Recolección de Datos</h2>
                    <p>En cumplimiento de la Ley 1581 de 2012 de Protección de Datos Personales (Colombia), informamos que recolectamos datos como nombre, correo y métricas de salud con el único fin de prestar nuestros servicios.</p>
                    <h2>2. Uso de la Información</h2>
                    <p>Sus datos son utilizados para personalizar su experiencia de entrenamiento y gestión.</p>
                    <h2>3. Derechos del Titular</h2>
                    <p>Como titular de los datos, tiene derecho a conocer, actualizar y rectificar su información personal en cualquier momento.</p>
                    <h2>4. Seguridad</h2>
                    <p>Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos (incluyendo cifrado y RLS en base de datos).</p>
                    <h2>5. Contacto</h2>
                    <p>Para ejercer sus derechos, puede contactarnos a través de nuestra plataforma de soporte.</p>
                </div>
            </main>
            <LandingFooter />
        </div>
    );
};

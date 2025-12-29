
import React, { useState } from 'react';
import { OnboardingForm } from '../components/OnboardingForm';
import { WorkoutDisplay } from '../components/WorkoutDisplay';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { generateWorkoutPlan } from '../services/geminiService';
import { type UserProfile, type WorkoutPlan } from '../types';

export const MyRoutines: React.FC = () => {
    const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFormSubmit = async (profile: UserProfile) => {
        setIsLoading(true);
        setError(null);
        try {
            const plan = await generateWorkoutPlan(profile);
            setWorkoutPlan(plan);
        } catch (err) {
            setError('Hubo un error al generar tu plan. Por favor, intenta de nuevo.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setWorkoutPlan(null);
        setError(null);
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 animate-fade-in">
            {isLoading ? (
                <div className="text-center py-10">
                    <LoadingSpinner />
                    <p className="mt-4 text-slate-600 font-semibold text-lg">Tu AI Coach está creando un plan personalizado...</p>
                    <p className="text-slate-500">Esto puede tomar un momento.</p>
                </div>
            ) : error ? (
                <div className="text-center bg-red-100 p-6 rounded-lg max-w-md mx-auto">
                    <p className="font-bold text-red-600 text-lg">¡Error!</p>
                    <p className="text-red-500 mt-2">{error}</p>
                    <button onClick={handleReset} className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
                        Intentar de Nuevo
                    </button>
                </div>
            ) : workoutPlan ? (
                <div className="bg-gray-900 text-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg animate-fade-in">
                    <WorkoutDisplay plan={workoutPlan} onReset={handleReset} />
                </div>
            ) : (
                 <>
                    <div className="text-center mb-8 md:mb-12">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Generador de Rutinas con IA</h1>
                        <p className="mt-2 text-lg text-slate-600 max-w-2xl mx-auto">
                            Cuéntanos sobre ti y nuestro Entrenador con IA creará un plan de entrenamiento hiper-personalizado en segundos.
                        </p>
                    </div>
                    <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-slate-200 max-w-3xl mx-auto">
                        <OnboardingForm onSubmit={handleFormSubmit} />
                    </div>
                </>
            )}
        </div>
    );
};

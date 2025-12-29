
import React, { useState } from 'react';
import { type WorkoutPlan, type DailyWorkout } from '../types';
import { ExerciseRow } from './ExerciseRow';

interface WorkoutDisplayProps {
  plan: WorkoutPlan;
  onReset: () => void;
}

const DailyWorkoutCard: React.FC<{ dailyWorkout: DailyWorkout, index: number }> = ({ dailyWorkout, index }) => {
  const [isOpen, setIsOpen] = useState(index === 0);

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex justify-between items-center bg-gray-700/50 hover:bg-gray-700 transition-colors duration-200"
      >
        <div className="text-left">
          <h3 className="text-lg sm:text-xl font-bold text-brand-secondary">{dailyWorkout.day}</h3>
          <p className="text-sm text-gray-300">{dailyWorkout.focus}</p>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-brand-accent transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`transition-all duration-500 ease-in-out grid ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="p-4 md:p-6 space-y-6">
            <div>
              <h4 className="font-semibold text-brand-accent mb-2">Calentamiento</h4>
              <p className="text-gray-300 text-sm">{dailyWorkout.warmUp}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-brand-accent mb-2 border-b border-brand-accent/20 pb-1">Rutina Principal</h4>
              <div className="hidden sm:grid grid-cols-4 gap-2 items-center text-left px-4 py-2">
                  <div className="col-span-2">
                      <p className="text-sm font-semibold text-gray-400">Ejercicio</p>
                  </div>
                  <div className="text-center">
                      <p className="text-sm font-semibold text-gray-400">Series</p>
                  </div>
                  <div className="text-center">
                      <p className="text-sm font-semibold text-gray-400">Reps</p>
                  </div>
              </div>
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                {dailyWorkout.exercises.map((exercise, i) => (
                  <ExerciseRow key={i} exercise={exercise} />
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-brand-accent mb-2">Enfriamiento</h4>
              <p className="text-gray-300 text-sm">{dailyWorkout.coolDown}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export const WorkoutDisplay: React.FC<WorkoutDisplayProps> = ({ plan, onReset }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary">Tu Plan de Entrenamiento Personalizado</h2>
        <p className="mt-2 text-gray-300">Aquí está el plan semanal creado por tu Entrenador con IA. ¡Empecemos!</p>
      </div>

      <div className="space-y-4">
        {plan.weeklyPlan.map((dailyWorkout, index) => (
          <DailyWorkoutCard key={index} dailyWorkout={dailyWorkout} index={index} />
        ))}
      </div>

      <div className="text-center mt-10">
        <button
          onClick={onReset}
          className="bg-brand-accent text-brand-dark font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition-colors duration-300 text-lg"
        >
          Crear un Nuevo Plan
        </button>
      </div>
    </div>
  );
};

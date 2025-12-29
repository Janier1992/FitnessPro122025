import React, { useState, useEffect } from 'react';
import { ExerciseCard } from '../components/ExerciseCard';
import { ExerciseModal } from '../components/ExerciseModal';
import { type LibraryExercise } from '../types';
import { supabaseService } from '../services/supabaseService';
import { EXERCISE_TAGS, EXERCISE_DIFFICULTIES } from '../constants';

export const ExerciseLibrary: React.FC = () => {
    const [selectedExercise, setSelectedExercise] = useState<LibraryExercise | null>(null);
    const [exercises, setExercises] = useState<LibraryExercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string | 'Todas'>('Todas');

    useEffect(() => {
        const loadExercises = async () => {
            try {
                // Use 'any' cast if supabaseService returns any[] or doesn't exactly match LibraryExercise yet
                const data = await supabaseService.getExercises();
                // Safe cast or mapping if needed. For now assuming supabaseService returns compatible data
                setExercises(data as unknown as LibraryExercise[]);
            } catch (error) {
                console.error('Error loading exercises:', error);
            }
            setLoading(false);
        };
        loadExercises();
    }, []);

    const categories = ['Todos', ...EXERCISE_TAGS];

    const filteredExercises = exercises.filter(exercise => {
        const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (exercise.tags && exercise.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
        const matchesCategory = selectedCategory === 'Todos' || (exercise.tags && exercise.tags.includes(selectedCategory));
        const matchesDifficulty = selectedDifficulty === 'Todas' || exercise.difficulty === selectedDifficulty;

        return matchesSearch && matchesCategory && matchesDifficulty;
    });

    return (
        <div className="container mx-auto px-4 py-8 md:py-10 animate-fade-in">
            {/* Header y Filtros - Mantenemos el estilo original pero apuntando a estado local */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <p className="text-brand-primary font-bold uppercase tracking-wider text-sm mb-1">Tu enciclopedia fitness</p>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Biblioteca de Ejercicios</h1>
                </div>

                <div className="w-full md:w-auto relative">
                    <input
                        type="text"
                        placeholder="Buscar ejercicio..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-64 pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Tags de Categorias */}
            <div className="flex overflow-x-auto pb-4 gap-2 mb-6 scrollbar-hide">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === category ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Filtro Dificultad */}
            <div className="flex gap-4 mb-8">
                <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-2 px-4 rounded-lg text-sm font-medium outline-none focus:border-brand-primary"
                >
                    <option value="Todas">Todas las dificultades</option>
                    {EXERCISE_DIFFICULTIES.map(diff => (
                        <option key={diff} value={diff}>{diff}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredExercises.map(exercise => (
                        <ExerciseCard
                            key={exercise.id}
                            exercise={exercise}
                            onClick={() => setSelectedExercise(exercise)}
                        />
                    ))}
                </div>
            )}

            {filteredExercises.length === 0 && !loading && (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold text-slate-700 dark:text-white">No se encontraron ejercicios</h3>
                    <p className="text-slate-500">Intenta ajustar los filtros de búsqueda.</p>
                    <button
                        onClick={() => { setSearchTerm(''); setSelectedCategory('Todos'); setSelectedDifficulty('Todas'); }}
                        className="mt-4 text-brand-primary font-bold hover:underline"
                    >
                        Limpiar filtros
                    </button>
                </div>
            )}

            {selectedExercise && (
                <ExerciseModal
                    exercise={selectedExercise}
                    onClose={() => setSelectedExercise(null)}
                />
            )}
        </div>
    );
};

import { supabase } from '../lib/supabase';
import { GroupClass, CoachService } from '../types';

// Mappers to convert Spanish DB columns to English Frontend types

const mapClassFromDB = (data: any): GroupClass => ({
    id: data.id,
    name: data.nombre,
    description: data.descripcion,
    imageUrl: data.imagen_url,
    videoUrl: data.video_url,
    difficulty: data.dificultad,
    category: data.categoria,
    coach: data.nombre_entrenador,
    capacity: data.capacidad,
    duration: data.duracion,
    price: data.precio,
    locationType: data.tipo_ubicacion,
    // We need to fetch schedules separately or join them, for now assuming basic mapping
    schedule: [],
    // Map other fields as needed
});

const mapServiceFromDB = (data: any): CoachService => ({
    id: data.id,
    serviceName: data.nombre_servicio,
    description: data.descripcion,
    imageUrl: data.imagen_url,
    videoUrl: data.video_url,
    coach: data.nombre_entrenador,
    duration: data.duracion,
    price: data.precio,
    locationType: data.tipo_ubicacion,
    availability: [] // availability needs separate fetch
});

export const supabaseService = {

    // --- Classes ---
    getClasses: async (): Promise<GroupClass[]> => {
        const { data: classesData, error } = await supabase
            .from('clases_disponibles')
            .select(`
        *,
        horarios_clases (
          dia_semana,
          hora_dia
        )
      `);

        if (error) {
            console.error('Error fetching classes:', error);
            throw error;
        }

        return classesData.map((c: any) => ({
            ...mapClassFromDB(c),
            schedule: c.horarios_clases.map((h: any) => ({
                day: h.dia_semana,
                time: h.hora_dia
            }))
        }));
    },

    // --- Services ---
    getCoachServices: async (): Promise<CoachService[]> => {
        const { data: servicesData, error } = await supabase
            .from('servicios_entrenador')
            .select(`
        *,
        disponibilidad_servicios (
          dia_semana,
          hora_inicio
        )
      `);

        if (error) {
            console.error('Error fetching services:', error);
            throw error;
        }

        return servicesData.map((s: any) => ({
            ...mapServiceFromDB(s),
            availability: s.disponibilidad_servicios.map((d: any) => ({
                day: d.dia_semana,
                hours: [d.hora_inicio] // Simplified mapping
            }))
        }));
    },

    // --- Exercises ---
    getExercises: async (): Promise<any[]> => { // Using any for now or specific type
        const { data, error } = await supabase
            .from('ejercicios_biblioteca')
            .select('*');

        if (error) throw error;

        return data.map((e: any) => ({
            id: e.id,
            name: e.nombre,
            description: e.descripcion,
            imageUrl: e.imagen_url,
            videoUrl: e.video_url,
            difficulty: e.dificultad,
            tags: e.categoria ? [e.categoria] : [], // Simplified
            equipment: e.equipamiento,
            instructions: e.instrucciones || []
        }));
    }
};

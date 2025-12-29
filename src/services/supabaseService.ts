
import { supabase } from '../lib/supabase';
import { GroupClass, CoachService } from '../types';

// Mappers para convertir columnas de DB (Español) a tipos del Frontend (Inglés)

/**
 * Mapea un objeto de clase de la base de datos al tipo GroupClass.
 * @param data - Datos crudos de la BD.
 */
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
    // Se necesita unir horarios por separado
    schedule: [],
});

/**
 * Mapea un servicio de entrenador de la BD al tipo CoachService.
 * @param data - Datos crudos de la BD.
 */
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
    availability: []
});

/**
 * Servicio para interactuar con la base de datos Supabase.
 * Gestiona la obtención y mapeo de Clases, Servicios de Entrenador y Ejercicios.
 */
export const supabaseService = {

    // --- Clases ---
    /**
     * Obtiene todas las clases grupales disponibles.
     * Realiza un join con 'horarios_clases' para obtener detalles del cronograma.
     * @returns {Promise<GroupClass[]>} Array de objetos GroupClass.
     */
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

    // --- Servicios ---
    /**
     * Obtiene todos los servicios de entrenadores.
     * Realiza un join con 'disponibilidad_servicios'.
     * @returns {Promise<CoachService[]>} Array de servicios.
     */
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
                hours: [d.hora_inicio] // Mapping simplificado
            }))
        }));
    },

    // --- Usuarios ---
    /**
     * Verifica la sesión activa con el backend.
     */
    verifySession: async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) return null;
        return user;
    },

    /**
     * Obtiene el perfil de usuario por ID.
     * @param {string} userId - ID de autenticación del usuario.
     * @returns {Promise<any>} Objeto del perfil o null si hay error.
     */
    getUserProfile: async (userId: string): Promise<any> => {
        const { data, error } = await supabase
            .from('perfiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }
        return data;
    },

    // --- Ejercicios ---
    /**
     * Obtiene la biblioteca de ejercicios.
     * @returns {Promise<any[]>} Array de ejercicios.
     */
    getExercises: async (): Promise<any[]> => {
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
            tags: e.categoria ? [e.categoria] : [],
            equipment: e.equipamiento,
            instructions: e.instrucciones || []
        }));
    }
};

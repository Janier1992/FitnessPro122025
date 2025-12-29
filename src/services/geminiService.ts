
import { GoogleGenAI, Type } from "@google/genai";
import { type UserProfile, type WorkoutPlan, type DailyCheckin, type AIInsight } from '../types';

// FIX: Safely initialize the AI client. We wrap this in a try-catch to prevents
// the app from crashing on import if the environment variable is missing or malformed.
let ai: GoogleGenAI | null = null;
try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey && typeof apiKey === 'string' && apiKey.length > 0) {
        ai = new GoogleGenAI({ apiKey });
    }
} catch (e) {
    console.warn("Gemini API client could not be initialized:", e);
}

const workoutPlanSchema = {
    type: Type.OBJECT,
    properties: {
        weeklyPlan: {
            type: Type.ARRAY,
            description: "Un arreglo de sesiones de entrenamiento diarias para la semana.",
            items: {
                type: Type.OBJECT,
                required: ["day", "focus", "warmUp", "exercises", "coolDown"],
                properties: {
                    day: { type: Type.STRING, description: "Día de la semana o número de sesión (ej: 'Lunes', 'Día 1')." },
                    focus: { type: Type.STRING, description: "El enfoque principal del entrenamiento (ej: 'Fuerza de Cuerpo Completo', 'Día de Pierna')." },
                    warmUp: { type: Type.STRING, description: "Una rutina de calentamiento breve y detallada para la sesión." },
                    exercises: {
                        type: Type.ARRAY,
                        description: "Una lista de ejercicios para la sesión de entrenamiento.",
                        items: {
                            type: Type.OBJECT,
                            required: ["name", "sets", "reps", "rest", "description", "imageSearchQuery"],
                            properties: {
                                name: { type: Type.STRING, description: "Nombre del ejercicio." },
                                sets: { type: Type.INTEGER, description: "Número de series." },
                                reps: { type: Type.STRING, description: "Rango de repeticiones (ej: '8-12', '15')." },
                                rest: { type: Type.INTEGER, description: "Tiempo de descanso en segundos entre series." },
                                description: { type: Type.STRING, description: "Descripción concisa (2-3 puntos clave) sobre la forma correcta del ejercicio." },
                                imageSearchQuery: { type: Type.STRING, description: "Un término de búsqueda simple en inglés para encontrar una demostración visual (ej: 'barbell back squat')." }
                            }
                        }
                    },
                    coolDown: { type: Type.STRING, description: "Una rutina de enfriamiento y estiramiento breve y detallada." }
                }
            }
        }
    }
};

const insightSchema = {
    type: Type.OBJECT,
    properties: {
        type: { type: Type.STRING, enum: ['recovery', 'performance', 'caution', 'motivation'] },
        title: { type: Type.STRING },
        message: { type: Type.STRING },
        actionLabel: { type: Type.STRING },
        suggestedActivity: { type: Type.STRING }
    }
};


const generatePrompt = (profile: UserProfile, dailyStatus?: DailyCheckin): string => {
    const goalMap = {
        build_muscle: 'ganar músculo y aumentar la fuerza (hipertrofia)',
        lose_fat: 'perder grasa y mejorar la salud cardiovascular (pérdida de peso)',
        improve_endurance: 'mejorar la resistencia muscular y cardiovascular',
        general_fitness: 'mantener un estado físico general y bienestar'
    };

    const levelMap = {
        beginner: 'un principiante con poca o ninguna experiencia',
        intermediate: 'un intermedio con experiencia de entrenamiento consistente',
        advanced: 'un atleta avanzado con experiencia de entrenamiento significativa'
    };

    let contextAdaptation = "";
    if (dailyStatus) {
        contextAdaptation = `
      CRITICAL REAL-TIME ADAPTATION REQUIRED:
      User's Daily Status:
      - Energy: ${dailyStatus.energyLevel}/10
      - Sleep: ${dailyStatus.sleepQuality}
      - Soreness: ${dailyStatus.soreness}
      - Mood: ${dailyStatus.mood}

      INSTRUCTIONS FOR ADAPTATION:
      1. If Energy < 4 or Sleep is 'poor' or Soreness is 'high': REDUCE INTENSITY immediately. Switch to Active Recovery, Mobility, or very light isolation work. NO compound lifts near 1RM.
      2. If Soreness is 'high': Avoid working the sore muscle groups. Focus on other areas or flexibility.
      3. If Mood is 'stressed': Suggest rhythmic cardio or therapeutic yoga to lower cortisol.
      4. If Energy > 8 and Sleep 'good': Suggest a Challenge Day or Progressive Overload focus.
      `;
    }

    const profileDetails = [
        `- Main Goal: ${goalMap[profile.goal]}`,
        `- Experience Level: ${levelMap[profile.level]}`,
        `- Training Frequency: ${profile.daysPerWeek} days per week.`,
        `- Available Equipment: ${profile.equipment.join(', ') || 'None (Bodyweight only)'}.`,
        profile.restPreference ? `- Desired Recovery Time Between Sets: ${profile.restPreference}.` : null,
        profile.exercisesToAvoid ? `- Specific Exercises to AVOID: ${profile.exercisesToAvoid}.` : null,
        `- Special Considerations/Notes: ${profile.notes || 'None'}.`
    ].filter(Boolean).join('\n    ');

    const advancedInstructions = [
        profile.restPreference ? `Consider the user's preference for '${profile.restPreference}' recovery when defining rest times.` : null,
        profile.exercisesToAvoid ? `It is CRITICAL to avoid the following exercises and their direct variations: ${profile.exercisesToAvoid}.` : null
    ].filter(Boolean).join(' ');


    return `
    You are FitnessFlow Pro's AI-Coach, an expert personal trainer and exercise physiologist from Medellín, Colombia. 
    Create a detailed, hyper-personalized weekly workout plan for a user.
    
    ${contextAdaptation}

    User Profile:
    ${profileDetails}

    Instructions:
    1.  Design a ${profile.daysPerWeek}-day workout split that is optimal for the user's goal and experience level.
    2.  For each training day, provide a clear focus (e.g., 'Upper Body Push', 'Legs & Core').
    3.  Each session must include a specific warm-up routine and a cool-down routine.
    4.  Select exercises that are appropriate for the user's experience level and available equipment. ${advancedInstructions}
    5.  For each exercise, specify the number of sets, a suitable repetition range, and the rest period in seconds.
    6.  For EACH exercise, you MUST provide:
        a. A 'description' with 2-3 key pointers on proper form.
        b. An 'imageSearchQuery' which is a simple, effective ENGLISH search term to find a visual demonstration (e.g., 'barbell back squat', 'dumbbell bicep curl', 'bodyweight push up').
    7.  Ensure the plan is well-balanced and promotes recovery.
    8.  The entire output, including day names, focus, exercise names, and descriptions MUST be in Spanish. The 'imageSearchQuery' must be in English.
    9.  Respond ONLY with the JSON object that adheres to the provided schema. Do not add any introductory text, greetings, or markdown formatting around the JSON.
    `;
};


export const generateWorkoutPlan = async (profile: UserProfile, dailyStatus?: DailyCheckin): Promise<WorkoutPlan> => {
    if (!ai) {
        throw new Error("API Key no configurada. Por favor revisa la configuración de tu entorno.");
    }
    const prompt = generatePrompt(profile, dailyStatus);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: workoutPlanSchema,
                temperature: 0.7,
            },
        });

        const jsonString = response.text;
        const parsedPlan = JSON.parse(jsonString) as WorkoutPlan;

        if (!parsedPlan.weeklyPlan || !Array.isArray(parsedPlan.weeklyPlan)) {
            throw new Error("Formato de respuesta de la IA inválido: weeklyPlan falta o no es un arreglo.");
        }

        return parsedPlan;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("No se pudo generar el plan de entrenamiento desde el servicio de IA.");
    }
};

export const generateContextualInsight = async (status: DailyCheckin, userName: string): Promise<AIInsight> => {
    if (!ai) {
        // Fallback local logic if offline
        if (status.energyLevel < 4 || status.soreness === 'high') {
            return {
                type: 'recovery',
                title: 'Recuperación Prioritaria',
                message: 'Tus niveles indican fatiga. Hoy es mejor moverse suave para recuperar.',
                actionLabel: 'Ver Rutina de Movilidad',
                suggestedActivity: 'Yoga o Caminata'
            };
        }
        return {
            type: 'performance',
            title: '¡Listo para entrenar!',
            message: 'Todo se ve bien. Mantén la constancia.',
            actionLabel: 'Ir a la Rutina',
            suggestedActivity: 'Entrenamiento Programado'
        };
    }

    const prompt = `
        Analiza el estado diario de este usuario:
        - Nombre: ${userName}
        - Energía: ${status.energyLevel}/10
        - Sueño: ${status.sleepQuality}
        - Dolor Muscular: ${status.soreness}
        - Ánimo: ${status.mood}

        Actúa como un Guía de Fitness Inteligente y Empático. Genera un "Insight" corto y accionable.
        Reglas:
        1. Si hay dolor alto o sueño pobre, prioriza la seguridad (type: 'caution' o 'recovery').
        2. Si la energía es alta, motiva (type: 'performance').
        3. Si el ánimo es bajo, sé empático (type: 'motivation').
        4. Sé conciso (máx 2 frases en el mensaje).
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: insightSchema,
                temperature: 0.8,
            }
        });

        return JSON.parse(response.text) as AIInsight;
    } catch (error) {
        console.error("Error getting AI insight:", error);
        return {
            type: 'motivation',
            title: `Vamos ${userName}`,
            message: 'Escucha a tu cuerpo y da lo mejor de ti hoy.',
            actionLabel: 'Entrenar',
        };
    }
};

export const getAICoachResponse = async (prompt: string): Promise<{ text: string; sources: { uri: string; title: string; }[] }> => {
    if (!ai) {
        return {
            text: "Lo siento, la clave API no está configurada correctamente. No puedo conectar con el servidor.",
            sources: []
        };
    }

    const systemInstruction = `
        Eres el AI Coach de FitnessFlow Pro, un entrenador personal y nutricionista experto de Medellín, Colombia.
        Tu objetivo es proporcionar consejos claros, seguros, motivadores y altamente personalizados.
        - Responde siempre en español.
        - Sé amigable y alentador. Usa emojis para hacer la conversación más cercana.
        - Basa tus respuestas en principios de ciencia del ejercicio y nutrición.
        - Si te piden una rutina, da un ejemplo conciso.
        - Si te piden consejos de nutrición, ofrece sugerencias prácticas y saludables.
        - Mantén las respuestas relativamente cortas y fáciles de leer. Usa listas o viñetas si es necesario.
        - No des consejos médicos. Si la pregunta es sobre una lesión o condición médica, recomienda consultar a un médico o fisioterapeuta.
        - For questions about recent events, news, or up-to-date information, use the search tool.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.8,
                tools: [{ googleSearch: {} }],
            }
        });

        const text = response.text;
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

        let sources: { uri: string; title: string; }[] = [];
        if (groundingChunks) {
            sources = groundingChunks
                .filter(chunk => chunk.web)
                .map(chunk => ({
                    uri: chunk.web.uri,
                    title: chunk.web.title,
                }));
        }

        return { text, sources };

    } catch (error) {
        console.error("Error calling Gemini API for AI Coach:", error);
        return {
            text: "Lo siento, parece que estoy teniendo problemas para conectarme en este momento. Por favor, inténtalo de nuevo más tarde.",
            sources: []
        };
    }
};

export const findGymsWithGemini = async (prompt: string, location: { latitude: number; longitude: number }): Promise<{ text: string; sources: { uri: string; title: string; }[] }> => {
    if (!ai) {
        return {
            text: "Lo siento, la clave API no está configurada. No puedo realizar la búsqueda.",
            sources: []
        };
    }

    // Prompt optimizado para usar la herramienta de Google Maps
    const systemInstruction = `
        Eres un experto localizador de fitness en Medellín.
        El usuario te dará una consulta y su ubicación exacta (lat/lng).
        Debes usar la herramienta 'googleMaps' para encontrar los MEJORES y más relevantes gimnasios o lugares de entrenamiento cercanos.
        
        IMPORTANTE:
        1. Usa la ubicación del usuario para buscar.
        2. Devuelve una respuesta amigable que resuma las opciones.
        3. Asegúrate de que los resultados de mapas (groundingChunks) sean precisos.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction,
                tools: [{ googleMaps: {} }],
                toolConfig: {
                    retrievalConfig: {
                        latLng: location, // Pasar la ubicación directamente
                    }
                }
            },
        });

        const text = response.text;
        // Extract Google Maps grounding chunks correctly
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

        let sources: { uri: string; title: string; }[] = [];
        if (groundingChunks) {
            // Filter for map chunks specifically
            sources = groundingChunks
                .filter(chunk => chunk.maps)
                .map(chunk => ({
                    uri: chunk.maps.googleMapsUri || chunk.maps.uri || '', // Handle different possible URI fields
                    title: chunk.maps.title || 'Ubicación en mapa',
                }))
                .filter(source => source.uri !== ''); // Ensure we have a valid link
        }

        return { text, sources };
    } catch (error) {
        console.error("Error calling Gemini API for Maps Grounding:", error);
        return {
            text: "Lo siento, tuve un problema al buscar gimnasios en el mapa. Verifica tu conexión o permisos de ubicación.",
            sources: []
        };
    }
};

export const getDailyWellnessTip = async (): Promise<string> => {
    // Robust fallback messages
    const fallbackTips = [
        "Recuerda mantenerte hidratado durante todo el día para optimizar tu rendimiento.",
        "Un pequeño snack saludable puede darte la energía que necesitas para tu tarde.",
        "El descanso es tan importante como el entrenamiento. ¡Duerme bien hoy!",
        "La consistencia es la clave. Sigue adelante, paso a paso."
    ];
    const randomFallback = fallbackTips[Math.floor(Math.random() * fallbackTips.length)];

    if (!ai) {
        return randomFallback;
    }

    const prompt = `
      Eres un coach de bienestar y fitness. Tu tarea es generar un consejo diario, corto (1-2 frases), motivador y práctico en español.
      El consejo debe ser sobre fitness, nutrición, mentalidad positiva o recuperación.
      Debe ser fácil de entender y aplicar para cualquier persona.
      Responde únicamente con el consejo, sin saludos ni texto adicional.
      Ejemplo: "Un pequeño snack saludable, como un puñado de almendras, puede darte la energía que necesitas para tu tarde."

      Genera un consejo de bienestar para hoy.
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                // Lower temperature slightly for more consistent, high-quality tips.
                temperature: 0.9,
            }
        });

        if (response && response.text) {
            return response.text;
        }
        return randomFallback;

    } catch (error) {
        console.warn("Non-critical error fetching Wellness Tip from AI:", error);
        return randomFallback;
    }
}

/**
 * Generates a short fitness video preview using the Veo model.
 * Note: This can take a few minutes. In a real production app, this would be a background job.
 * 
 * @param promptDescription - Text description of the exercise or class environment.
 */
export const generateFitnessVideoPreview = async (promptDescription: string): Promise<string | null> => {
    if (!ai) {
        console.warn("AI not initialized for video generation");
        return null;
    }

    try {
        // 1. Start the video generation operation
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: `Cinematic fitness video, high quality, motivational lighting. ${promptDescription}`,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '16:9'
            }
        });

        // 2. Poll for completion
        // Note: We add a timeout safeguard in a real app to prevent infinite loops
        let attempts = 0;
        while (!operation.done && attempts < 20) {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s
            operation = await ai.operations.getVideosOperation({ operation: operation });
            attempts++;
        }

        if (operation.done && operation.response?.generatedVideos?.[0]?.video?.uri) {
            const downloadLink = operation.response.generatedVideos[0].video.uri;
            // Important: The URI requires the API key appended to fetch the bytes
            return `${downloadLink}&key=${import.meta.env.VITE_GEMINI_API_KEY}`;
        }

        return null;

    } catch (error) {
        console.error("Error generating fitness video:", error);
        return null;
    }
};

/**
 * Analyzes a video for key fitness information using Gemini 3 Pro.
 * This can be used to check form or identify exercises.
 * 
 * @param videoData - Base64 encoded video or URI.
 * @param prompt - The specific question to ask about the video.
 */
export const analyzeVideoContent = async (videoBase64: string, prompt: string): Promise<string> => {
    if (!ai) return "Servicio de IA no disponible.";

    try {
        // Using Gemini 3 Pro for video understanding capabilities
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: 'video/mp4',
                            data: videoBase64
                        }
                    },
                    { text: prompt }
                ]
            }
        });

        return response.text || "No se pudo analizar el video.";
    } catch (error) {
        console.error("Error analyzing video:", error);
        return "Hubo un error al procesar el video.";
    }
};

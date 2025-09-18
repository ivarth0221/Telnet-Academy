import { GoogleGenAI, Type } from "@google/genai";
import type { Course, Flashcard, Lesson, TutorMessage, FinalProjectEvaluation, CertificateData, RemedialLesson, QuizQuestion, MindMapNode, InterviewStep, GuidedLessonStep, ClarifyingQuestionWithOptions, Progress, NetworkTopology, ForumPost } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const TELNET_CO_CONTEXT = `
TELNET CO es un Proveedor de Servicios de Internet (ISP) con una estructura organizacional y un ecosistema de herramientas muy específico. La formación DEBE reflejar fielmente este entorno.

**Ecosistema de Herramientas Clave:**
- **Atención, Soporte y Gestión de Clientes (Nivel 1 y Facturación):** Splynx (sistema integral de gestión de ISP). Se utiliza para identificar clientes, gestionar sus servicios, facturación y pagos. Sus módulos de Tareas (Tasks) y Tickets son el sistema oficial para registrar y dar seguimiento a todas las solicitudes de soporte.
- **Gestión y Operaciones de Red (Todos los Niveles Técnicos):** OLT Cloud. Esta es la plataforma central para TODA la gestión de la red GPON. Sus funciones son:
    - **Dashboard Visual:** Ofrece una vista en tiempo real del estado de la red, incluyendo: Total de ONUs, ONUs Online, Sin Energía, con Pérdida de Señal (LOSS) e Inactivas.
    - **Monitoreo de Señal:** Presenta gráficos de torta (pie charts) que clasifican las ONUs por su nivel de señal (Crítico, Malo, Bueno), permitiendo una identificación rápida de problemas.
    - **Diagnóstico Remoto:** Permite consultar el estado detallado de cualquier ONU, su señal, uptime y razón de la última desconexión.
    - **Inventario de Red Pasiva:** Contiene un inventario detallado de la red, incluyendo la ubicación y coordenadas de las Cajas NAP y de los clientes.
    - **Provisión y Gestión:** Desde OLT Cloud se autorizan nuevas ONUs y se administran los perfiles de velocidad de los clientes.
- **Base de Conocimiento Interna:** La propia TELNET ACADEMY contiene una sección de "Base de Conocimiento" con guías detalladas, procedimientos paso a paso y enlaces a la documentación oficial de herramientas como Splynx (https://wiki.splynx.com/). **¡Debes referir a los colaboradores a buscar artículos específicos aquí para profundizar!** Por ejemplo: "Puedes encontrar una guía detallada sobre cómo crear un ticket en la Base de Conocimiento, bajo la categoría 'Splynx'".
- **Configuración de Equipos:** Winbox (para la configuración avanzada de routers MikroTik en la red).
- **Herramientas de Campo (Técnicos):** Power Meter (medición de señal óptica RX), herramientas de fibra (cortadora, peladora). OLT Cloud y Splynx son accesibles desde dispositivos móviles para gestión en campo.
- **Comunicación Interna:** Zoho Clip, Correo Electrónico Corporativo.

**Perfiles de Cargo y Responsabilidades Fundamentales:**

1.  **Agente de Atención al Cliente / Soporte Nivel 1:**
    *   **Propósito:** Primer punto de contacto. Resolver problemas sencillos, registrar casos con precisión y escalar adecuadamente.
    *   **Tareas Clave:** Identificar cliente y sus servicios en Splynx. Crear y documentar un Ticket o Tarea en Splynx con todos los detalles del caso. Realizar diagnóstico básico (luces de ONT, reinicio de equipos). Escalar casos al NOC (Nivel 2) a través de Splynx si el diagnóstico básico no resuelve.
    *   **NO HACE:** Acceder a OLT Cloud. Realizar diagnósticos avanzados. No utiliza Winbox.

2.  **Auxiliar NOC – ISP y Redes (Soporte Nivel 2):**
    *   **Propósito:** Principal punto de escalación técnica. Diagnosticar y resolver problemas de forma remota.
    *   **Tareas Clave:** Revisar tickets escalados en Splynx. Usar OLT Cloud para un diagnóstico completo: verificar estado de ONT (Online/Offline), interpretar niveles de señal (Rx Power), revisar dashboards de salud de la red y ocupación de PONs. Usar **Winbox** para conectarse a los routers MikroTik de los clientes y de la red para diagnosticar problemas de conectividad, DHCP y NAT. Aprovisionar y configurar ONUs y perfiles de velocidad usando OLT Cloud. Brindar soporte y guía a los agentes de Nivel 1.
    *   **NO HACE:** Realizar instalaciones físicas en campo.

3.  **Técnico Instalador FTTH y Redes GPON:**
    *   **Propósito:** Ejecutar instalaciones y mantenimientos en campo. Ser la cara técnica de la empresa.
    *   **Tareas Clave:** Gestionar sus asignaciones a través de Tareas en Splynx. Realizar instalaciones (tendido, conectorización). Usar Power Meter para garantizar niveles de señal óptimos. Coordinar con el NOC para la autorización de la ONT en OLT Cloud. Configurar router Wi-Fi básico. Documentar la orden de servicio en Splynx con fotos y mediciones.

4.  **Ingeniero de Red / Nivel 3:**
    *   **Propósito:** Máximo experto técnico. Diseñar, optimizar y resolver los problemas más complejos de la red.
    *   **Tareas Clave:** Diseñar la arquitectura de red. Configuración avanzada de OLTs (a bajo nivel si es necesario), routers principales (MikroTik) y switches usando **Winbox** y CLI. Gestionar protocolos de enrutamiento (BGP, OSPF). Usar OLT Cloud para análisis de tendencias y problemas a gran escala. Proporcionar soporte experto al NOC.

**Flujo de Trabajo Típico para Problemas de Conexión:**
1.  Cliente reporta problema.
2.  Agente N1 atiende, identifica en Splynx, crea Ticket/Tarea, realiza diagnóstico básico.
3.  Si no se resuelve, el ticket en Splynx se escala al NOC N2.
4.  NOC N2 investiga usando OLT Cloud (dashboard, estado y señal de ONT). Verifica el estado administrativo del cliente en Splynx. Si la señal es correcta, el NOC N2 se conecta por **Winbox** al router MikroTik del cliente para revisar configuraciones de red (DHCP, NAT, Firewall).
5.  Si es un problema físico en la fibra (detectado por mala señal en OLT Cloud), el NOC N2 asigna una Tarea en Splynx a un Técnico Instalador para revisión en campo.
6.  Si es un problema complejo de la red central, el NOC N2 escala al Ingeniero de Red N3.
`;

// --- UTILITY TO GET COURSE CONTENT ---
const getFullCourseContent = (course: Course): string => `
    Course Title: ${course.title}
    Course Description: ${course.description}
    Modules:
    ${course.modules.map(m => `
        Module: ${m.moduleTitle}
        ${m.lessons.map(l => `Lesson: ${l.lessonTitle}\n${l.initialContent}`).join('\n\n')}
    `).join('\n---\n')}
`;

const lessonSchema = {
  type: Type.OBJECT,
  properties: {
    lessonTitle: {
        type: Type.STRING,
        description: "El título de la lección. Debe ser específico y orientado a la acción."
    },
    initialContent: {
      type: Type.STRING,
      description: "El primer fragmento de contenido para esta lección. Debe ser conciso, atractivo y terminar de forma natural. Utiliza formato markdown (negritas, listas), emojis relevantes (📡, 💡, ⚙️), y bloques de código con identificadores de lenguaje (ej: ```bash). Para conceptos visuales, envuélvelos en etiquetas [searchable] (ej: [searchable]conector SC/APC[/searchable]).",
    },
    initialOptions: {
      type: Type.ARRAY,
      description: "Un array de 2 a 3 opciones de seguimiento para el usuario. Deben ser acciones claras y concisas.",
      items: { type: Type.STRING }
    }
  },
  required: ["lessonTitle", "initialContent", "initialOptions"]
};

const courseSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "The main title of the course, focused on the skill or project." },
        description: { type: Type.STRING, description: "A brief, one-paragraph summary of what practical skill the user will acquire." },
        modules: {
            type: Type.ARRAY,
            description: "An array of course modules.",
            items: {
                type: Type.OBJECT,
                properties: {
                    moduleTitle: { type: Type.STRING, description: "The title of this module." },
                    learningObjectives: {
                        type: Type.ARRAY,
                        description: "A list of 2-3 measurable learning objectives for the module.",
                        items: { type: Type.STRING }
                    },
                    lessons: {
                        type: Type.ARRAY,
                        description: "An array of lessons within this module, each structured for Guided Exploration.",
                        items: lessonSchema
                    },
                    quiz: {
                        type: Type.ARRAY,
                        description: "An array of EXACTLY 5 multiple-choice questions for the module's quiz. The array MUST contain 5 items.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                question: { type: Type.STRING, description: "The quiz question." },
                                options: {
                                    type: Type.ARRAY,
                                    description: "An array of 4 potential answers.",
                                    items: { type: Type.STRING }
                                },
                                correctAnswer: { type: Type.STRING, description: "The correct answer, which must exactly match one of the options." }
                            },
                            required: ["question", "options", "correctAnswer"]
                        }
                    }
                },
                required: ["moduleTitle", "lessons", "quiz"]
            }
        },
        finalProject: {
            type: Type.OBJECT,
            description: "A final, hands-on project for the student to build, synthesizing all learned skills.",
            properties: {
                title: { type: Type.STRING, description: "The title of the final project." },
                description: { type: Type.STRING, description: "A detailed description of the final project, including requirements, steps, and deliverables." },
                evaluationCriteria: {
                    type: Type.ARRAY,
                    description: "A list of 3-4 clear and measurable evaluation criteria for the project. These should be specific to the task.",
                    items: { type: Type.STRING }
                }
            },
            required: ["title", "description", "evaluationCriteria"]
        }
    },
    required: ["title", "description", "modules", "finalProject"]
};

export interface CourseCreationPayload {
    initialTopic: string;
    context: string;
    depth: 'Básico' | 'Intermedio' | 'Avanzado';
    role: string;
    tone: string;
    focus: string;
}

export async function generateClarifyingQuestions(payload: { topic: string, role: string, depth: string, tone: string, focus: string }): Promise<ClarifyingQuestionWithOptions[]> {
    const { topic, role, depth, tone, focus } = payload;
    const prompt = `
    Eres un experto diseñador instruccional para TELNET CO. Un administrador está creando una Ruta Maestra con las siguientes características:
    - **Tema:** "${topic}"
    - **Rol Destinatario:** "${role}"
    - **Profundidad:** "${depth}"
    - **Tono:** "${tone}"
    - **Enfoque:** "${focus}"

    Para refinar el contenido, genera 3 preguntas de opción múltiple. Las respuestas del administrador ayudarán a definir con precisión el nivel de conocimiento previo de los colaboradores y los objetivos clave que debe cubrir la ruta. El objetivo es que el administrador elija una opción, no que escriba texto libre. Devuelve el resultado en formato JSON.
    `;
    
    const questionsSchema = {
        type: Type.OBJECT,
        properties: {
            questions: {
                type: Type.ARRAY,
                description: "Un array de 3 preguntas de clarificación, cada una con un texto y un array de opciones.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING, description: "El texto de la pregunta de opción múltiple." },
                        options: {
                            type: Type.ARRAY,
                            description: "Un array de 3 a 4 strings que son las opciones de respuesta.",
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["question", "options"]
                }
            }
        },
        required: ["questions"]
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: questionsSchema,
            },
        });

        const result = JSON.parse(response.text.trim());
        if (result.questions && Array.isArray(result.questions)) {
            return result.questions;
        }
        throw new Error("La respuesta de la API no contiene un array de preguntas válido.");
    } catch (error) {
        console.error("Error generating clarifying questions:", error);
        throw new Error("No se pudieron generar las preguntas de clarificación. Inténtalo de nuevo.");
    }
}

export async function generateCourse({ initialTopic, context, depth, role, tone, focus }: CourseCreationPayload): Promise<Course> {
    const prompt = `
    Actúa como un diseñador instruccional senior y experto en tecnología de TELNET ACADEMY. Eres el responsable de crear los planes de desarrollo profesional para los colaboradores de TELNET CO, un ISP.

    **CONTEXTO INTERNO DE LA EMPRESA (TELNET CO) - ¡MUY IMPORTANTE!**
    ---
    ${TELNET_CO_CONTEXT}
    ---

    **MISIÓN:**
    Un administrador de TELNET ACADEMY ha solicitado una **Ruta Maestra** sobre "${initialTopic}". Tu misión es diseñar una plantilla de ruta de aprendizaje online que sea **extremadamente relevante, práctica y adaptada al rol (o roles) para el que está diseñada** dentro de la empresa.

    **PERFIL DEL PÚBLICO OBJETIVO:**
    - **Rol(es) a los que se dirige:** ${role}
    - **Nivel de Profundidad Solicitado:** ${depth}
    - **Estilo y Tono de Comunicación Deseado:** ${tone}
    - **Enfoque Práctico Principal:** ${focus}
    - **Contexto adicional del Administrador (basado en sus respuestas a preguntas):**
      ---
      ${context}
      ---

    **INSTRUCCIONES CLAVE DE DISEÑO:**
    1.  **ADAPTACIÓN AL ROL (CRÍTICO):** El contenido, los ejemplos y la complejidad DEBEN estar directamente alineados con el rol del colaborador.
        *   **Si el rol es 'Todos los cargos'**: El contenido debe ser fundamental y aplicable de manera general a cualquier persona en la empresa. Evita jerga o herramientas extremadamente específicas de un solo departamento. Enfócate en habilidades transversales o introducciones a tecnologías clave de la empresa que todos deberían conocer.
        *   **Si el rol es específico (ej. Agente de Soporte Nivel 1, etc.)**: Sigue las guías de adaptación para ese rol.
        *   **Agente de Soporte Nivel 1:** Enfócate en diagnóstico básico, uso de Splynx y cuándo escalar.
        *   **Auxiliar NOC (Soporte Nivel 2):** Profundiza en OLT Cloud, Splynx, Winbox y resolución de problemas de nivel medio.
        *   **Técnico Instalador FTTH:** Céntrate en mediciones con Power Meter, OLT Cloud, Splynx y procedimientos en campo.
        *   **Ingeniero de Red (Nivel 3):** Aborda temas de arquitectura de red, protocolos de enrutamiento y gestión de incidentes mayores.
    2.  **ENFOQUE DEL CONTENIDO:** Adapta el tipo de lecciones al ENFOQUE PRáctico principal. Si es "Resolución de Problemas", crea lecciones basadas en escenarios y casos de estudio. Si es "Dominio de Herramientas", crea guías paso a paso detalladas. Si es "Fundamentos Teóricos", enfócate en explicaciones claras de conceptos clave.
    3.  **TONO DE VOZ:** El lenguaje y los ejemplos deben ser consistentemente "${tone}".
    4.  **FORMATO ENRIQUECIDO:**
        *   Utiliza markdown (negritas, listas) y emojis relevantes (📡, 💡, ⚙️).
        *   Para comandos, scripts o configuraciones, usa bloques de código con identificador de lenguaje (ej: \`\`\`mikrotik).
        *   Para conceptos visuales (hardware, dashboards, conectores), envuélvelos en etiquetas [searchable]termino a buscar[/searchable].
    5.  **ESTRUCTURA DE LA RUTA:**
    1.  **Título y Descripción:** Claros, profesionales y orientados a la acción. El título DEBE incluir el nivel de profundidad (ej: "Diagnóstico GPON para NOC N2 (Intermedio)").
    2.  **Módulos (3-5):** Cada módulo debe tener:
        *   **lessons:** En formato "Exploración Guiada" con \`lessonTitle\`, \`initialContent\` y \`initialOptions\`.
        *   **quiz:** Un cuestionario con **OBLIGATORIAMENTE 5 PREGUNTAS** de opción múltiple.
    3.  **finalProject (OBLIGATORIO):** Un desafío práctico que simule una tarea real para el rol del colaborador.
        *   Debe incluir "evaluationCriteria" claros y medibles.
        *   **Importante:** Para roles prácticos como 'Técnico Instalador FTTH', el proyecto debe pedir una descripción Y, si es posible, solicitar explícitamente que el colaborador **adjunte una foto como evidencia** (ej: "describe tu proceso Y adjunta una foto de tu PON Power Meter mostrando una señal correcta."). Menciona esto en la descripción del proyecto.

    El resultado DEBE SER un objeto JSON válido que se adhiera estrictamente al esquema proporcionado. No incluyas texto fuera del JSON.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: courseSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedCourse: Course = JSON.parse(jsonText);
        
        if (!parsedCourse.title || !parsedCourse.modules || parsedCourse.modules.length === 0) {
            throw new Error("La estructura de la ruta de habilidad generada no es válida.");
        }
        
        return parsedCourse;

    } catch (error) {
        console.error("Error generating course:", error);
        throw new Error("No se pudo generar la ruta de habilidad. Es posible que el modelo haya devuelto una estructura no válida. Por favor, intenta con un tema diferente o vuelve a intentarlo.");
    }
}


const expansionLessonSchema = {
    type: Type.OBJECT,
    properties: {
        lessonTitle: { type: Type.STRING },
        initialContent: { type: Type.STRING, description: "El primer fragmento de contenido para esta lección. Debe ser conciso, atractivo y terminar de forma natural. Utiliza formato markdown (negritas, listas) y emojis relevantes (📡, 💡, ⚙️). Para conceptos visuales, envuélvelos en etiquetas [searchable].", },
        initialOptions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Un array de 2 a 3 opciones de seguimiento para el usuario." }
    },
    required: ["lessonTitle", "initialContent", "initialOptions"]
};

export async function generateExpandedLesson(course: Course, moduleTitle: string, newLessonTitle: string): Promise<Lesson & { lessonTitle: string }> {
    const courseContext = `
        Course Topic: ${course.title}
        Module: "${moduleTitle}"
    `;

    const prompt = `
        Actúa como un educador experto en aprendizaje interactivo. Genera el contenido para una nueva lección titulada "${newLessonTitle}".
        La lección debe encajar lógicamente dentro del contexto del curso y módulo proporcionados y seguir el formato de "Exploración Guiada".
        Crea un 'initialContent' y 2-3 'initialOptions' para iniciar la conversación.
        Para conceptos visuales, envuélvelos en etiquetas especiales: [searchable]termino a buscar[/searchable]. Para código, usa bloques con identificador de lenguaje.

        ---
        **CONTEXTO:**
        ${courseContext}
        ---

        El resultado DEBE SER OBLIGATORIAMENTE un objeto JSON válido que se adhiera al esquema.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: expansionLessonSchema,
            },
        });
        const jsonText = response.text.trim();
        const parsedLesson = JSON.parse(jsonText);
        
        if (!parsedLesson.lessonTitle || !parsedLesson.initialContent) {
            throw new Error("La estructura de la lección generada no es válida.");
        }
        return parsedLesson;
    } catch(e) {
        console.error("Error generating expanded lesson:", e);
        throw new Error("No se pudo generar la nueva lección.");
    }
}

export async function generateComplementaryLesson(courseTitle: string, moduleTitle: string, existingLessonTitles: string[]): Promise<Lesson> {
    const prompt = `
        Actúa como un diseñador instruccional experto. Tu tarea es generar UNA lección adicional y complementaria para un módulo de curso existente.

        **CONTEXTO:**
        - Curso: "${courseTitle}"
        - Módulo: "${moduleTitle}"
        - Lecciones existentes en este módulo:
          ${existingLessonTitles.map(t => `- ${t}`).join('\n')}

        **REQUISITOS:**
        1.  **Genera un Título Atractivo:** El título de la nueva lección debe ser interesante y relevante.
        2.  **Evita la Redundancia:** La nueva lección debe introducir un concepto nuevo, ofrecer una aplicación práctica, o profundizar en un tema existente de una manera que NO se cubra en las lecciones actuales.
        3.  **Sigue el Formato de "Exploración Guiada":**
            - **initialContent:** Un párrafo introductorio conciso. Usa markdown, emojis, y etiquetas [searchable] para conceptos visuales.
            - **initialOptions:** 2-3 opciones claras para que el usuario continúe la exploración.
        4.  **Adhiérete al Esquema:** El resultado DEBE ser un objeto JSON válido.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: expansionLessonSchema,
        },
    });
    const parsedLesson = JSON.parse(response.text.trim());
    if (!parsedLesson.lessonTitle || !parsedLesson.initialContent) {
        throw new Error("La estructura de la lección generada no es válida.");
    }
    return parsedLesson;
}


const guidedStepSchema = {
    type: Type.OBJECT,
    properties: {
        content: { type: Type.STRING, description: "El siguiente fragmento de contenido, respondiendo a la elección del usuario. Usa markdown, emojis, bloques de código con identificador y etiquetas [searchable] para términos visuales." },
        options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2-3 nuevas opciones de seguimiento." }
    },
    required: ["content", "options"]
};

export async function generateGuidedLessonStep(course: Course, lesson: Lesson, history: GuidedLessonStep[], userChoice: string): Promise<GuidedLessonStep> {
    const prompt = `
    Actúa como un instructor experto de TELNET ACADEMY en "${course.title}". Estás guiando a un colaborador a través de una lección interactiva.
    
    **HISTORIAL DE LA LECCIÓN HASTA AHORA:**
    ${history.map((step, i) => `Paso ${i+1}:\nContenido: ${step.content}\nOpciones: ${step.options.join(', ')}`).join('\n\n')}

    **ELECCIÓN DEL COLABORADOR:**
    "${userChoice}"

    **TU TAREA:**
    Genera el siguiente paso de la lección. Tu respuesta debe ser un objeto JSON con:
    1.  **content:** El nuevo fragmento de información que responde directamente a la elección del colaborador. Sé claro y conciso. Usa markdown, emojis, bloques de código (\`\`\`lang) y etiquetas [searchable] para términos visuales.
    2.  **options:** 2-3 nuevas opciones para continuar la exploración. Una de ellas debería ser "Continuar con el siguiente tema" o similar si es apropiado.

    El resultado DEBE ser un objeto JSON válido que se adhiera al esquema.
    `;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: guidedStepSchema,
        },
    });
    // FIX: response.text is a property, not a function.
    return JSON.parse(response.text);
}

export async function generateDeeperExplanation(courseTitle: string, lessonTitle: string, lessonContent: string): Promise<string> {
    const prompt = `
    Actúa como un Asesor Técnico Senior y experto en la materia de TELNET CO. Un colaborador está estudiando la lección "${lessonTitle}" dentro de la ruta de habilidad "${courseTitle}" y ha solicitado una explicación más profunda.

    **CONTEXTO INTERNO DE LA EMPRESA (TELNET CO):**
    ---
    ${TELNET_CO_CONTEXT}
    ---

    **CONTENIDO DE LA LECCIÓN ACTUAL:**
    ---
    ${lessonContent}
    ---

    **TU MISIÓN:**
    Analiza el contenido de la lección y genera una "Idea Clave" que cumpla UNA de las siguientes funciones:
    1.  **Explicación Detallada:** Profundiza en el concepto técnico más importante de la lección, explicando el "porqué" de las cosas.
    2.  **Ejemplo Práctico:** Proporciona un ejemplo concreto y práctico de cómo este concepto se aplica en el día a día de TELNET CO, mencionando nuestras herramientas (OLT Cloud, Splynx, Winbox, etc.) y procedimientos.
    3.  **Analogía Clarificadora:** Crea una analogía simple y fácil de entender que relacione el concepto técnico con algo de la vida cotidiana.

    **REGLAS:**
    - Tu respuesta debe ser concisa (uno o dos párrafos).
    - Usa formato markdown (negritas, listas) para que sea fácil de leer.
    - El tono debe ser el de un colega experto que está ayudando a otro a entender mejor.
    - Responde únicamente con la "Idea Clave". No incluyas saludos ni texto introductorio.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    return response.text.trim();
}

export async function simulateCommandExecution(command: string, context: string): Promise<string> {
    const prompt = `
    Actúa como un **experto en la materia y un revisor de código senior** de TELNET CO. Un colaborador en una ruta de habilidad sobre "${context}" quiere entender un comando, script o bloque de configuración.

    **CÓDIGO A ANALIZAR:**
    \`\`\`
    ${command}
    \`\`\`

    **TU TAREA:**
    Analiza el código y determina la mejor manera de ayudar al colaborador:

    1.  **SI ES UN COMANDO CORTO DE CLI (ej: \`ls -l\`, \`ping 8.8.8.8\`, \`show ip interface brief\`):**
        *   Actúa como un emulador de terminal.
        *   Genera una salida de terminal **realista y plausible** que el colaborador vería al ejecutar ese comando.

    2.  **SI ES UN SCRIPT LARGO O UN BLOQUE DE CONFIGURACIÓN (ej: un script de Python, un archivo de configuración de Nginx, un script de Bash):**
        *   **NO lo ejecutes.**
        *   Proporciona una **explicación detallada y exhaustiva** del código.
        *   Desglosa el código en secciones lógicas.
        *   Para cada sección, explica:
            *   **Qué hace:** Describe la funcionalidad de esa parte del código.
            *   **Por qué es importante:** Explica su propósito en el contexto general del script o la configuración.
        *   Utiliza formato markdown (listas, negritas) para que la explicación sea clara y fácil de seguir.

    **REGLA FINAL:**
    Tu respuesta debe ser únicamente la salida simulada O la explicación detallada. No incluyas saludos ni texto introductorio.
    `;
    const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
    return response.text;
}

const flashcardSchema = {
    type: Type.OBJECT,
    properties: {
        flashcards: {
            type: Type.ARRAY,
            description: "An array of 10-15 flashcards, each with a question and an answer covering the most important concepts.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The question for the front of the flashcard. It should be clear and concise." },
                    answer: { type: Type.STRING, description: "The answer for the back of the flashcard. It should be direct and informative." }
                },
                required: ["question", "answer"]
            }
        }
    },
    required: ["flashcards"]
};

export async function generateFlashcardsForCourse(course: Course): Promise<Flashcard[]> {
    const prompt = `
        Actúa como un experto en creación de material de estudio. Analiza el contenido completo del siguiente curso y genera un conjunto de 10 a 15 flashcards (pregunta y respuesta) que cubran los conceptos más importantes. Las preguntas deben ser claras y las respuestas concisas, utilizando markdown si es necesario.

        El resultado DEBE SER OBLIGATORIAMENTE un objeto JSON válido que se adhiera al esquema proporcionado.

        ---
        **CONTENIDO DEL CURSO:**
        ${getFullCourseContent(course).substring(0, 30000)}
        ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: flashcardSchema,
            }
        });
        const result = JSON.parse(response.text);
        if (result.flashcards && Array.isArray(result.flashcards)) {
            return result.flashcards;
        }
        throw new Error("La respuesta de la API no contiene un array de flashcards válido.");
    } catch (e) {
        console.error("Error generating flashcards:", e);
        throw new Error("No se pudieron generar las flashcards. Por favor, inténtalo de nuevo.");
    }
}


const expansionSuggestionsSchema = {
    type: Type.OBJECT,
    properties: {
        suggestions: {
            type: Type.ARRAY,
            description: "Un array de 3 a 5 sugerencias de temas de lecciones para expandir el módulo. Deben ser títulos de lecciones concisos y atractivos.",
            items: { type: Type.STRING }
        }
    },
    required: ["suggestions"]
};

export async function getModuleExpansionSuggestions(course: Course, moduleIndex: number): Promise<string[]> {
    const module = course.modules[moduleIndex];
    if (!module) {
        throw new Error(`Module with index ${moduleIndex} not found.`);
    }
    
    const prompt = `
        Actúa como un diseñador instruccional experto, especializado en crear rutas de aprendizaje coherentes y atractivas. Tu tarea es proponer los siguientes pasos lógicos para un colaborador que ha completado las lecciones actuales en un módulo.

        **CONTEXTO DEL MÓDULO:**
        - Curso: "${course.title}"
        - Módulo: "${module.moduleTitle}"
        - Lecciones actuales que el colaborador ya conoce:
          ${module.lessons.map(l => `  - ${l.lessonTitle}`).join('\n')}

        **TU MISIÓN:**
        Basado en el contexto, genera entre 3 y 5 títulos de lecciones adicionales que cumplan con lo siguiente:
        1.  **Profundización:** Ofrecen una mirada más profunda a un tema ya introducido.
        2.  **Ampliación:** Introducen un concepto relacionado pero nuevo que lógicamente sigue a los actuales.
        3.  **Aplicación Práctica:** Sugieren una lección enfocada en un caso de uso práctico o un mini-proyecto.
        4.  **Atractivos y Claros:** Los títulos deben ser claros, concisos y despertar la curiosidad.
        5.  **Sin Redundancia:** NO deben ser una simple reformulación de las lecciones existentes.

        El resultado DEBE SER OBLIGATORIAMENTE un objeto JSON válido con un array de strings llamado "suggestions".
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: expansionSuggestionsSchema,
            },
        });
        const result = JSON.parse(response.text);
        if (result.suggestions && Array.isArray(result.suggestions)) {
            return result.suggestions;
        }
        throw new Error("La respuesta de la API no contiene un array de sugerencias válido.");
    } catch (e) {
        console.error("Error generating module expansion suggestions:", e);
        throw new Error("No se pudieron generar sugerencias para expandir el módulo.");
    }
}

export async function generateModuleDescription(moduleTitle: string, lessonTitles: string[]): Promise<string> {
    const prompt = `
        Actúa como un diseñador instruccional conciso.
        Dado el siguiente módulo de un curso, genera una descripción muy breve (una sola frase) que resuma de qué trata.

        **Título del Módulo:** "${moduleTitle}"

        **Lecciones en este Módulo:**
        - ${lessonTitles.join('\n- ')}

        **Tu Tarea:**
        Escribe una única frase descriptiva y atractiva. No incluyas saludos ni texto introductorio. Solo la descripción.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating module description:", error);
        throw new Error("No se pudo generar la descripción del módulo.");
    }
}

export async function streamTutorResponse(
    course: Course,
    progress: Progress,
    history: TutorMessage[],
    newMessage: string,
    moduleIndex: number,
    lessonIndex: number
) {
    const buildProgressSummary = (): string => {
        const totalQuizzes = course.modules.length;
        const passedQuizzesCount = Object.keys(progress.quizScores || {}).filter(key => {
            const score = progress.quizScores![key];
            return (score.score / score.total) >= 0.7;
        }).length;

        let summary = `Resumen del Progreso del Colaborador:\n- Pruebas Aprobadas: ${passedQuizzesCount} de ${totalQuizzes}.\n`;

        if (course.finalProject) {
            if (progress.finalProjectEvaluation) {
                summary += `- Evaluación de Competencia Práctica: Evaluado (${progress.finalProjectEvaluation.overallScore}/100).\n`;
            } else if (progress.completedItems.has('final_project_submitted')) {
                summary += `- Evaluación de Competencia Práctica: Entregado (pendiente de evaluación).\n`;
            } else {
                 summary += `- Evaluación de Competencia Práctica: No entregado.\n`;
            }
        }
        
        const examState = progress.finalExamState;
        let examStatusText = 'No iniciado';
        if (examState) {
            switch(examState.status) {
                case 'in_progress': examStatusText = `En progreso (quedan ${examState.attemptsLeft} intentos)`; break;
                case 'passed': examStatusText = 'Aprobado'; break;
                case 'failed_remediation_needed': examStatusText = 'Fallido, necesita estudiar plan de refuerzo'; break;
                case 'not_started': 
                    if (examState.attemptsLeft < 3) {
                         examStatusText = `Listo para reintentar (quedan ${examState.attemptsLeft} intentos)`;
                    } else {
                         examStatusText = 'Listo para iniciar';
                    }
                    break;
            }
        }
        summary += `- Estado del Examen Final: ${examStatusText}.\n`;
        
        return summary;
    };

    const getCurrentLessonContext = (): string => {
        try {
            const module = course.modules[moduleIndex];
            const lesson = module?.lessons[lessonIndex];
            if (module && lesson) {
                return `
**CONTEXTO DE LA LECCIÓN ACTUAL DEL COLABORADOR:**
El colaborador está actualmente enfocado en o ha visto recientemente la siguiente lección. Usa este contexto para tus respuestas y preguntas.
- Módulo: "${module.moduleTitle}"
- Lección: "${lesson.lessonTitle}"
- Contenido inicial de la lección: "${lesson.initialContent.substring(0, 500)}..."
`;
            }
        } catch (e) {
            // Do nothing if indices are out of bounds
        }
        return `**CONTEXTO DE LA LECCIÓN ACTUAL DEL COLABORADOR:** El colaborador está explorando libremente la ruta de habilidad.`;
    };

    const prompt = `
    Eres un Asesor Técnico IA de TELNET ACADEMY. Tu personalidad es la de un colega senior, experto y amigable. Tu misión es ayudar al colaborador a entender y aplicar los conceptos del curso en el contexto real de TELNET CO.

    **CONTEXTO INTERNO DE LA EMPRESA (TELNET CO) - ¡MUY IMPORTANTE!**
    ---
    ${TELNET_CO_CONTEXT}
    ---

    **CONTEXTO DE LA RUTA DE HABILIDAD ACTUAL:**
    - Título: "${course.title}"
    - Descripción: "${course.description}"
    ---
    ${buildProgressSummary()}
    ---
    ${getCurrentLessonContext()}
    ---

    **HISTORIAL DE CONVERSACIÓN (ÚLTIMOS MENSAJES):**
    ${history.slice(-6).map(m => `${m.role === 'user' ? 'Colaborador' : 'Asesor IA'}: ${m.content}`).join('\n')}
    
    **NUEVA PREGUNTA DEL COLABORADOR:**
    "${newMessage}"

    **INSTRUCCIONES DE RESPUESTA:**
    1.  **Actúa como un Experto:** Tu conocimiento es profundo. Responde con confianza y precisión.
    2.  **Sé Práctico y Relevante:** Siempre que sea posible, conecta la teoría con las herramientas (Splynx, OLT Cloud) y procedimientos de TELNET CO.
    3.  **Usa Búsqueda de Google SI ES NECESARIO:** Si la pregunta es sobre un evento muy reciente, un error específico de software de terceros, o requiere información actualizada de la web, utiliza la herramienta \`googleSearch\`. **NO la uses para preguntas sobre los conceptos del curso o los procedimientos internos de TELNET CO.**
    4.  **Referencia a la Base de Conocimiento:** Si la pregunta del colaborador puede ser resuelta con un procedimiento estándar, refiérelo a la "Base de Conocimiento" interna de TELNET ACADEMY. Por ejemplo: "Puedes encontrar una guía detallada sobre eso en la Base de Conocimiento. Busca el artículo 'Crear un Ticket de Soporte en Splynx'".
    5.  **Formato Claro:** Usa markdown (negritas, listas, etc.) para que tus respuestas sean fáciles de leer.
    6.  **Mantén el Tono:** Amigable, de apoyo, como un mentor.
    `;

    return ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });
}

export async function generateForumSummary(lessonTitle: string, posts: ForumPost[]): Promise<string> {
    const discussionContent = posts.map(post => `
        ---
        POST TITLE: ${post.title}
        AUTHOR: ${post.authorName}
        CONTENT: ${post.content}
        REPLIES:
        ${post.replies.map(reply => `
            - Reply by ${reply.authorName}: ${reply.content}
        `).join('\n')}
    `).join('\n');

    const prompt = `
    Actúa como un Asistente Académico de IA. Tu tarea es analizar una discusión de un foro sobre una lección específica y generar un resumen ejecutivo.

    **Lección:** "${lessonTitle}"

    **Contenido de la Discusión:**
    ${discussionContent.substring(0, 30000)}

    **Instrucciones para el Resumen:**
    1.  **Identifica los Temas Principales:** ¿Cuáles son las 2-3 preguntas o temas clave que se discuten?
    2.  **Resume las Soluciones Clave:** Si se propusieron soluciones o respuestas importantes, resúmelas.
    3.  **Señala Dudas Persistentes:** Menciona si alguna pregunta quedó sin una respuesta clara o si surgieron nuevas dudas.
    4.  **Formato:** Utiliza markdown (listas, negritas) para que el resumen sea claro y fácil de leer. Responde únicamente con el resumen.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    return response.text.trim();
}


// FIX: Added missing functions
export async function generateCertificateData(course: Course, userName: string): Promise<CertificateData> {
    const prompt = `
    Actúa como un director académico. Genera los datos para un certificado de finalización.
    - Curso: "${course.title}"
    - Participante: "${userName}"

    Debes generar:
    1.  **summary**: Un resumen muy breve (15-20 palabras) de la competencia principal adquirida.
    2.  **validationId**: Un ID de validación alfanumérico único de 12 caracteres.
    3.  **durationHours**: Una estimación razonable de las horas que tomaría completar este curso (entre 4 y 20 horas).

    El resultado DEBE ser un objeto JSON válido.
    `;
    const schema = {
        type: Type.OBJECT,
        properties: {
            summary: { type: Type.STRING },
            validationId: { type: Type.STRING },
            durationHours: { type: Type.NUMBER }
        },
        required: ["summary", "validationId", "durationHours"]
    };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema
        }
    });
    // FIX: response.text is a property, not a function.
    return JSON.parse(response.text);
}

export async function generateRemedialLesson(incorrectQuestions: { question: QuizQuestion; userAnswer: string }[]): Promise<RemedialLesson> {
    const prompt = `
    Actúa como un tutor experto. Un estudiante ha respondido incorrectamente a las siguientes preguntas.
    Analiza los errores y genera una lección de refuerzo concisa y clara que aborde específicamente los conceptos mal entendidos.

    Preguntas y Respuestas Incorrectas:
    ${incorrectQuestions.map(q => `
    - Pregunta: "${q.question.question}"
    - Respuesta Correcta: "${q.question.correctAnswer}"
    - Respuesta del Estudiante: "${q.userAnswer}"
    `).join('\n')}

    Genera un objeto JSON con "title" y "content" para la lección de refuerzo. El contenido debe usar markdown.
    `;
    const schema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: "Un título claro y conciso para la lección de refuerzo." },
            content: { type: Type.STRING, description: "El contenido de la lección en formato markdown, explicando los conceptos clave." }
        },
        required: ["title", "content"]
    };
     const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema
        }
    });
    // FIX: response.text is a property, not a function.
    return JSON.parse(response.text);
}

export async function generateCompetencyFeedback(moduleTitle: string, score: number, total: number): Promise<string> {
    const prompt = `
    Actúa como un coach de desarrollo profesional. Un colaborador completó el cuestionario del módulo "${moduleTitle}" y obtuvo ${score} de ${total} respuestas correctas.
    
    Genera un feedback breve (2-3 frases) que sea constructivo y motivador. Si la puntuación es baja, enfócate en las áreas de mejora. Si es alta, felicítalo y anímalo a continuar.
    Responde únicamente con el feedback en formato markdown. No incluyas saludos.
    `;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    return response.text.trim();
}

export function streamExamAttempt(course: Course, history: TutorMessage[]) {
    const prompt = `
    Eres un Examinador Técnico Senior de IA para TELNET ACADEMY. Tu misión es conducir un examen oral riguroso para validar la competencia de un colaborador en la ruta de habilidad: "${course.title}".

    **CONTEXTO INTERNO DE TELNET CO:**
    ${TELNET_CO_CONTEXT}

    **REGLAS DEL EXAMEN:**
    1.  **Formato Conversacional:** El examen es un diálogo. Haz una pregunta, espera la respuesta, evalúala y haz la siguiente.
    2.  **Profundidad Técnica:** Las preguntas deben ser desafiantes y requerir la aplicación de conocimientos en escenarios prácticos de TELNET CO. No hagas preguntas de memoria simples.
    3.  **Ciclo de Preguntas:** Realiza entre 4 y 6 preguntas en total para evaluar la competencia.
    4.  **Feedback Constructivo:** Si una respuesta es incorrecta o incompleta, haz una contrapregunta para darle al colaborador la oportunidad de corregir o profundizar. No des la respuesta directamente.
    5.  **VEREDICTO FINAL (MUY IMPORTANTE):** Después de la última pregunta, debes emitir un veredicto. Tu respuesta DEBE terminar con un bloque de código JSON con la siguiente estructura:
        \`\`\`json
        {
          "passed": boolean,
          "feedback": "string con tu feedback general sobre el desempeño del colaborador."
        }
        \`\`\`
        El texto del feedback debe estar fuera del JSON, y el JSON debe ser la última parte de tu respuesta.

    **HISTORIAL DEL EXAMEN HASTA AHORA:**
    ${history.map(m => `${m.role === 'user' ? 'Colaborador' : 'Examinador'}: ${m.content}`).join('\n\n')}

    **TU SIGUIENTE ACCIÓN:**
    - Si la conversación acaba de empezar, saluda y haz la primera pregunta.
    - Si el colaborador acaba de responder, evalúa su respuesta y haz la siguiente pregunta o contrapregunta.
    - Si ya has hecho suficientes preguntas, da tu feedback final y el bloque JSON con el veredicto.
    `;
    return ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
}

export async function generateExamRemediationPlan(courseTitle: string, history: TutorMessage[]): Promise<string> {
     const prompt = `
    Actúa como un tutor académico de IA. Un colaborador no ha logrado superar el examen final para la ruta de habilidad "${courseTitle}". Analiza el historial completo del examen y crea un "Plan de Estudio de Refuerzo" personalizado y práctico.

    **HISTORIAL DEL EXAMEN:**
    ${history.map(m => `${m.role === 'user' ? 'Colaborador' : 'Examinador'}: ${m.content}`).join('\n\n')}

    **INSTRUCCIONES:**
    1.  Identifica los 2-3 conceptos clave donde el colaborador mostró más debilidad.
    2.  Para cada concepto, crea una sección en el plan de estudio.
    3.  En cada sección, proporciona:
        *   Una explicación clara y concisa del concepto.
        *   Un ejemplo práctico relacionado con TELNET CO.
        *   Una sugerencia de acción o ejercicio simple para reforzar el aprendizaje.
    4.  Usa formato markdown para que el plan sea claro y fácil de seguir.
    `;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    return response.text.trim();
}

export async function generateMindMap(course: Course): Promise<MindMapNode> {
    const prompt = `
    Actúa como un experto en visualización de información. Analiza la estructura y contenido del siguiente curso y genera un mapa mental jerárquico.
    El resultado debe ser un objeto JSON que represente el nodo raíz del mapa mental. Cada nodo debe tener una propiedad "concept" (string) y opcionalmente una propiedad "children" (un array de nodos).

    **CONTENIDO DEL CURSO:**
    ${getFullCourseContent(course).substring(0, 30000)}
    `;
    const schema = {
        type: Type.OBJECT,
        properties: {
            concept: { type: Type.STRING },
            children: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        concept: { type: Type.STRING },
                        children: {
                            type: Type.ARRAY,
                             items: {
                                type: Type.OBJECT,
                                properties: {
                                    concept: { type: Type.STRING },
                                }
                            }
                        }
                    }
                }
            }
        },
        required: ["concept"]
    };
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: schema }
    });
    return JSON.parse(response.text);
}

export async function streamInterviewSimResponse(course: Course, history: InterviewStep[]) {
    const prompt = `
    Eres un Entrevistador Técnico Senior de IA de TELNET CO. Estás simulando una entrevista técnica para un rol relacionado con la ruta de habilidad "${course.title}".

    **REGLAS DE LA SIMULACIÓN:**
    1.  **Inicia la Entrevista:** Si el historial está vacío, preséntate, explica brevemente el escenario práctico que van a discutir y haz la primera pregunta.
    2.  **Sé Realista:** Actúa como un entrevistador real. Haz preguntas de seguimiento, pide aclaraciones y profundiza en las respuestas del candidato.
    3.  **Enfócate en Escenarios:** Basa tus preguntas en escenarios prácticos relevantes para TELNET CO y el contenido del curso.
    4.  **No des las Respuestas:** Guía al candidato si se equivoca, pero no le des la solución.
    5.  **Concluye la Entrevista:** Después de 4-5 intercambios, concluye la simulación agradeciéndole al candidato por su tiempo.

    **HISTORIAL DE LA ENTREVISTA:**
    ${history.map(m => `${m.role === 'user' ? 'Candidato' : 'Entrevistador'}: ${m.content}`).join('\n\n')}

    **TU SIGUIENTE ACCIÓN:**
    Continúa la conversación de manera lógica.
    `;
    return ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
}

export async function generateNetworkTopology(prompt: string): Promise<NetworkTopology> {
    const schema = {
        type: Type.OBJECT,
        properties: {
            devices: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        label: { type: Type.STRING },
                        type: { type: Type.STRING },
                        explanation: { type: Type.STRING }
                    },
                    required: ["id", "label", "type", "explanation"]
                }
            },
            links: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        source: { type: Type.STRING },
                        target: { type: Type.STRING },
                        label: { type: Type.STRING },
                        explanation: { type: Type.STRING }
                    },
                    required: ["source", "target", "explanation"]
                }
            }
        },
        required: ["devices", "links"]
    };

    const generationPrompt = `
    Actúa como un Ingeniero de Red experto. Analiza la siguiente descripción de una topología de red y conviértela en un objeto JSON estructurado.

    **Descripción de la Red:**
    "${prompt}"

    **Instrucciones:**
    1.  Identifica todos los dispositivos de red mencionados.
    2.  Asígnales un ID único, una etiqueta clara y el tipo correcto (router, switch, pc, server, firewall, cloud, etc.).
    3.  Para cada dispositivo, escribe una breve explicación de su función en esta red específica.
    4.  Identifica todas las conexiones entre los dispositivos.
    5.  Crea los enlaces ("links") usando los IDs de los dispositivos.
    6.  Para cada enlace, escribe una breve explicación de su propósito (ej: "Conexión a Internet", "Acceso a VLAN de Ventas").

    El resultado DEBE ser un objeto JSON válido que se adhiera al esquema.
    `;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: generationPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
        }
    });

    return JSON.parse(response.text);
}
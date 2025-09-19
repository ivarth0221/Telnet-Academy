import type { Employee, CourseTemplate, GamificationState, Role, KnowledgeBaseArticle, GalleryItem } from './types';

export const defaultGamification: GamificationState = {
  streak: 0,
  lastStudiedDate: null,
  xp: 0,
  level: 1,
  achievements: [],
};

export const initialRoles: Role[] = [
  { id: 'role-1', name: 'Agente de Soporte Nivel 1' },
  { id: 'role-2', name: 'Auxiliar NOC (Soporte Nivel 2)' },
  { id: 'role-3', name: 'Técnico Instalador FTTH' },
  { id: 'role-admin', name: 'Administrador' },
];

export const initialEmployees: Employee[] = [
  {
    id: 'emp-1',
    name: 'Ana Gómez',
    role: initialRoles[0],
    assignedCourses: [],
    gamification: { ...defaultGamification, streak: 3, xp: 1250, level: 3 },
  },
  {
    id: 'emp-2',
    name: 'Carlos Rivas',
    role: initialRoles[1],
    assignedCourses: [],
    gamification: { ...defaultGamification, streak: 1, xp: 550, level: 2 },
  },
  {
    id: 'emp-3',
    name: 'Luisa Fernandez',
    role: initialRoles[2],
    assignedCourses: [],
    gamification: { ...defaultGamification },
  },
  {
    id: 'admin-1',
    name: 'Admin',
    role: initialRoles[3],
    assignedCourses: [],
    gamification: { ...defaultGamification },
  }
];

export const initialTemplates: CourseTemplate[] = [
  {
    id: 'template-1',
    topic: 'Introducción a Splynx para Soporte N1',
    role: 'Agente de Soporte Nivel 1',
    depth: 'Básico',
    course: {
      title: 'Dominio de Splynx: Gestión de Clientes (Básico)',
      description: 'Aprende a utilizar Splynx, la herramienta esencial de TELNET CO para la gestión de clientes, tickets y servicios. Esta ruta te dará las bases para atender a los clientes de manera eficiente.',
      modules: [
        {
          moduleTitle: 'Navegación y Conceptos Clave',
          learningObjectives: [
            'Identificar las secciones principales de la interfaz de Splynx.',
            'Entender el flujo de trabajo de un ticket de soporte.',
            'Localizar la información de un cliente de manera rápida y efectiva.'
          ],
          lessons: [
            {
              lessonTitle: '¿Qué es Splynx y por qué es vital?',
              initialContent: '¡Bienvenido a Splynx! 📡 Splynx es el **cerebro** de nuestras operaciones de cara al cliente. Es un Sistema de Gestión de ISP que nos permite manejar todo, desde la creación de un cliente hasta su facturación y soporte técnico. \n\nPara ti, como Agente de Soporte Nivel 1, Splynx será tu herramienta principal. Aquí es donde vivirán todos los **tickets y tareas** de soporte.',
              initialOptions: ['Entendido, ¿cuáles son sus partes principales?', '¿Qué es un "ticket"?'],
            },
            {
              lessonTitle: 'El Dashboard de Cliente',
              initialContent: 'La vista de cliente es tu punto de partida. Al buscar un cliente, verás un dashboard completo con su información. Las secciones más importantes para ti son:\n\n*   **Información General:** Nombre, dirección, contacto.\n*   **Servicios:** Aquí ves qué plan de internet tiene contratado.\n*   **Tickets:** El historial de todos los problemas y solicitudes que ha tenido.\n*   **Facturación:** Estado de sus pagos (¡importante para verificar si un corte es por falta de pago!). \n\nObserva esta imagen de un [searchable]Dashboard de Splynx[/searchable] para familiarizarte.',
              initialOptions: ['¿Cómo creo un nuevo ticket?', '¿Dónde veo el estado de la conexión?'],
            }
          ],
          quiz: [
            {
              question: '¿Cuál es la función principal de Splynx para un Agente N1?',
              options: ['Configurar routers de la red', 'Gestionar tickets de soporte y consultar información de clientes', 'Medir la señal de fibra óptica', 'Diseñar la arquitectura de red'],
              correctAnswer: 'Gestionar tickets de soporte y consultar información de clientes',
            },
            {
              question: 'Si un cliente llama por un problema, ¿cuál es el primer paso en Splynx?',
              options: ['Reiniciar la OLT', 'Crear un nuevo ticket o tarea', 'Revisar la configuración de su router', 'Enviar un técnico a su casa'],
              correctAnswer: 'Crear un nuevo ticket o tarea',
            },
            {
              question: '¿En qué sección de Splynx puedes verificar si un cliente está al día con sus pagos?',
              options: ['Servicios', 'Tickets', 'Facturación', 'Información General'],
              correctAnswer: 'Facturación',
            },
            {
              question: '¿Qué herramienta NO utiliza un Agente de Soporte Nivel 1?',
              options: ['Splynx', 'Zoho Clip', 'Correo Corporativo', 'OLT Cloud'],
              correctAnswer: 'OLT Cloud',
            },
            {
              question: 'Un "ticket" en Splynx representa...',
              options: ['Una factura pagada', 'Un registro formal de una solicitud o problema del cliente', 'Un nuevo cliente', 'Una orden de instalación'],
              correctAnswer: 'Un registro formal de una solicitud o problema del cliente',
            },
          ]
        }
      ],
      finalProject: {
        title: 'Simulación de Caso: Creación de un Ticket de Soporte',
        description: 'Un cliente, "Juan Pérez", llama indicando que "el internet está muy lento". Tu tarea es crear el ticket de soporte inicial en Splynx. Describe en el cuadro de texto todos los pasos que seguirías y la información que registrarías en el ticket, basándote en los procedimientos de TELNET CO. Menciona las preguntas clave que le harías al cliente para obtener toda la información necesaria.',
        evaluationCriteria: [
          'Claridad y completitud de la información registrada en el ticket.',
          'Aplicación correcta del procedimiento de diagnóstico básico N1.',
          'Capacidad para identificar la información clave del cliente y del problema.'
        ]
      }
    }
  },
];

export const roleAssignments: Record<string, string> = {
  'Agente de Soporte Nivel 1': 'template-1',
};

export const initialKnowledgeBase: KnowledgeBaseArticle[] = [
    {
        id: 'kb-1',
        title: 'Procedimiento para Crear un Ticket de Soporte en Splynx',
        category: 'Splynx',
        content: '### Paso 1: Identificar al Cliente\nBusca al cliente por nombre, cédula o ID en la barra de búsqueda principal.\n\n### Paso 2: Crear Nuevo Ticket\nDesde el perfil del cliente, ve a la pestaña "Tickets" y haz clic en "Añadir Ticket".\n\n### Paso 3: Llenar la Información\n- **Asunto:** Un resumen corto y claro del problema (ej: "Internet Lento", "Sin Conexión").\n- **Descripción:** Detalla toda la información recopilada del cliente. ¡Sé específico!\n- **Prioridad:** Define la urgencia del caso.\n\n### Paso 4: Guardar\nGuarda el ticket. El sistema le asignará un número único para seguimiento.',
        relatedRoles: ['Agente de Soporte Nivel 1', 'Auxiliar NOC (Sorte Nivel 2)'],
    }
];

export const initialGalleryItems: GalleryItem[] = [
    {
        id: 'gal-1',
        title: 'Conector SC/APC',
        description: 'Conector estándar para terminaciones de fibra en redes FTTH. El color verde indica un pulido angular (APC) para un mejor rendimiento.',
        imageUrl: 'https://i.imgur.com/vA1w1kU.jpeg',
        category: 'Conectores'
    },
    {
        id: 'gal-2',
        title: 'Power Meter Óptico',
        description: 'Herramienta esencial para medir la potencia de la señal óptica (Rx) que llega al cliente. Un nivel adecuado es crucial para una buena conexión.',
        imageUrl: 'https://i.imgur.com/kY3v7s0.jpeg',
        category: 'Herramientas'
    },
    {
        id: 'gal-3',
        title: 'Fibra Monomodo (SMF)',
        description: 'Tipo de fibra óptica utilizada para largas distancias, como en la red troncal de TELNET CO. Tiene un núcleo muy pequeño (9 micrones).',
        imageUrl: 'https://i.imgur.com/2Xy8A7W.jpeg',
        category: 'Tipos de Fibra'
    }
];

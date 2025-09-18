
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
    { id: 'role-4', name: 'Coordinador Técnico de Proyecto' },
    { id: 'role-5', name: 'Ingeniero de Red (Nivel 3)' },
    { id: 'role-6', name: 'Director Técnico' },
    { id: 'role-7', name: 'Candidato' },
    { id: 'role-8', name: 'Auxiliar Administrativo/a' },
    { id: 'role-9', name: 'Encargado/a de Facturación' },
];

// FIX: Export initialEmployees, initialKnowledgeBase, and initialGalleryItems.
export const initialEmployees: Employee[] = [
    {
        id: 'emp-1',
        name: 'Ana García',
        role: initialRoles[0], // Agente de Soporte Nivel 1
        assignedCourses: [],
        gamification: { ...defaultGamification, xp: 150, level: 2, streak: 3, achievements: ['pioneer'] }
    },
    {
        id: 'emp-2',
        name: 'Carlos Rodriguez',
        role: initialRoles[1], // Auxiliar NOC (Soporte Nivel 2)
        assignedCourses: [],
        gamification: { ...defaultGamification, xp: 550, level: 3, achievements: ['pioneer'] }
    },
    {
        id: 'emp-3',
        name: 'Luisa Martinez',
        role: initialRoles[2], // Técnico Instalador FTTH
        assignedCourses: [],
        gamification: { ...defaultGamification, xp: 1200, level: 5, streak: 8, achievements: ['pioneer', 'streak_7'] }
    },
    {
        id: 'emp-4',
        name: 'Javier Torres',
        role: initialRoles[6], // Candidato
        assignedCourses: [],
        gamification: { ...defaultGamification }
    },
];

export const initialKnowledgeBase: KnowledgeBaseArticle[] = [
    {
        id: 'kb-1',
        title: 'Procedimiento Estándar para Crear un Ticket en Splynx',
        category: 'Splynx',
        content: '### Paso 1: Identificar al Cliente\nBusca al cliente por nombre, cédula o ID de servicio.\n\n### Paso 2: Crear Nuevo Ticket\nDesde la ficha del cliente, ve a la pestaña "Tickets" y haz clic en "Añadir Nuevo".\n\n### Paso 3: Llenar la Información\n- **Asunto:** Un resumen claro del problema (ej: "Cliente reporta no tener internet").\n- **Descripción:** Detalla toda la información recopilada: luces de la ONT, pruebas realizadas, etc.\n- **Prioridad:** Asigna la prioridad correcta.\n- **Asignar a:** Escala al departamento correcto (ej: NOC N2).',
        relatedRoles: ['Agente de Soporte Nivel 1', 'Auxiliar NOC (Soporte Nivel 2)']
    },
    {
        id: 'kb-2',
        title: 'Diagnóstico Básico de Señal en OLT Cloud',
        category: 'OLT Cloud',
        content: '### 1. Búsqueda de la ONT\nUsa la "Consulta Rápida" para buscar la ONT por Serial (SN).\n\n### 2. Verificar Estado\n- **Estado:** ¿Dice `online` u `offline`?\n- **Rx Power:** Este es el nivel de señal. El rango ideal es entre -15 dBm y -26 dBm. Valores por debajo de -27 dBm son críticos.\n- **Última Razón de Desconexión:** `Dying Gasp` significa corte de energía. `LOSi` significa pérdida de señal óptica.',
        relatedRoles: ['Auxiliar NOC (Soporte Nivel 2)']
    }
];

export const initialGalleryItems: GalleryItem[] = [
    {
        id: 'gal-1',
        title: 'Conector SC/APC',
        description: 'Conector estándar de color verde. El corte en ángulo (APC) minimiza la reflectancia.',
        imageUrl: 'https://m.media-amazon.com/images/I/61k5s+i6l+L.jpg',
        category: 'Conectores'
    },
    {
        id: 'gal-2',
        title: 'Cleaver (Cortadora de Precisión)',
        description: 'Herramienta esencial para realizar un corte limpio y a 90 grados en la fibra antes de la fusión o conectorización.',
        imageUrl: 'https://fibramarket.com/cdn/shop/products/Cortadora-de-precision-para-fibra-optica-cleaver-PRO-Fibramarket-2_1024x1024.jpg?v=1630335835',
        category: 'Herramientas'
    },
    {
        id: 'gal-3',
        title: 'Fibra Monomodo (SM)',
        description: 'Cable de fibra óptica monomodo (Single Mode), identificado por su chaqueta de color amarillo. Es el estándar para redes FTTH.',
        imageUrl: 'https://www.net-telecom.com.br/wp-content/uploads/2021/08/fibra-optica-monomodo-e-multimodo-qual-usar-1280x720.jpeg',
        category: 'Tipos de Fibra'
    }
];

// Asignaciones de cursos obligatorios por rol
export const roleAssignments: Record<string, string> = {
    'Agente de Soporte Nivel 1': 'template-n1-01',
    'Auxiliar NOC (Soporte Nivel 2)': 'template-n2-01',
    'Técnico Instalador FTTH': 'template-ftth-01',
    'Candidato': 'template-general-01',
    'Auxiliar Administrativo/a': 'template-admin-01',
    'Encargado/a de Facturación': 'template-admin-01',
    'Coordinador Técnico de Proyecto': 'template-coord-01',
    'Ingeniero de Red (Nivel 3)': 'template-n3-01',
};


export const initialTemplates: CourseTemplate[] = [
    // =================================================================
    // --- ROL: GENERAL / TODOS LOS CARGOS ---
    // =================================================================
    {
        id: 'template-general-01',
        topic: 'Bienvenida e Inducción a TELNET CO',
        role: 'Todos los cargos',
        depth: 'Básico',
        course: {
            title: 'Inducción a TELNET CO (Básico)',
            description: 'Una guía esencial sobre la misión, servicios, estructura y herramientas de comunicación de TELNET CO para todos los nuevos colaboradores.',
            modules: [
                {
                    moduleTitle: 'Módulo 1: Nuestra Misión y Servicios',
                    learningObjectives: ['Comprender el propósito de TELNET CO', 'Describir los servicios principales (FTTH y TDT)'],
                    lessons: [
                        { lessonTitle: 'Misión: Conectando Comunidades', initialContent: '¡Bienvenido/a a TELNET CO! 🚀 Nuestra misión es simple pero poderosa: conectar comunidades. Creemos que el acceso a internet de alta calidad es una herramienta fundamental para el desarrollo. Tu rol, sea cual sea, contribuye directamente a este propósito.', initialOptions: ['¿Cuáles son nuestros valores?', '¿Qué servicios ofrecemos?', '¿Cómo mido mi impacto?'] },
                        { lessonTitle: 'Servicios Clave: Fibra y TV', initialContent: 'Ofrecemos dos servicios principales: 🌐 **Internet por Fibra Óptica (FTTH)**, que lleva alta velocidad directamente a los hogares, y 📺 **Televisión Digital Terrestre (TDT)**, nuestra solución de TV. Ambos servicios utilizan nuestra propia infraestructura.', initialOptions: ['¿Qué es FTTH?', '¿Cómo funciona la TDT?', '¿Hay otros servicios?'] }
                    ],
                    quiz: [
                        { question: '¿Cuál es la misión principal de TELNET CO?', options: ['Vender la mayor cantidad de planes', 'Conectar comunidades', 'Ser el ISP más grande del país', 'Ofrecer el internet más barato'], correctAnswer: 'Conectar comunidades' },
                        { question: 'El servicio de internet de alta velocidad de TELNET CO se llama:', options: ['ADSL', 'Internet Satelital', 'FTTH', 'Internet Móvil'], correctAnswer: 'FTTH' },
                        { question: 'Además de internet, ¿qué otro servicio principal ofrece TELNET CO?', options: ['Telefonía Fija', 'TDT', 'Hosting de Páginas Web', 'Seguridad Informática'], correctAnswer: 'TDT' },
                        { question: '¿Por qué es importante tu rol en la empresa?', options: ['Porque me pagan por ello', 'Para cumplir un horario', 'Contribuye a la misión de conectar comunidades', 'No es importante'], correctAnswer: 'Contribuye a la misión de conectar comunidades' },
                        { question: 'La sigla FTTH significa:', options: ['Fibra para todos los hogares', 'Internet rápido para la casa', 'Fibra hasta el hogar (Fiber to the Home)', 'Señal de TV y teléfono'], correctAnswer: 'Fibra hasta el hogar (Fiber to the Home)' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 2: Estructura y Comunicación',
                    learningObjectives: ['Identificar las áreas clave de la empresa', 'Entender el flujo básico de comunicación interna y con el cliente'],
                    lessons: [
                        { lessonTitle: '¿Quién Hace Qué?', initialContent: 'Somos un equipo con roles claros. 🤝 **Soporte N1** es el primer contacto. Si es algo técnico, lo escalan al **NOC N2**. Si se necesita ir a la casa del cliente, va un **Técnico de Campo**. **Ingeniería N3** se encarga de la red principal. ¡Todos somos eslabones de la misma cadena!', initialOptions: ['¿Qué hace el área Administrativa?', '¿Cuál es el flujo exacto de un ticket?', '¿Cómo nos comunicamos entre áreas?'] },
                        { lessonTitle: 'La Comunicación es Clave', initialContent: 'Usamos **Splynx** para registrar CADA interacción con un cliente en forma de Tickets o Tareas. Esto es vital para que todos tengamos el mismo contexto. Para la comunicación interna rápida, usamos **Zoho Clip**. 🗣️', initialOptions: ['¿Por qué es tan importante registrar todo?', '¿Cuándo uso Clip y cuándo el correo?', '¿Qué es un ticket?'] }
                    ],
                    quiz: [
                        { question: '¿Quién es el primer punto de contacto para un cliente con un problema?', options: ['NOC Nivel 2', 'Un Técnico de Campo', 'Ingeniería Nivel 3', 'Agente de Soporte Nivel 1'], correctAnswer: 'Agente de Soporte Nivel 1' },
                        { question: 'Si un problema requiere una visita a la casa del cliente, ¿quién es asignado?', options: ['NOC Nivel 2', 'Técnico de Campo', 'Soporte Nivel 1', 'Director Técnico'], correctAnswer: 'Técnico de Campo' },
                        { question: '¿Qué área se encarga de los problemas más complejos de la red central?', options: ['Soporte Nivel 1', 'Administración', 'Ingeniería (Nivel 3)', 'Técnicos de Campo'], correctAnswer: 'Ingeniería (Nivel 3)' },
                        { question: 'La herramienta oficial para registrar las interacciones con clientes es:', options: ['Un cuaderno', 'WhatsApp', 'Splynx', 'Zoho Clip'], correctAnswer: 'Splynx' },
                        { question: 'Para chatear rápidamente con un colega de otra área, se usa:', options: ['Splynx', 'Correo Electrónico', 'Una llamada telefónica', 'Zoho Clip'], correctAnswer: 'Zoho Clip' }
                    ]
                },
                 {
                    moduleTitle: 'Módulo 3: Nuestros Valores y Cultura',
                    learningObjectives: ['Identificar los valores fundamentales de TELNET CO', 'Comprender cómo se aplican los valores en el trabajo diario'],
                    lessons: [
                        { lessonTitle: 'El ADN de TELNET CO', initialContent: 'Nuestra cultura se basa en tres pilares: **1. Pasión por el Cliente:** No solo vendemos un servicio, solucionamos necesidades. **2. Trabajo en Equipo:** Ningún área es una isla; dependemos unos de otros. **3. Mejora Continua:** Siempre buscamos ser mejores, más eficientes y más innovadores. 💪', initialOptions: ['Ejemplo de Pasión por el Cliente', '¿Cómo fomentamos el trabajo en equipo?', '¿Qué es la innovación para nosotros?'] },
                        { lessonTitle: 'Viviendo los Valores', initialContent: 'Vivir los valores significa que un técnico en campo no solo instala, sino que se asegura de que el cliente entienda cómo usar el servicio. Significa que un agente de N1 no solo crea un ticket, sino que lo documenta pensando en que su compañero del NOC lo entienda a la perfección. ✨', initialOptions: ['¿Hay evaluaciones de desempeño basadas en esto?', '¿Cómo se manejan los conflictos?', 'Siguiente tema.'] }
                    ],
                    quiz: [
                        { question: '¿Cuál de los siguientes NO es un pilar de la cultura de TELNET CO?', options: ['Pasión por el Cliente', 'Trabajo en Equipo', 'Competencia Individual', 'Mejora Continua'], correctAnswer: 'Competencia Individual' },
                        { question: 'Documentar un ticket de forma clara para ayudar a otra área es un ejemplo de:', options: ['Pasión por el Cliente', 'Trabajo en Equipo', 'Mejora Continua', 'Todas las anteriores'], correctAnswer: 'Trabajo en Equipo' },
                        { question: 'Buscar una forma más eficiente de realizar una tarea diaria se alinea con el valor de:', options: ['Pasión por el Cliente', 'Trabajo en Equipo', 'Mejora Continua', 'Respeto'], correctAnswer: 'Mejora Continua' },
                        { question: 'El concepto "Ningún área es una isla" se refiere a:', options: ['Todos deben saber de todo', 'La colaboración entre departamentos es fundamental', 'Debemos trabajar en silencio', 'Tenemos oficinas en islas'], correctAnswer: 'La colaboración entre departamentos es fundamental' },
                        { question: 'El objetivo final de nuestros valores es:', options: ['Cumplir con un requisito de RRHH', 'Crear un ambiente de trabajo positivo y eficiente', 'Vender más planes', 'Hacer que los empleados trabajen más horas'], correctAnswer: 'Crear un ambiente de trabajo positivo y eficiente' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 4: Políticas Clave de la Empresa',
                    learningObjectives: ['Conocer las políticas básicas de seguridad de la información', 'Entender las normas de convivencia y uso de equipos'],
                    lessons: [
                        { lessonTitle: 'Seguridad de la Información: Nuestra Responsabilidad', initialContent: 'Manejas datos de clientes, y eso es una gran responsabilidad. 🔒 Regla de oro: **Nunca compartas tu contraseña de Splynx u OLT Cloud con nadie**. Además, toda la información de los clientes es confidencial y solo debe ser usada para propósitos laborales.', initialOptions: ['¿Qué se considera información confidencial?', 'Política de contraseñas seguras', '¿Qué hago si veo algo sospechoso?'] },
                        { lessonTitle: 'Uso de Equipos y Recursos', initialContent: 'Los equipos y herramientas (computadores, celulares, etc.) que te proporciona la empresa son para uso laboral. 💻 Respeta las normas de convivencia en la oficina y mantén una comunicación respetuosa con tus compañeros en todos los canales.', initialOptions: ['¿Puedo instalar software personal en el PC de la empresa?', 'Código de vestimenta', 'Política de uso de internet'] }
                    ],
                    quiz: [
                        { question: '¿Cuál es la regla de oro sobre tus contraseñas de las plataformas de la empresa?', options: ['Apuntarla en un post-it en la pantalla', 'Usar "123456"', 'No compartirla con nadie', 'Cambiarla cada año'], correctAnswer: 'No compartirla con nadie' },
                        { question: 'La información de los clientes es:', options: ['Pública', 'Confidencial', 'Poco importante', 'Solo para el área de ventas'], correctAnswer: 'Confidencial' },
                        { question: 'Los equipos proporcionados por TELNET CO son para:', options: ['Uso personal y laboral', 'Uso exclusivamente laboral', 'Jugar videojuegos', 'Ver películas'], correctAnswer: 'Uso exclusivamente laboral' },
                        { question: 'La comunicación con los compañeros debe ser siempre:', options: ['Informal', 'Competitiva', 'Respetuosa', 'Solo por correo'], correctAnswer: 'Respetuosa' },
                        { question: 'Si sospechas de una brecha de seguridad, debes:', options: ['Ignorarlo', 'Intentar solucionarlo solo', 'Informar a tu supervisor inmediatamente', 'Publicarlo en redes sociales'], correctAnswer: 'Informar a tu supervisor inmediatamente' }
                    ]
                }
            ],
            finalProject: {
                title: 'Mi Compromiso con TELNET CO',
                description: 'Escribe un breve texto (dos o tres párrafos) describiendo cómo aplicarás los valores de TELNET CO (Pasión por el Cliente, Trabajo en Equipo, Mejora Continua) en tu rol específico dentro de la empresa. Da un ejemplo práctico para cada valor.',
                evaluationCriteria: [
                    'Comprensión clara de los tres valores fundamentales.',
                    'Aplicación de los valores a situaciones prácticas y relevantes para el rol.',
                    'Redacción clara y profesional.'
                ]
            }
        }
    },

    // =================================================================
    // --- ROL: SOPORTE NIVEL 1 ---
    // =================================================================
    {
        id: 'template-n1-01',
        topic: 'Atención al Cliente y Diagnóstico Básico para Soporte N1',
        role: 'Agente de Soporte Nivel 1',
        depth: 'Básico',
        course: {
            title: 'Ruta Esencial para Soporte Nivel 1 (Básico)',
            description: 'Conviértete en la primera línea de defensa de TELNET CO. Aprende a usar Splynx como un experto, a realizar diagnósticos básicos efectivos y a escalar casos al NOC con la información precisa.',
            modules: [
                {
                    moduleTitle: 'Módulo 1: Splynx, Tu Herramienta Principal',
                    learningObjectives: ['Identificar un cliente y sus servicios en Splynx', 'Crear un ticket de soporte completo y bien documentado'],
                    lessons: [
                        { 
                            lessonTitle: 'Navegando la Ficha del Cliente', 
                            initialContent: 'Tu primera acción al recibir una llamada es encontrar al cliente en **Splynx**. 🕵️‍♀️ Puedes buscar por nombre, cédula o dirección. La ficha del cliente es tu fuente de verdad: verás su plan contratado, estado del servicio (activo, bloqueado), y su historial de tickets. ¡Revisa siempre el historial antes de crear un ticket nuevo!', 
                            initialOptions: ['¿Qué significa "estado bloqueado"?', '¿Dónde veo su plan exacto?', 'Siguiente.'] 
                        },
                        { 
                            lessonTitle: 'Creando un Ticket Perfecto', 
                            initialContent: 'Un buen ticket le ahorra tiempo al NOC y soluciona el problema del cliente más rápido. Al crear un ticket o tarea en Splynx, sé lo más detallado posible. 📝 Incluye: **1. El problema reportado** por el cliente. **2. Las pruebas que ya realizaste** (reinicio de equipos, etc.). **3. El estado de las luces de la ONT**. Un ticket perfecto es tu mejor carta de presentación para el equipo técnico.', 
                            initialOptions: ['¿Qué es lo más importante en la descripción?', '¿A quién debo asignar el ticket?', 'Entendido.'] 
                        }
                    ],
                    quiz: [
                        { question: 'Tu herramienta principal para gestionar clientes y tickets es:', options: ['OLT Cloud', 'Zoho Clip', 'Splynx', 'Tu correo'], correctAnswer: 'Splynx' },
                        { question: 'Antes de crear un nuevo ticket, ¿qué deberías revisar en la ficha del cliente?', options: ['Su fecha de cumpleaños', 'El historial de tickets previos', 'Su color favorito', 'El modelo de su celular'], correctAnswer: 'El historial de tickets previos' },
                        { question: 'Si el estado de un cliente en Splynx es "bloqueado", usualmente se debe a:', options: ['Un problema técnico', 'Falta de pago', 'El cliente lo solicitó', 'Mantenimiento en la red'], correctAnswer: 'Falta de pago' },
                        { question: '¿Cuál de los siguientes elementos NO es esencial en un buen ticket?', options: ['Descripción detallada del problema', 'Pruebas básicas realizadas', 'Estado de las luces de la ONT', 'La opinión personal sobre el cliente'], correctAnswer: 'La opinión personal sobre el cliente' },
                        { question: 'Crear un ticket bien documentado ayuda principalmente a:', options: ['Cumplir una métrica personal', 'Hacer el proceso más lento', 'Que el NOC N2 pueda diagnosticar más rápido y eficientemente', 'Que el cliente pague su factura'], correctAnswer: 'Que el NOC N2 pueda diagnosticar más rápido y eficientemente' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 2: El Diagnóstico de Primer Nivel',
                    learningObjectives: ['Interpretar el significado de las luces principales de la ONT', 'Seguir un guion de diagnóstico básico con el cliente'],
                    lessons: [
                        { 
                            lessonTitle: 'Las Luces de la ONT Hablan', 
                            initialContent: 'La [searchable]ONT[/searchable] tiene luces que son como un semáforo. ¡Aprende a leerlas! 🚦\n- **Power:** Fija verde = OK. Apagada = No hay energía.\n- **PON:** Fija verde = Conectado a la red. Parpadeando = Intentando conectar. Apagada = No hay conexión.\n- **LOS:** Roja parpadeando o fija = ¡Alerta! Hay un problema de señal de fibra (cable roto, desconectado, etc.).\n- **LAN:** Fija o parpadeando = Hay un dispositivo conectado por cable.', 
                            initialOptions: ['¿Qué hago si la luz PON parpadea?', '¿Qué significa si LOS está en rojo?', 'Siguiente.'] 
                        },
                        { 
                            lessonTitle: 'El Guion de Diagnóstico Remoto', 
                            initialContent: 'Sigue siempre un orden lógico. **Paso 1: Reinicio.** Pide al cliente que desconecte la ONT y su router Wi-Fi de la corriente por 30 segundos. ¡Esto soluciona el 50% de los problemas! 🔌 **Paso 2: Verificación de Cables.** Pide que verifique que el cable verde de fibra esté bien conectado a la ONT y que los cables de red no estén sueltos. **Paso 3: Preguntar por las Luces.** Con la información que ya tienes, pregunta por el estado de las luces PON y LOS.', 
                            initialOptions: ['¿Qué hago si el reinicio no funciona?', '¿Por qué 30 segundos?', 'Entendido.'] 
                        }
                    ],
                    quiz: [
                        { question: 'Una luz "LOS" en rojo en la ONT indica un problema de:', options: ['Energía eléctrica', 'Señal de fibra óptica', 'Contraseña de Wi-Fi', 'Facturación'], correctAnswer: 'Señal de fibra óptica' },
                        { question: 'Si la luz "Power" de la ONT está apagada, lo primero que debes verificar es:', options: ['Si el cable de fibra está roto', 'Si la OLT está funcionando', 'Si la ONT está conectada a la corriente y el enchufe funciona', 'Si el cliente pagó la factura'], correctAnswer: 'Si la ONT está conectada a la corriente y el enchufe funciona' },
                        { question: 'El primer paso en el guion de diagnóstico remoto casi siempre es:', options: ['Preguntar por las luces', 'Crear el ticket', 'Pedir al cliente que reinicie sus equipos', 'Escalar al NOC'], correctAnswer: 'Pedir al cliente que reinicie sus equipos' },
                        { question: 'Una luz "PON" verde y fija en la ONT significa que:', options: ['Está conectada correctamente a la red de TELNET CO', 'No tiene señal de fibra', 'Está apagada', 'El Wi-Fi está fallando'], correctAnswer: 'Está conectada correctamente a la red de TELNET CO' },
                        { question: 'Si después de reiniciar y verificar cables la luz LOS sigue en rojo, es un indicativo de que debes:', options: ['Volver a pedir que reinicie', 'Cerrar el caso', 'Escalar el ticket al NOC con esa información', 'Pedirle al cliente que revise el poste'], correctAnswer: 'Escalar el ticket al NOC con esa información' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 3: El Arte de Escalar Correctamente',
                    learningObjectives: ['Identificar cuándo un problema supera el alcance de Nivel 1', 'Comprender la importancia de no hacer promesas que no se pueden cumplir'],
                    lessons: [
                        { 
                            lessonTitle: '¿Cuándo Escalar al NOC?', 
                            initialContent: 'Tu trabajo es resolver lo básico y filtrar. Debes escalar un caso al NOC N2 cuando: **1. El diagnóstico básico no resuelve el problema** (reinicio, cables OK). **2. Las luces de la ONT indican un problema físico** (LOS en rojo, PON parpadeando). **3. El cliente reporta un problema que afecta a varios vecinos** (posible falla masiva). No pierdas tiempo intentando resolver problemas de señal, ¡es el trabajo del NOC!', 
                            initialOptions: ['¿Qué no debo intentar resolver nunca?', '¿Cómo reporto una falla masiva?', 'Siguiente.'] 
                        },
                        { 
                            lessonTitle: 'Comunicación con el Cliente: Honestidad y Claridad', 
                            initialContent: 'Nunca le prometas al cliente un tiempo de solución exacto si no depende de ti. En su lugar, gestiona sus expectativas. Una buena frase es: "Gracias por la información. Veo que es un problema que requiere a nuestro equipo técnico de redes. Ya he creado el ticket con toda la información y ellos se encargarán. Le mantendremos informado." 🗣️ Esto es ser profesional y honesto.', 
                            initialOptions: ['¿Qué hago si el cliente exige un tiempo?', '¿Debo darle el número del NOC?', 'Entendido.'] 
                        }
                    ],
                    quiz: [
                        { question: 'Si la luz LOS de una ONT está en rojo, ¿qué debes hacer?', options: ['Intentar configurarla remotamente', 'Ignorar esa luz', 'Documentarlo en el ticket y escalarlo al NOC', 'Decirle al cliente que es normal'], correctAnswer: 'Documentarlo en el ticket y escalarlo al NOC' },
                        { question: '¿Cuál de las siguientes situaciones NO requiere escalar al NOC?', options: ['Luz LOS en rojo', 'El cliente olvidó su clave de Wi-Fi', 'Varios vecinos de la misma cuadra sin servicio', 'Luz PON parpadeando constantemente'], correctAnswer: 'El cliente olvidó su clave de Wi-Fi' },
                        { question: 'Al escalar un caso, es importante evitar:', options: ['Darle al cliente el número de ticket', 'Hacer promesas sobre tiempos de solución que no controlas', 'Explicarle al cliente el siguiente paso', 'Ser amable'], correctAnswer: 'Hacer promesas sobre tiempos de solución que no controlas' },
                        { question: 'Tu rol como Nivel 1 es:', options: ['Resolver todos los problemas técnicos de la red', 'Hacer diagnósticos de fibra con herramientas avanzadas', 'Ser el primer filtro, resolver problemas básicos y documentar bien los casos', 'Gestionar la facturación de los clientes'], correctAnswer: 'Ser el primer filtro, resolver problemas básicos y documentar bien los casos' },
                        { question: 'Una comunicación profesional con el cliente al momento de escalar demuestra el valor de:', options: ['Mejora Continua', 'Pasión por el Cliente', 'Trabajo en Equipo', 'Innovación'], correctAnswer: 'Pasión por el Cliente' }
                    ]
                }
            ],
            finalProject: {
                title: 'Simulación de Caso: Redacción de Ticket Maestro',
                description: 'Recibes una llamada. El cliente es "Juan Pérez", ID "12345". Reporta que no tiene internet desde hace una hora. Al guiarlo, te informa que la ONT tiene la luz de Power verde fija, la luz PON está apagada y la luz LOS parpadea en rojo. Ya reinició el equipo dos veces sin éxito. Tu tarea es redactar el texto completo que pondrías en el campo "Descripción" de un nuevo ticket en Splynx para escalar este caso al NOC N2. Sé lo más claro y completo posible.',
                evaluationCriteria: [
                    'Inclusión de todos los datos relevantes del cliente y el reporte.',
                    'Descripción precisa del estado de las luces de la ONT.',
                    'Mención de las pruebas básicas que ya se realizaron.',
                    'Redacción clara y profesional, lista para que el NOC pueda actuar.'
                ]
            }
        }
    },

    // =================================================================
    // --- ROL: ADMINISTRATIVO / FACTURACIÓN ---
    // =================================================================
    {
        id: 'template-admin-01',
        topic: 'Facturación y Gestión de Pagos con Splynx',
        role: 'Auxiliar Administrativo/a',
        depth: 'Básico',
        course: {
            title: 'Facturación y Pagos con Splynx (Básico)',
            description: 'Aprende los conceptos fundamentales de la facturación en Splynx, desde la generación de facturas hasta el registro de pagos y la gestión de clientes morosos.',
            modules: [
                {
                    moduleTitle: 'Módulo 1: El Ciclo de Facturación',
                    lessons: [
                        { lessonTitle: 'Generación de Facturas', initialContent: 'Splynx automatiza la generación de facturas al inicio de cada ciclo. 🧾 Aprenderás a verificar que todas las facturas se hayan generado correctamente y a entender los diferentes ítems que la componen (plan, servicios adicionales, etc.).', initialOptions: ['¿Cuándo se generan las facturas?', '¿Puedo generar una factura manual?', 'Siguiente.'] },
                        { lessonTitle: 'Registrando un Pago', initialContent: 'Cuando un cliente paga, ya sea en la oficina o por transferencia, debes registrar ese pago en Splynx. 💵 Es crucial asociar el pago a la factura correcta para que el sistema actualice el saldo del cliente y, si estaba bloqueado, lo reactive automáticamente.', initialOptions: ['¿Qué métodos de pago manejamos?', '¿Qué pasa si registro mal un pago?', 'Entendido.'] }
                    ],
                    quiz: [
                        { question: 'La generación de facturas en Splynx es un proceso mayormente:', options: ['Manual', 'Externo', 'Automático', 'Diario'], correctAnswer: 'Automático' },
                        { question: '¿Qué sucede cuando registras correctamente un pago para un cliente bloqueado?', options: ['Nada, debe llamar a soporte', 'El sistema lo reactiva automáticamente', 'Se le envía un correo de agradecimiento', 'Se le cobra un extra'], correctAnswer: 'El sistema lo reactiva automáticamente' },
                        { question: 'Es crucial asociar un pago a la...', options: ['Nota de crédito correcta', 'Factura correcta', 'Tarea correcta', 'Dirección correcta'], correctAnswer: 'Factura correcta' },
                        { question: 'El área de la empresa que se encarga de la gestión de pagos es:', options: ['NOC', 'Soporte N1', 'Administración/Facturación', 'Técnicos'], correctAnswer: 'Administración/Facturación' },
                        { question: 'El ciclo de facturación se refiere al:', options: ['Tiempo que tarda un pago en procesarse', 'Período recurrente en que se generan las facturas', 'Proceso de llamar a los clientes', 'Ciclo de vida de un ticket'], correctAnswer: 'Período recurrente en que se generan las facturas' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 2: Gestión de Cartera',
                    lessons: [
                        { lessonTitle: 'Identificando Clientes Morosos', initialContent: 'Splynx facilita la identificación de clientes con pagos vencidos. Aprenderás a generar reportes de cartera para ver quiénes están en mora y por cuánto tiempo. 📅 Esta es la base para el proceso de cobranza.', initialOptions: ['¿A los cuántos días se considera a un cliente en mora?', '¿El bloqueo es automático?', 'Siguiente.'] },
                        { lessonTitle: 'El Proceso de Bloqueo y Notificaciones', initialContent: 'El sistema está configurado para bloquear automáticamente a los clientes que exceden un límite de días de mora. 🚫 Antes del bloqueo, Splynx también puede enviar notificaciones automáticas de recordatorio de pago. Tu rol es supervisar este proceso y gestionar los casos excepcionales.', initialOptions: ['¿Puedo evitar que un cliente se bloquee?', '¿Qué es una nota de crédito?', 'Entendido.'] }
                    ],
                    quiz: [
                        { question: '¿Qué herramienta de Splynx se usa para ver los clientes con pagos vencidos?', options: ['El calendario', 'Los reportes de cartera', 'El mapa de clientes', 'El dashboard de tickets'], correctAnswer: 'Los reportes de cartera' },
                        { question: 'El bloqueo de clientes por falta de pago en Splynx es un proceso:', options: ['Manual que se hace cada día', 'Automático y configurable', 'Que realiza el NOC', 'Que no existe'], correctAnswer: 'Automático y configurable' },
                        { question: 'La gestión de clientes morosos se conoce como:', options: ['Gestión de tickets', 'Gestión de cartera', 'Gestión de proyectos', 'Gestión de red'], correctAnswer: 'Gestión de cartera' },
                        { question: 'Antes del bloqueo, el sistema puede enviar...', options: ['Un técnico a la casa', 'Notificaciones de recordatorio de pago', 'Un regalo al cliente', 'La factura del próximo mes'], correctAnswer: 'Notificaciones de recordatorio de pago' },
                        { question: 'Un documento que se usa para anular o corregir una factura es una:', options: ['Orden de compra', 'Nota de débito', 'Nota de crédito', 'Factura nueva'], correctAnswer: 'Nota de crédito' }
                    ]
                }
            ],
            finalProject: {
                title: 'Simulación de un Ciclo de Pago Completo',
                description: 'Describe en un texto el ciclo de vida de la facturación de un cliente ficticio durante un mes. Empieza con la generación de su factura, luego simula que no paga a tiempo, describe cómo lo identificarías como moroso, qué pasaría en el sistema (bloqueo), y finalmente, describe el proceso de registrar su pago tardío y lo que sucedería con su servicio después.',
                evaluationCriteria: [
                    'Descripción correcta de la secuencia del ciclo de facturación.',
                    'Uso correcto de la terminología (factura, mora, bloqueo, registro de pago).',
                    'Comprensión del impacto de las acciones de facturación en el servicio del cliente.'
                ]
            }
        }
    },

    // =================================================================
    // --- ROL: NOC (NIVEL 2) ---
    // =================================================================
    {
        id: 'template-n2-01',
        topic: 'Diagnóstico y Gestión de Red desde el NOC',
        role: 'Auxiliar NOC (Soporte Nivel 2)',
        depth: 'Avanzado',
        course: {
            title: 'Gestión Avanzada de Red para NOC (Avanzado)',
            description: 'Domina el diagnóstico remoto, la gestión de la infraestructura GPON y MikroTik, y los protocolos de incidentes masivos desde el NOC.',
            modules: [
                {
                    moduleTitle: 'Módulo 1: La Interfaz del NOC: Splynx y OLT Cloud',
                    lessons: [
                        { lessonTitle: 'Análisis de Tickets desde Splynx', initialContent: 'Un ticket escalado en **Splynx** es tu punto de partida. 🕵️‍♂️ Antes de saltar a OLT Cloud, revisa el ticket: ¿qué luces de la ONT reportó el N1? ¿Qué pruebas ya se hicieron? La calidad del ticket te dirá si necesitas pedir más información al N1 o si ya puedes empezar a diagnosticar.', initialOptions: ['¿Qué hago si un ticket es muy vago?', '¿Cuál es la primera herramienta que debo abrir?', 'Continuar.'] },
                        { lessonTitle: 'Interpretando el Dashboard de OLT Cloud', initialContent: 'Tu primera vista en **OLT Cloud** es el [searchable]Dashboard[/searchable]. Te da un resumen vital: 📈 **Totales de ONUs** (Online, Offline, Loss, etc.) y dos gráficos clave: **ONUs por Nivel de Señal** y **ONUs por Estado**. Si un cliente llama, pero ves en el dashboard que hay muchas ONUs en estado "LOSS" en su misma zona, el problema probablemente sea masivo.', initialOptions: ['¿Qué significa la categoría "Crítico" en señal?', '¿Qué diferencia hay entre "Sin Energía" y "LOSS"?', '¿Qué otra información útil hay en el dashboard?'] },
                        { lessonTitle: 'Búsqueda y Diagnóstico de una ONU', initialContent: 'Usa la barra de "Consulta Rápida" en OLT Cloud para buscar una ONU por nombre o serial. La pantalla de detalles te dará el 80% del diagnóstico: ¿Está `online` u `offline`? ¿Cuál es su `Rx Power` (potencia de señal)? ¿Cuánto tiempo lleva encendida (`uptime`)? ¿Cuál fue la `razón de su última desconexión` (ej: `Dying Gasp` indica un corte de energía)?', initialOptions: ['¿Qué es un buen Rx Power?', '¿Qué es "Dying Gasp"?', '¿Qué hago si está offline por "LOSi"?'] }
                    ],
                    quiz: [
                        { question: '¿Cuál es tu principal fuente de información inicial para un caso escalado?', options: ['Llamar al cliente directamente', 'El ticket creado por Nivel 1 en Splynx', 'Preguntarle a un compañero', 'Buscar en Google'], correctAnswer: 'El ticket creado por Nivel 1 en Splynx' },
                        { question: 'La herramienta para verificar si la ONT de un cliente está online y su nivel de señal es:', options: ['Winbox', 'Splynx', 'OLT Cloud', 'Zoho Clip'], correctAnswer: 'OLT Cloud' },
                        { question: 'En OLT Cloud, una razón de desconexión "Dying Gasp" generalmente significa:', options: ['Corte de fibra', 'Problema de software en la OLT', 'Corte de energía en la casa del cliente', 'La ONT está dañada'], correctAnswer: 'Corte de energía en la casa del cliente' },
                        { question: 'Si ves en el dashboard de OLT Cloud que muchas ONUs de un mismo PON están en estado "LOSS", es probable que sea un...', options: ['Problema individual de un cliente', 'Problema masivo en la red (ej. corte de fibra troncal)', 'Error de facturación', 'Ataque de virus'], correctAnswer: 'Problema masivo en la red (ej. corte de fibra troncal)' },
                        { question: 'Un nivel de señal "Crítico" en el dashboard de OLT Cloud típicamente corresponde a valores de Rx Power...', options: ['Menores a -27 dBm', 'Entre -15 y -20 dBm', 'Mayores a -15 dBm', 'Alrededor de -22 dBm'], correctAnswer: 'Menores a -27 dBm' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 2: Gestión y Provisión en OLT Cloud',
                    lessons: [
                        { lessonTitle: 'Autorizando una Nueva ONU', initialContent: 'Cuando un técnico en campo te pasa el SN de una nueva ONT, vas a la sección de tu OLT en OLT Cloud, seleccionas el puerto PON correcto y buscas las ONUs no autorizadas. 💻 Con un clic, puedes **autorizarla**, asignándole un nombre descriptivo, el cliente desde Splynx y el **perfil de velocidad** correcto. ¡Mucho más fácil que por comandos!', initialOptions: ['¿Qué es un perfil de velocidad?', '¿Qué pasa si me equivoco de puerto PON?', '¿Puedo ver las coordenadas del cliente aquí?'] },
                        { lessonTitle: 'Manejo de Inventario: NAPs y Clientes', initialContent: 'OLT Cloud no solo gestiona equipos activos, sino también el inventario de la red pasiva. 🗺️ Puedes ver la **ocupación de cada puerto PON** y la **ocupación de cada Caja NAP**. Es crucial para saber dónde hay puertos disponibles para nuevos clientes. Además, el sistema almacena las coordenadas de NAPs y clientes, permitiendo verlos en un mapa.', initialOptions: ['¿Por qué es importante la ocupación de la NAP?', '¿Cómo ayuda esto en el diagnóstico?', 'Siguiente.'] }
                    ],
                    quiz: [
                        { question: '¿Dónde se gestionan los perfiles de velocidad (ancho de banda) de los clientes?', options: ['En Splynx', 'En el router del cliente', 'En OLT Cloud', 'En Winbox'], correctAnswer: 'En OLT Cloud' },
                        { question: 'Para autorizar una nueva ONT, ¿qué dato es indispensable?', options: ['La cédula del cliente', 'El número de serie (SN) de la ONT', 'La dirección IP', 'La MAC del router'], correctAnswer: 'El número de serie (SN) de la ONT' },
                        { question: '¿Qué información de inventario se puede consultar en OLT Cloud?', options: ['La cantidad de routers en stock', 'La ocupación y coordenadas de las Cajas NAP', 'El inventario de cables de red', 'Las herramientas de los técnicos'], correctAnswer: 'La ocupación y coordenadas de las Cajas NAP' },
                        { question: 'Verificar la ocupación de un puerto PON es importante para:', options: ['Saber cuánto se le cobra al cliente', 'Determinar si se pueden instalar más clientes en esa zona', 'Ver la velocidad de internet', 'Reiniciar la OLT'], correctAnswer: 'Determinar si se pueden instalar más clientes en esa zona' },
                        { question: 'El proceso de registrar una nueva ONT en el sistema se llama:', options: ['Diagnóstico', 'Monitoreo', 'Autorización o provisión', 'Facturación'], correctAnswer: 'Autorización o provisión' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 3: Comandos CLI Básicos en OLT Huawei',
                    learningObjectives: ['Ejecutar comandos básicos de diagnóstico en la OLT', 'Interpretar la salida de los comandos más comunes'],
                    lessons: [
                        { lessonTitle: 'Conexión y Comandos Esenciales', initialContent: 'Aunque OLT Cloud es potente, a veces necesitas ir a la **Línea de Comandos (CLI)** de la OLT para diagnósticos profundos. 💻 El comando `display ont info by-sn [SERIAL]` es tu mejor amigo para ver información detallada de una ONT que OLT Cloud no muestra.', initialOptions: ['¿Cómo me conecto a la CLI?', '¿Qué otros comandos son útiles?', '¿Qué es el modo "enable"?'] },
                        { lessonTitle: 'Interpretando la Salida de Comandos', initialContent: 'La salida de un comando como `display port state [PORT_ID]` te muestra el estado físico y lógico de un puerto PON. 📊 Aprender a leer si un puerto está `active` y cuántas ONUs están `online` es crucial para diagnosticar problemas a nivel de puerto.', initialOptions: ['¿Qué significa "LOSi"?', '¿Cómo veo la potencia de una ONT por CLI?', 'Siguiente.'] }
                    ],
                    quiz: [
                        { question: 'El comando para ver información detallada de una ONT por su serial en la CLI de Huawei es:', options: ['show ont info', 'display ont info by-sn', 'get ont status', 'list ont serial'], correctAnswer: 'display ont info by-sn' },
                        { question: 'Para acceder a comandos de configuración en la CLI, primero debes entrar al modo:', options: ['Config', 'Admin', 'Enable', 'Super'], correctAnswer: 'Enable' },
                        { question: '¿Para qué sirve el comando `display port state`?', options: ['Para ver la configuración de la ONT', 'Para ver el estado de un puerto PON en la OLT', 'Para mostrar todos los clientes', 'Para reiniciar un puerto'], correctAnswer: 'Para ver el estado de un puerto PON en la OLT' },
                        { question: 'Si la CLI es necesaria, significa que el problema es probablemente...', options: ['Simple y fácil de resolver', 'Un problema del cliente', 'Complejo y requiere un análisis profundo', 'Un error de facturación'], correctAnswer: 'Complejo y requiere un análisis profundo' },
                        { question: 'La sigla "LOSi" en la CLI indica:', options: ['Pérdida de señal', 'ONT online', 'Puerto activo', 'Error de configuración'], correctAnswer: 'Pérdida de señal' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 4: Gestión de Incidentes Masivos',
                    learningObjectives: ['Identificar proactivamente una falla masiva', 'Seguir el protocolo de comunicación y gestión de incidentes'],
                    lessons: [
                        { lessonTitle: 'Detectando el Problema Antes que el Cliente', initialContent: 'Una de tus funciones más importantes es ser proactivo. 🧐 Si ves en OLT Cloud que todas las ONUs de un puerto PON se caen al mismo tiempo, ¡tienes una falla masiva! Debes actuar **antes** de que empiecen a llamar los clientes.', initialOptions: ['¿Cuáles son los indicadores de una falla masiva?', '¿Qué puede causar una falla masiva?', '¿Cuál es mi primer paso?'] },
                        { lessonTitle: 'Protocolo de Incidente Masivo', initialContent: 'El protocolo es: 1. **Verificar y Confirmar:** Asegúrate de que es una falla real. 2. **Crear Ticket Maestro:** Crea un único ticket en Splynx que describa la falla. 3. **Comunicar:** Informa a Nivel 1 para que usen un discurso unificado y al Nivel 3 si se requiere su intervención. 4. **Documentar:** Actualiza el ticket maestro con cada avance hasta la resolución.', initialOptions: ['¿Qué es un discurso unificado?', '¿Cómo se asigna la prioridad?', '¿Cuándo se cierra el ticket maestro?'] }
                    ],
                    quiz: [
                        { question: '¿Cuál es el principal indicador de una falla masiva en OLT Cloud?', options: ['Un solo cliente se queja', 'Múltiples ONUs de la misma zona/PON se desconectan simultáneamente', 'La plataforma se pone lenta', 'Recibes un correo de alerta'], correctAnswer: 'Múltiples ONUs de la misma zona/PON se desconectan simultáneamente' },
                        { question: 'Ante una falla masiva, ¿qué se hace en Splynx?', options: ['Se crea un ticket por cada cliente afectado', 'No se hace nada en Splynx', 'Se crea un único ticket maestro para el incidente', 'Se cierra Splynx para evitar más tickets'], correctAnswer: 'Se crea un único ticket maestro para el incidente' },
                        { question: 'El primer paso al detectar una posible falla masiva es:', options: ['Llamar a todos los clientes', 'Reiniciar la OLT', 'Verificar y confirmar que la falla es real', 'Salir a almorzar'], correctAnswer: 'Verificar y confirmar que la falla es real' },
                        { question: '¿Por qué es importante comunicar la falla a Nivel 1?', options: ['Para que no contesten el teléfono', 'Para que puedan informar a los clientes de manera consistente', 'Para que creen más tickets', 'No es importante'], correctAnswer: 'Para que puedan informar a los clientes de manera consistente' },
                        { question: 'La documentación de un incidente masivo se centraliza en:', options: ['El chat de Zoho Clip', 'Múltiples tickets pequeños', 'El ticket maestro en Splynx', 'Un archivo de Excel'], correctAnswer: 'El ticket maestro en Splynx' }
                    ]
                }
            ],
            finalProject: {
                title: 'Resolución de Caso Completo: Cliente Offline',
                description: 'Un ticket escalado en Splynx indica "Cliente sin internet, ya reinició y la luz PON de la ONT parpadea". Describe tu proceso de diagnóstico remoto completo usando OLT Cloud: 1. ¿Qué información clave buscarías primero en el dashboard y luego en la ficha del cliente? 2. Simula que encuentras un `Rx Power` de `-30.50 dBm`. ¿Cuál es tu diagnóstico? 3. Basado en ese diagnóstico, redacta el texto que pondrías en el ticket de Splynx para asignarlo a un técnico de campo.',
                evaluationCriteria: [
                    'Identificación correcta de los primeros pasos de diagnóstico en OLT Cloud.',
                    'Diagnóstico preciso del problema basándose en la información de potencia óptica.',
                    'Redacción de una asignación a técnico en Splynx que sea clara, concisa y orientada a la acción.'
                ]
            }
        }
    },
    {
        id: 'template-n2-02',
        topic: 'Gestión de Routers MikroTik con Winbox',
        role: 'Auxiliar NOC (Soporte Nivel 2)',
        depth: 'Intermedio',
        course: {
            title: 'Gestión de Routers MikroTik con Winbox (Intermedio)',
            description: 'Domina la herramienta esencial para la gestión de la red. Aprende a conectarte, configurar y diagnosticar routers MikroTik usando Winbox, resolviendo problemas de conectividad de clientes de manera eficiente.',
            modules: [
                {
                    moduleTitle: 'Módulo 1: Conexión y Navegación en Winbox',
                    learningObjectives: ['Conectar a un router MikroTik usando Winbox por MAC y por IP', 'Navegar e identificar las secciones principales de la interfaz de RouterOS'],
                    lessons: [
                        {
                            lessonTitle: 'Tu Primera Conexión con Winbox',
                            initialContent: '**Winbox** es tu navaja suiza para configurar cualquier equipo MikroTik. ⚙️ Al abrirlo, en la pestaña `Neighbors`, verás una lista de todos los dispositivos MikroTik en tu red. Puedes conectarte de dos formas: **1. Por MAC Address:** Ideal para equipos nuevos sin configuración de IP. ¡Siempre funciona! **2. Por IP Address:** El método estándar una vez que el equipo ya está en la red. El usuario por defecto es `admin` y la contraseña está en blanco.',
                            initialOptions: ['¿Qué es la MAC Address?', '¿Por qué la contraseña está en blanco?', '¿Qué hago si no aparece en Neighbors?']
                        },
                        {
                            lessonTitle: 'Recorriendo la Interfaz de RouterOS',
                            initialContent: 'La interfaz de [searchable]Winbox[/searchable] puede parecer abrumadora, pero es muy lógica. A la izquierda tienes el menú principal. Las secciones que más usarás son: **`Interfaces`** (para ver los puertos físicos y virtuales), **`IP`** (para todo lo relacionado con direccionamiento: Addresses, DHCP, Firewall, Routes), y **`Queues`** (para la configuración de control de ancho de banda).',
                            initialOptions: ['¿Para qué sirve la sección "System"?', '¿Qué es una "Queue"?', 'Siguiente tema.']
                        }
                    ],
                    quiz: [
                        { question: '¿Cuál es el método de conexión a Winbox que funciona incluso si el router no tiene IP?', options: ['Por IP Address', 'Por MAC Address', 'Por Telnet', 'Por SSH'], correctAnswer: 'Por MAC Address' },
                        { question: 'El usuario por defecto en un router MikroTik nuevo es:', options: ['root', 'administrator', 'admin', 'user'], correctAnswer: 'admin' },
                        { question: '¿En qué sección del menú de Winbox configurarías una dirección IP?', options: ['Interfaces', 'System', 'Routing', 'IP'], correctAnswer: 'IP' },
                        { question: 'La herramienta para configurar el control de ancho de banda en MikroTik se encuentra en:', options: ['Files', 'Queues', 'Tools', 'IP -> Firewall'], correctAnswer: 'Queues' },
                        { question: 'La pestaña `Neighbors` en Winbox sirve para:', options: ['Ver a los clientes en un mapa', 'Descubrir automáticamente otros dispositivos MikroTik en la red', 'Chatear con otros técnicos', 'Configurar el Wi-Fi'], correctAnswer: 'Descubrir automáticamente otros dispositivos MikroTik en la red' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 2: Configuración Esencial para Clientes',
                    learningObjectives: ['Verificar y configurar un servidor DHCP', 'Comprender y verificar la regla de NAT (masquerade)'],
                    lessons: [
                        {
                            lessonTitle: 'El Servidor DHCP: Repartiendo IPs',
                            initialContent: 'Cuando un cliente conecta su celular o PC, necesita una dirección IP para navegar. El **Servidor DHCP** del router MikroTik se encarga de esto automáticamente. En Winbox, vas a `IP -> DHCP Server`. Aquí puedes verificar que el servidor esté corriendo, ver qué IPs ha entregado (`Leases`) y asegurarte de que el rango de IPs (`Pool`) sea correcto para la red del cliente.',
                            initialOptions: ['¿Qué es un "lease time"?', '¿Puedo asignar una IP fija a un dispositivo?', 'Siguiente.']
                        },
                        {
                            lessonTitle: 'NAT: La Puerta de Salida a Internet',
                            initialContent: 'La red del cliente usa IPs privadas (ej. `192.168.88.0/24`). Para que puedan salir a Internet, el router debe "traducir" esas IPs a la IP pública que le damos nosotros. Esto es **NAT (Network Address Translation)**. 🌐 En MikroTik, se configura en `IP -> Firewall -> NAT`. La regla más importante es una con `chain=srcnat` y `action=masquerade`. Si esta regla falta o está mal, el cliente tendrá conexión local pero no podrá navegar.',
                            initialOptions: ['¿Qué son las IPs privadas?', '¿Por qué se llama "masquerade"?', '¿Qué otra cosa se configura en el Firewall?']
                        }
                    ],
                    quiz: [
                        { question: 'El servicio que asigna automáticamente direcciones IP a los dispositivos de una red es:', options: ['DNS', 'NTP', 'DHCP', 'NAT'], correctAnswer: 'DHCP' },
                        { question: '¿En qué sección de Winbox se configura el NAT?', options: ['IP -> DHCP Server', 'Interfaces', 'IP -> Firewall', 'System -> Scripts'], correctAnswer: 'IP -> Firewall' },
                        { question: 'La acción de NAT que traduce las IPs privadas a la IP pública del router es:', options: ['drop', 'accept', 'redirect', 'masquerade'], correctAnswer: 'masquerade' },
                        { question: 'En la pestaña "Leases" del DHCP Server, puedes ver:', options: ['Las contraseñas de los clientes', 'Los dispositivos que han recibido una IP del router', 'Las páginas web que visita el cliente', 'La velocidad de la conexión'], correctAnswer: 'Los dispositivos que han recibido una IP del router' },
                        { question: 'Si un cliente puede acceder a su impresora en red pero no a Google, el problema podría estar en:', options: ['El cable de red de la impresora', 'El servidor DHCP', 'La regla de NAT (masquerade)', 'La señal de la ONT'], correctAnswer: 'La regla de NAT (masquerade)' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 3: Diagnóstico de Problemas de Conectividad',
                    learningObjectives: ['Utilizar las herramientas Ping y Traceroute desde Winbox', 'Analizar tráfico en tiempo real con la herramienta Torch'],
                    lessons: [
                        {
                            lessonTitle: 'Herramientas Básicas: Ping y Traceroute',
                            initialContent: 'Winbox tiene herramientas de diagnóstico integradas en el menú `Tools`. **Ping** te sirve para comprobar si hay conectividad con otro equipo (ej. `ping 8.8.8.8`). **Traceroute** te muestra la ruta (los "saltos") que siguen los paquetes para llegar a un destino. Es muy útil para ver en qué punto de la red se está perdiendo la conexión.',
                            initialOptions: ['¿Qué significa un "ping" alto?', '¿Qué me dice un Traceroute que no termina?', 'Siguiente.']
                        },
                        {
                            lessonTitle: 'Torch: Espiando el Tráfico en Tiempo Real',
                            initialContent: '**Torch** es una de las herramientas más potentes de MikroTik. Te permite ver en tiempo real todo el tráfico que está pasando por una interfaz. 🔎 Puedes ver las IPs de origen y destino, los puertos y el consumo de ancho de banda. Es la herramienta definitiva para responder a la pregunta: "¿Por qué el internet está lento?". ¡Puedes ver si un dispositivo específico está consumiendo todo el ancho de banda!',
                            initialOptions: ['¿Necesito alguna configuración especial para usar Torch?', '¿Puedo filtrar el tráfico en Torch?', 'Entendido, ¡a diagnosticar!']
                        }
                    ],
                    quiz: [
                        { question: 'Para verificar si tienes conectividad básica con los servidores de Google, usarías la herramienta:', options: ['Torch', 'Ping a 8.8.8.8', 'DHCP Server', 'NAT'], correctAnswer: 'Ping a 8.8.8.8' },
                        { question: 'La herramienta que te muestra la ruta completa y los saltos hasta un destino es:', options: ['Ping', 'Torch', 'Traceroute', 'Bandwidth Test'], correctAnswer: 'Traceroute' },
                        { question: 'Para ver en tiempo real qué dispositivo está consumiendo más ancho de banda en la red de un cliente, usarías:', options: ['Torch', 'Ping', 'Log', 'Scheduler'], correctAnswer: 'Torch' },
                        { question: 'Un tiempo de respuesta alto en un "ping" (ej. 200ms) indica una alta:', options: ['Velocidad', 'Ancho de banda', 'Latencia', 'Seguridad'], correctAnswer: 'Latencia' },
                        { question: 'Las herramientas de diagnóstico como Ping, Traceroute y Torch se encuentran en el menú:', options: ['IP', 'Interfaces', 'System', 'Tools'], correctAnswer: 'Tools' }
                    ]
                }
            ],
            finalProject: {
                title: 'Simulación: Diagnóstico de Cliente sin Navegación',
                description: 'Un cliente, cuya ONT está online con buena señal, reporta que ningún dispositivo en su casa puede navegar. Sospechas que el problema está en su router MikroTik. Describe, paso a paso, tu proceso de diagnóstico usando Winbox. Menciona al menos 3 herramientas (ej. Ping, DHCP Leases, Torch, etc.) que usarías, en qué orden y qué información clave buscarías en cada una para encontrar la causa raíz del problema.',
                evaluationCriteria: [
                    'Descripción de un proceso de diagnóstico lógico y secuencial.',
                    'Uso correcto de las herramientas de diagnóstico de RouterOS.',
                    'Capacidad para formular hipótesis sobre la causa del problema basándose en posibles hallazgos.',
                    'Claridad y precisión en la explicación técnica.'
                ]
            }
        }
    },
    
    // =================================================================
    // --- ROL: INGENIERO DE RED (NIVEL 3) ---
    // =================================================================
    {
        id: 'template-n3-01',
        topic: 'Gestión Avanzada y Optimización de OLTs GPON',
        role: 'Ingeniero de Red (Nivel 3)',
        depth: 'Avanzado',
        course: {
            title: 'Gestión Avanzada y Optimización de OLTs (Nivel 3)',
            description: 'Profundiza en la configuración de bajo nivel de las OLTs, la optimización del rendimiento a través de perfiles de QoS y la implementación de políticas de seguridad avanzadas en la red GPON.',
            modules: [
                {
                    moduleTitle: 'Módulo 1: Configuración Fina de Servicios y VLANs',
                    learningObjectives: ['Configurar la segmentación de tráfico mediante VLANs en la OLT', 'Crear y aplicar perfiles de QoS avanzados para priorizar servicios'],
                    lessons: [
                        { lessonTitle: 'Segmentación de Red con VLANs en la OLT', initialContent: 'Como N3, tu rol es diseñar la segmentación de la red. En la OLT, usamos VLANs para separar lógicamente diferentes tipos de tráfico: una VLAN para la gestión de equipos (ej. VLAN 10), otra para los datos de clientes (ej. VLAN 100), y otra para servicios especiales como IPTV (ej. VLAN 200). Esto se logra configurando los puertos UPLINK de la OLT como **puertos trunk** y asociando los servicios de las ONTs a VLANs específicas. ⚙️', initialOptions: ['¿Qué es un puerto "trunk"?', '¿Cómo se asigna una VLAN a un servicio de ONT?', 'Ventajas de la segmentación.'] },
                        { lessonTitle: 'Calidad de Servicio (QoS) Avanzada', initialContent: 'Más allá de los perfiles de velocidad, puedes crear perfiles de QoS a bajo nivel. Esto implica definir **T-CONTs** específicos para priorizar tráfico sensible a la latencia (como VoIP o Gaming) y configurar **GEM Ports** con marcados de prioridad (802.1p). En la CLI de la OLT, puedes crear un `traffic-table` que clasifique el tráfico por IP o puerto y le asigne una prioridad mayor. ⚡️', initialOptions: ['¿Qué es el marcado 802.1p?', 'Ejemplo de un `traffic-table`', '¿Cómo afecta esto al cliente?'] }
                    ],
                    quiz: [
                        { question: '¿Para qué se utilizan las VLANs en la OLT?', options: ['Para aumentar la velocidad de todos', 'Para segmentar y aislar diferentes tipos de tráfico', 'Para bloquear clientes', 'Para asignar IPs públicas'], correctAnswer: 'Para segmentar y aislar diferentes tipos de tráfico' },
                        { question: 'Un puerto que permite el paso de múltiples VLANs etiquetadas se conoce como:', options: ['Puerto de acceso', 'Puerto bridge', 'Puerto trunk', 'Puerto de consola'], correctAnswer: 'Puerto trunk' },
                        { question: 'La configuración que permite priorizar cierto tipo de tráfico (ej. VoIP) se llama:', options: ['VLAN', 'QoS (Calidad de Servicio)', 'DHCP', 'NAT'], correctAnswer: 'QoS (Calidad de Servicio)' },
                        { question: 'Para la priorización de tráfico en GPON, se utilizan principalmente:', options: ['Los splitters', 'Las ONTs', 'Los T-CONTs y GEM Ports', 'Las Cajas NAP'], correctAnswer: 'Los T-CONTs y GEM Ports' },
                        { question: 'El estándar para el marcado de prioridad a nivel de trama Ethernet es:', options: ['802.11ac', '802.3ad', '802.1p', '802.1Q'], correctAnswer: '802.1p' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 2: Diseño y Planificación de Capacidad GPON',
                    learningObjectives: ['Calcular el presupuesto de potencia óptica para nuevos despliegues', 'Evaluar estrategias de splitteo para la expansión de la red'],
                    lessons: [
                        { lessonTitle: 'Cálculo del Presupuesto de Potencia Óptica', initialContent: 'Al diseñar un nuevo segmento de red, debes asegurarte de que la señal llegue con suficiente potencia. Esto se hace con un **cálculo de presupuesto de potencia**. La fórmula es: `Potencia de Salida OLT - (Pérdida_Fibra + Pérdida_Splitters + Pérdida_Conectores + Pérdida_Empalmes) = Potencia en ONT`. 📊 Debes usar los valores de atenuación estándar para cada componente.', initialOptions: ['¿Atenuación por km de fibra?', '¿Pérdida de un splitter 1:8?', '¿Qué es el "margen de seguridad"?'] },
                        { lessonTitle: 'Estrategias de Splitteo y Crecimiento', initialContent: 'Existen dos arquitecturas principales: **Splitteo Centralizado**, donde un único splitter de alta capacidad (ej. 1:64) en la central sirve a toda una zona; y **Splitteo en Cascada (o distribuido)**, donde se usan múltiples splitters de menor capacidad en serie (ej. un 1:8 en un poste que alimenta a otros 1:8 en cajas NAP). Usando los datos de ocupación de OLT Cloud, puedes planificar dónde y cómo expandir la red de manera eficiente. 🗺️', initialOptions: ['Ventajas del splitteo centralizado', 'Ventajas del splitteo en cascada', '¿Cómo afecta esto al presupuesto de potencia?'] }
                    ],
                    quiz: [
                        { question: 'El cálculo para asegurar que la señal llegue correctamente a la ONT se llama:', options: ['Análisis de tráfico', 'Presupuesto de potencia óptica', 'Inventario de red', 'Cálculo de ancho de banda'], correctAnswer: 'Presupuesto de potencia óptica' },
                        { question: '¿Cuál de estos componentes introduce MÁS pérdida de señal?', options: ['1 km de fibra', 'Un empalme por fusión', 'Un splitter 1:16', 'Un conector SC/APC'], correctAnswer: 'Un splitter 1:16' },
                        { question: 'Una arquitectura con un único splitter de gran capacidad en la central se llama:', options: ['Splitteo en cascada', 'Splitteo distribuido', 'Splitteo centralizado', 'Splitteo desbalanceado'], correctAnswer: 'Splitteo centralizado' },
                        { question: '¿Qué herramienta de TELNET CO es crucial para la planificación de capacidad?', options: ['Splynx', 'Los datos de ocupación de NAPs en OLT Cloud', 'Winbox', 'Zoho Clip'], correctAnswer: 'Los datos de ocupación de NAPs en OLT Cloud' },
                        { question: 'Un "margen de seguridad" en el presupuesto de potencia sirve para:', options: ['Gastar más dinero', 'Compensar futuras degradaciones o reparaciones en la fibra', 'Aumentar la velocidad del cliente', 'No tiene un propósito real'], correctAnswer: 'Compensar futuras degradaciones o reparaciones en la fibra' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 3: Diagnóstico Avanzado de Problemas de Red',
                    learningObjectives: ['Interpretar trazas de OTDR para fallas no evidentes', 'Identificar y aislar el impacto de una ONT "ruidosa" (Rogue ONT)'],
                    lessons: [
                        { lessonTitle: 'Interpretación de Trazas OTDR para Degradación', initialContent: 'Como N3, no solo buscas roturas. Debes interpretar eventos sutiles en una traza de OTDR. Una fusión con una pérdida de 0.5dB puede no cortar el servicio, pero sí causar una alta tasa de errores de bit (BER) y degradar la calidad. Debes ser capaz de identificar estos "eventos no conformes" y ordenar su reparación para mantener la salud de la red. 📈', initialOptions: ['¿Qué es la Tasa de Errores de Bit (BER)?', 'Ver una [searchable]traza OTDR con fusión mala[/searchable]', '¿Qué es un evento "gainer"?'] },
                        { lessonTitle: 'Cazando "ONTs Ruidosas" (Rogue ONTs)', initialContent: 'Una **Rogue ONT** es una ONT defectuosa que transmite luz cuando no le corresponde, interfiriendo con la señal de subida de todas las demás ONTs en el mismo puerto PON. Los síntomas son: latencia alta, pérdida de paquetes o cortes intermitentes para **todos** los clientes de un PON. Se detecta con comandos específicos en la CLI de la OLT, como `display ont rogue-info`, y la solución es identificar y desconectar físicamente la ONT defectuosa. 🔫', initialOptions: ['¿Por qué una ONT se vuelve "Rogue"?', '¿OLT Cloud puede detectar esto?', '¿Qué hago una vez identificada?'] }
                    ],
                    quiz: [
                        { question: 'Una alta Tasa de Errores de Bit (BER) puede ser causada por:', options: ['Una fusión perfecta', 'Un conector limpio', 'Una fusión con alta pérdida o un conector sucio', 'Exceso de ancho de banda'], correctAnswer: 'Una fusión con alta pérdida o un conector sucio' },
                        { question: 'El principal síntoma de una Rogue ONT es que:', options: ['Un solo cliente no tiene internet', 'Afecta de forma intermitente a todos los clientes de un puerto PON', 'La OLT se apaga', 'Aumenta la velocidad de internet'], correctAnswer: 'Afecta de forma intermitente a todos los clientes de un puerto PON' },
                        { question: 'La herramienta definitiva para medir la pérdida de un empalme específico a 10km de distancia es:', options: ['Un Power Meter en la casa del cliente', 'Un VFL', 'Un OTDR', 'OLT Cloud'], correctAnswer: 'Un OTDR' },
                        { question: 'Una Rogue ONT es una falla en la señal de:', options: ['Bajada (downstream)', 'Subida (upstream)', 'Ambas', 'No es una falla de señal'], correctAnswer: 'Subida (upstream)' },
                        { question: 'La solución definitiva para una Rogue ONT es:', options: ['Reiniciar la OLT', 'Aumentar la potencia del láser', 'Identificar y desconectar físicamente la ONT defectuosa', 'Cambiar el splitter'], correctAnswer: 'Identificar y desconectar físicamente la ONT defectuosa' }
                    ]
                }
            ],
            finalProject: {
                title: 'Análisis y Plan de Optimización de un Puerto PON',
                description: 'Se te presenta un caso: un puerto PON con 45 clientes presenta una alta latencia y pérdida de paquetes en horas pico. Los niveles de señal promedio en OLT Cloud son aceptables (-22 dBm). Presenta un plan de diagnóstico y optimización detallado. Debes incluir: 1. Los primeros comandos CLI que ejecutarías en la OLT para investigar. 2. Las métricas avanzadas (ej. uso de ancho de banda, errores) que revisarías en OLT Cloud. 3. Una hipótesis sobre la posible causa (ej. congestión, Rogue ONT, problema de QoS). 4. Un plan de acción con los cambios a implementar (ej. modificación de perfiles de QoS, plan para encontrar una posible Rogue ONT). 5. Un borrador de comunicado técnico para el NOC N2 explicando el problema y el plan.',
                evaluationCriteria: [
                    'Metodología de diagnóstico estructurada y lógica.',
                    'Profundidad en el análisis de las posibles causas raíz.',
                    'Soluciones propuestas que sean prácticas y aplicables en el entorno de TELNET CO.',
                    'Claridad en la comunicación técnica del plan de acción.'
                ]
            }
        }
    },
    {
        id: 'template-n3-02',
        topic: 'Optimización, Seguridad y Protocolos Avanzados en Redes GPON',
        role: 'Ingeniero de Red (Nivel 3)',
        depth: 'Avanzado',
        course: {
            title: 'GPON: Optimización y Seguridad de Red (Nivel 3 Avanzado)',
            description: 'Un curso de especialización para ingenieros de red, enfocado en el balanceo de carga proactivo, la seguridad de la capa de acceso y la integración de servicios avanzados en la plataforma GPON.',
            modules: [
                {
                    moduleTitle: 'Módulo 1: Optimización de Rendimiento y Balanceo de Carga',
                    learningObjectives: ['Identificar puertos PON saturados y planificar la migración de clientes', 'Crear y aplicar perfiles de Ancho de Banda Dinámico (DBA) para mitigar congestión'],
                    lessons: [
                        { 
                            lessonTitle: 'Análisis y Balanceo de Carga en Puertos PON', 
                            initialContent: 'Un puerto PON es un recurso compartido. Con el tiempo, algunos puertos pueden saturarse de clientes o de tráfico, mientras otros están subutilizados. Tu misión es ser un arquitecto del balance. ⚖️ Usando OLT Cloud y la CLI (`display port info [port_id]`), debes identificar los puertos con alta ocupación (>80%) o con tasas de tráfico pico sostenidas. La solución es un **balanceo de carga**: mover estratégicamente algunas ONTs a un puerto PON con menor carga en la misma OLT o en una OLT adyacente.', 
                            initialOptions: ['¿Cuál es el proceso para mover una ONT?', '¿Esto implica una visita técnica?', 'Siguiente.'] 
                        },
                        { 
                            lessonTitle: 'Perfiles de Ancho de Banda Dinámico (DBA) Avanzados', 
                            initialContent: 'La gestión de ancho de banda no es solo un límite de velocidad. Es la gestión inteligente de la congestión. Los **perfiles DBA** en la OLT te permiten definir no solo un ancho de banda máximo (`max-bandwidth`), sino también uno asegurado (`assured-bandwidth`). ⚙️ Creando perfiles DBA a medida, puedes garantizar que servicios críticos como VoIP siempre tengan el ancho de banda mínimo necesario, incluso cuando el puerto PON esté muy congestionado. \n```cli\ndba-profile add profile-name voip-assured type4 assured-bandwidth 1024 max-bandwidth 2048\n```', 
                            initialOptions: ['¿Qué es "type4" en el perfil DBA?', '¿Cómo aplico este perfil a una ONT?', '¿Puedo ver el uso de ancho de banda por T-CONT?'] 
                        }
                    ],
                    quiz: [
                        { question: 'El proceso de mover ONTs de un puerto PON saturado a otro menos ocupado se llama:', options: ['Splitteo', 'Balanceo de carga', 'Fusión', 'Atenuación'], correctAnswer: 'Balanceo de carga' },
                        { question: '¿Qué comando CLI es útil para ver la cantidad de ONTs y el estado de un puerto PON?', options: ['display ont info', 'display board info', 'display port info', 'display dba-profile'], correctAnswer: 'display port info' },
                        { question: 'En un perfil DBA, el parámetro que garantiza un ancho de banda mínimo a un servicio es:', options: ['max-bandwidth', 'fixed-bandwidth', 'assured-bandwidth', 'adaptive-bandwidth'], correctAnswer: 'assured-bandwidth' },
                        { question: 'El objetivo principal del balanceo de carga en puertos PON es:', options: ['Facturar más a los clientes', 'Mejorar el rendimiento y la estabilidad de la red', 'Reducir el número de clientes', 'Facilitar el trabajo de los técnicos'], correctAnswer: 'Mejorar el rendimiento y la estabilidad de la red' },
                        { question: 'La creación de perfiles DBA a medida es una forma de:', options: ['QoS proactiva para mitigar congestión', 'Seguridad de red', 'Planificación de capacidad', 'Diagnóstico de fallas'], correctAnswer: 'QoS proactiva para mitigar congestión' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 2: Hardening y Seguridad en la Red de Acceso',
                    learningObjectives: ['Implementar aislamiento de clientes a nivel de OLT', 'Aplicar Listas de Control de Acceso (ACLs) para filtrar tráfico en la capa de acceso'],
                    lessons: [
                        { 
                            lessonTitle: 'Aislamiento de Clientes y Prevención de Spoofing', 
                            initialContent: 'En una red GPON, todos los clientes de un mismo splitter comparten el mismo medio físico. Por defecto, podrían "verse" entre sí a nivel de Capa 2. Para evitar esto y aumentar la seguridad, se implementa el **aislamiento de puertos** en la OLT. 🛡️ Con el comando `port-isolate group [group_id]`, te aseguras de que el tráfico de una ONT solo pueda ir hacia el puerto uplink, y no hacia otras ONTs. También se activan funciones como `anti-mac-spoofing` para evitar que un cliente intente usar la MAC de otro.', 
                            initialOptions: ['¿Esto se configura por puerto PON o por ONT?', '¿Qué es el "MAC spoofing"?', 'Siguiente.'] 
                        },
                        { 
                            lessonTitle: 'Filtrado con Listas de Control de Acceso (ACLs) en la OLT', 
                            initialContent: 'Puedes usar la OLT como una primera barrera de defensa. Las **ACLs** te permiten crear reglas para permitir o denegar tráfico basado en IPs de origen/destino, puertos, etc. Por ejemplo, puedes crear una regla para bloquear todo el tráfico entrante hacia el puerto 23 (Telnet) en todas las ONTs, mitigando un vector de ataque común antes de que llegue a tu red core. \n```cli\nacl add rule name block-telnet rule-id 10 deny tcp destination-port eq 23\n```', 
                            initialOptions: ['¿Cómo aplico esta ACL a un rango de ONTs?', '¿Afecta mucho el rendimiento de la OLT?', '¿Qué otros usos tienen las ACLs aquí?'] 
                        }
                    ],
                    quiz: [
                        { question: 'La función para evitar que clientes de un mismo PON se comuniquen entre sí se llama:', options: ['VLAN Trunking', 'Aislamiento de puertos (Port Isolate)', 'Calidad de Servicio (QoS)', 'Budget de Potencia'], correctAnswer: 'Aislamiento de puertos (Port Isolate)' },
                        { question: '¿Cuál es el principal objetivo de `anti-mac-spoofing`?', options: ['Asignar MACs a las ONTs', 'Prevenir que un usuario malicioso se haga pasar por otro', 'Aumentar la velocidad de la red', 'Reducir la latencia'], correctAnswer: 'Prevenir que un usuario malicioso se haga pasar por otro' },
                        { question: 'Una ACL en la OLT sirve para:', options: ['Asignar perfiles de velocidad', 'Filtrar tráfico no deseado en la capa de acceso', 'Crear VLANs', 'Monitorear la señal óptica'], correctAnswer: 'Filtrar tráfico no deseado en la capa de acceso' },
                        { question: 'Bloquear el tráfico entrante al puerto 23 (Telnet) es una medida de:', options: ['Optimización de rendimiento', 'Hardening o fortalecimiento de la seguridad', 'Balanceo de carga', 'Diagnóstico de red'], correctAnswer: 'Hardening o fortalecimiento de la seguridad' },
                        { question: 'Aplicar ACLs en la OLT es más eficiente que en el router core para tráfico malicioso porque:', options: ['Lo detiene antes de que consuma recursos de la red principal', 'Los routers no tienen ACLs', 'Es más fácil de configurar', 'A los clientes les gusta más'], correctAnswer: 'Lo detiene antes de que consuma recursos de la red principal' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 3: Integración de Servicios y Protocolos Avanzados',
                    learningObjectives: ['Configurar un servicio de Triple Play (Voz, Video, Datos) en una ONT', 'Comprender cómo se transporta el tráfico de las VLANs de clientes hasta el router de borde (PE)'],
                    lessons: [
                        { 
                            lessonTitle: 'Implementación Práctica de Triple Play', 
                            initialContent: 'Vamos a unirlo todo. Para un cliente con Internet y VoIP, necesitas crear un `service-port` que mapee cada servicio a su VLAN y perfil de QoS. 📞🌐 El tráfico de Internet (HSI) irá a la VLAN 100 con un perfil DBA estándar, mientras que el tráfico de Voz (VoIP) irá a la VLAN 200, usando un perfil DBA con ancho de banda asegurado y una cola de prioridad más alta (`priority 5`). Todo esto se configura en la OLT para la misma ONT.', 
                            initialOptions: ['Ver un ejemplo completo de `service-port`', '¿Cómo se configura el lado de la ONT?', 'Siguiente.'] 
                        },
                        { 
                            lessonTitle: 'Transporte de Tráfico con QinQ', 
                            initialContent: '¿Cómo llevas cientos de VLANs de clientes (ej. VLAN 100) desde la OLT hasta el Router MikroTik principal a través de la red de agregación? La respuesta es **QinQ (802.1ad)** o "VLAN stacking". 📦 La OLT envuelve el tráfico del cliente, que ya tiene su etiqueta VLAN (C-VLAN), dentro de otra etiqueta VLAN (S-VLAN) para transportarlo por la red de agregación. El MikroTik luego "desenvuelve" el paquete para tratar a cada cliente de forma individual.', 
                            initialOptions: ['¿Qué es una C-VLAN y una S-VLAN?', '¿Cómo se ve la configuración en el puerto uplink de la OLT?', 'Ventajas de usar QinQ.'] 
                        }
                    ],
                    quiz: [
                        { question: 'Para ofrecer Internet y VoIP a un mismo cliente, se usan diferentes:', options: ['ONTs', 'Fibras', 'VLANs y perfiles de QoS', 'Splitters'], correctAnswer: 'VLANs y perfiles de QoS' },
                        { question: 'El tráfico de VoIP típicamente requiere una cola de prioridad _______ que el tráfico de internet.', options: ['más baja', 'igual', 'más alta', 'sin prioridad'], correctAnswer: 'más alta' },
                        { question: 'La tecnología que permite "envolver" una etiqueta VLAN dentro de otra para transportarla se conoce como:', options: ['QoS', 'DBA', 'QinQ (VLAN Stacking)', 'ACL'], correctAnswer: 'QinQ (VLAN Stacking)' },
                        { question: 'En un esquema QinQ, la "C-VLAN" se refiere a la VLAN de:', options: ['La OLT', 'El Cliente', 'El Core', 'La red de agregación'], correctAnswer: 'El Cliente' },
                        { question: 'El propósito principal de QinQ en nuestra red es:', options: ['Aumentar la seguridad', 'Transportar de forma escalable el tráfico de múltiples clientes a través de la red de agregación', 'Reducir la latencia', 'Asignar IPs públicas'], correctAnswer: 'Transportar de forma escalable el tráfico de múltiples clientes a través de la red de agregación' }
                    ]
                }
            ],
            finalProject: {
                title: 'Plan de Optimización y Aseguramiento de un Puerto PON Crítico',
                description: 'El puerto PON 0/3/0, que sirve a clientes corporativos, ha reportado picos de latencia. Tu misión es diseñar un plan completo para optimizar y asegurar este puerto. Debes entregar un documento que incluya:\n1. **Diagnóstico:** Los comandos CLI que usarías para verificar la carga actual y el uso de ancho de banda.\n2. **Optimización:** La configuración completa de un nuevo perfil DBA (`dba-profile`) que garantice 5 Mbps de ancho de banda asegurado para un servicio crítico.\n3. **Seguridad:** La configuración de una regla ACL (`acl`) para bloquear el acceso por SNMP desde el exterior hacia las ONTs de ese puerto.\n4. **Implementación:** La configuración de un `service-port` para una ONT específica, aplicando el nuevo perfil DBA y asociando el servicio a la VLAN corporativa 500.',
                evaluationCriteria: [
                    'Uso correcto de comandos CLI de diagnóstico y configuración de OLT.',
                    'Lógica y efectividad del perfil DBA y la regla ACL propuestos.',
                    'Precisión en la sintaxis de la configuración del `service-port`.',
                    'Capacidad para integrar conceptos de rendimiento y seguridad en una solución unificada.'
                ]
            }
        }
    },
    {
        id: 'template-gpon-01',
        topic: 'Principios de Redes FTTH/GPON',
        role: 'Ingeniero de Red (Nivel 3)',
        depth: 'Avanzado',
        course: {
            title: 'Principios Avanzados de FTTH/GPON (Avanzado)',
            description: 'Una inmersión técnica profunda en GPON, cubriendo su arquitectura, componentes, principios de transmisión (WDM) y la importancia de la medición de potencia óptica.',
            modules: [
                {
                    moduleTitle: 'Módulo 1: Arquitectura y Componentes GPON',
                    learningObjectives: ['Identificar y describir la función de la OLT, ONT y Splitters', 'Explicar el principio de WDM'],
                    lessons: [
                        { lessonTitle: 'Los Actores Principales: OLT, ONT y Splitter', initialContent: 'En nuestra red GPON, hay 3 componentes clave. 🏛️ La **OLT (Optical Line Terminal)** es el cerebro, vive en nuestra central. 🏠 La **ONT (Optical Network Terminal)** es el equipo que instalas en casa del cliente. Y en medio, los **Splitters** son divisores pasivos que toman una señal de fibra y la reparten a múltiples clientes. No necesitan energía. Funcionan con diferentes ratios (ej: 1:8, 1:16, 1:32) y cada división introduce una **pérdida de señal predecible (insertion loss)** que se debe calcular en el diseño de la red.', initialOptions: ['¿La OLT es un equipo grande?', '¿Qué es la "insertion loss"?', '¿Cuántos clientes puede atender un puerto de la OLT?'] },
                        { lessonTitle: 'Un Hilo, Dos Caminos: La Magia de WDM', initialContent: '¿Cómo es posible que por un único hilo de fibra viajen los datos de subida y de bajada al mismo tiempo sin chocar? La respuesta es **WDM (Wavelength Division Multiplexing)**. 🌈 Simplemente, usamos diferentes "colores" (longitudes de onda) de luz para cada dirección. Usualmente, **1490nm para la bajada** (datos hacia el cliente), **1310nm para la subida** (datos desde el cliente), y a veces se usa **1550nm para video/TV por cable (RF Overlay)**.', initialOptions: ['¿Qué es una longitud de onda?', '¿Estos colores son visibles?', '¿Por qué se usan esas longitudes de onda específicas?'] }
                    ],
                    quiz: [
                        { question: '¿Qué componente de la red GPON se instala en la casa del cliente?', options: ['OLT', 'Splitter', 'Router de Borde', 'ONT'], correctAnswer: 'ONT' },
                        { question: 'El "cerebro" de la red GPON, ubicado en la central de TELNET CO, es la:', options: ['ONT', 'Firewall', 'OLT', 'Switch Core'], correctAnswer: 'OLT' },
                        { question: '¿Qué dispositivo permite que una sola fibra de la OLT se divida para atender a múltiples clientes?', options: ['Router', 'Switch', 'ONT', 'Splitter'], correctAnswer: 'Splitter' },
                        { question: 'La tecnología que permite enviar y recibir datos en un solo hilo de fibra usando diferentes longitudes de onda se llama:', options: ['DHCP', 'WDM', 'Ethernet', 'QoS'], correctAnswer: 'WDM' },
                        { question: 'Típicamente, la longitud de onda para los datos de BAJADA (downstream) en GPON es:', options: ['1310nm', '1550nm', '1490nm', '850nm'], correctAnswer: '1490nm' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 2: Medición de Señal y Calidad de Servicio',
                    learningObjectives: ['Entender qué es la potencia óptica y cómo se mide en dBm', 'Comprender los conceptos de T-CONT y GEM Port'],
                    lessons: [
                        { lessonTitle: 'La Potencia lo es Todo: dBm y el Presupuesto Óptico', initialContent: 'La calidad del servicio depende de la **potencia de la señal óptica** que llega a la ONT, medida en **dBm**. Es una escala logarítmica y negativa. Un valor "más alto" (más cercano a 0) es mejor. Por ejemplo, **-15 dBm** es excelente, mientras que **-28 dBm** es muy mala. 📉 El **presupuesto de potencia** es el cálculo de todas las pérdidas esperadas en la red (por distancia, splitters, conectores) para asegurar que la señal final llegue en un rango aceptable.', initialOptions: ['¿Cuál es el rango aceptable en TELNET CO?', '¿Cómo se calcula el presupuesto?', '¿Qué es la "ventana de operación" de una ONT?'] },
                        { lessonTitle: 'Los Contenedores de Datos: T-CONT y GEM Ports', initialContent: 'Dentro de la "tubería" GPON, los datos de cada cliente se organizan en contenedores. 📦 Un **T-CONT (Transmission Container)** es un contenedor lógico que agrupa el tráfico de subida de un cliente. Hay varios tipos (Type 1 a 5) para priorizar diferentes servicios (como VoIP o video). Dentro de él, viajan los **GEM Ports**, que son como cajas más pequeñas, una para cada tipo de servicio específico (internet, TV, etc.), asegurando la calidad del servicio (QoS).', initialOptions: ['¿Quién configura los T-CONTs y GEM Ports?', '¿Un cliente tiene un solo T-CONT?', '¿Esto tiene que ver con la velocidad del plan?'] }
                    ],
                    quiz: [
                        { question: '¿En qué unidad se mide la potencia de la señal óptica?', options: ['Watts', 'dBm', 'Volts', 'Hertz'], correctAnswer: 'dBm' },
                        { question: '¿Cuál de los siguientes valores de señal es MEJOR?', options: ['-30 dBm', '-25 dBm', '-28 dBm', '-18 dBm'], correctAnswer: '-18 dBm' },
                        { question: 'El cálculo de todas las pérdidas de señal en un enlace de fibra se llama:', options: ['Inventario de red', 'Presupuesto de potencia óptica', 'Ancho de banda', 'Tasa de transferencia'], correctAnswer: 'Presupuesto de potencia óptica' },
                        { question: 'En la arquitectura GPON, ¿qué se usa para gestionar el ancho de banda de subida de un cliente?', options: ['GEM Port', 'Splitter', 'T-CONT', 'ONT'], correctAnswer: 'T-CONT' },
                        { question: 'Un contenedor para un servicio específico (como internet) dentro de un T-CONT se llama:', options: ['Paquete IP', 'GEM Port', 'VLAN', 'Trama Ethernet'], correctAnswer: 'GEM Port' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 3: Configuración de ONT y Router Básico',
                    learningObjectives: ['Entender los modos de operación de una ONT (bridge vs router)', 'Realizar la configuración básica de un router Wi-Fi'],
                    lessons: [
                        { lessonTitle: 'ONT: ¿Puente o Director? (Bridge vs Router)', initialContent: 'Una ONT puede operar en dos modos. En modo **Bridge**, es como un simple convertidor de medios: la luz se convierte en señal eléctrica y se la pasa a un router externo que hace todo el trabajo. En modo **Router**, la propia ONT gestiona la red del cliente (asigna IPs por DHCP, maneja el Wi-Fi, etc.). La elección depende de la necesidad del cliente y el diseño de la red. 🌉', initialOptions: ['¿Cuál usamos más en TELNET CO?', 'Ventajas del modo Bridge', 'Desventajas del modo Router'] },
                        { lessonTitle: 'Configuración Wi-Fi 101', initialContent: 'Al configurar el router del cliente (sea la ONT en modo router o un equipo aparte), hay 3 cosas básicas: 1. **SSID:** El nombre de la red Wi-Fi. 2. **Contraseña:** Usar siempre seguridad WPA2 o WPA3. 3. **Canal:** Elegir un canal Wi-Fi (1, 6 u 11 en 2.4GHz) que no esté saturado para evitar interferencias. 📶', initialOptions: ['¿Qué es 2.4GHz vs 5GHz?', '¿Cómo sé qué canal está saturado?', '¿Qué es WPA3?'] }
                    ],
                    quiz: [
                        { question: 'Una ONT que solo convierte la señal de fibra a Ethernet sin gestionar la red se dice que está en modo:', options: ['Router', 'Switch', 'Bridge', 'Firewall'], correctAnswer: 'Bridge' },
                        { question: 'El nombre de una red Wi-Fi se conoce como:', options: ['SSID', 'MAC Address', 'IP Address', 'WPA2'], correctAnswer: 'SSID' },
                        { question: '¿Cuál de los siguientes es un estándar de seguridad Wi-Fi recomendado?', options: ['WEP', 'WPA', 'WPA3', 'Abierto'], correctAnswer: 'WPA3' },
                        { question: 'Para evitar interferencias en la banda de 2.4GHz, se recomienda usar los canales:', options: ['1, 2, 3', '5, 8, 10', 'Cualquiera funciona igual', '1, 6, 11'], correctAnswer: '1, 6, 11' },
                        { question: 'El servicio que asigna direcciones IP a los dispositivos dentro de la red del cliente es:', options: ['DNS', 'QoS', 'DHCP', 'NAT'], correctAnswer: 'DHCP' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 4: Diagnóstico de Fallas en Red Pasiva',
                    learningObjectives: ['Identificar las causas comunes de atenuación', 'Diferenciar entre macrocurva y microcurva'],
                    lessons: [
                        { lessonTitle: 'Los Culpables de la Atenuación', initialContent: 'La señal óptica se debilita (atenúa) por varias razones. Las principales son: **distancia**, cada **splitter**, cada **conector** y cada **empalme por fusión**. Un buen diseño de red (presupuesto de potencia) calcula estas pérdidas para que la señal llegue bien. Un conector sucio o un mal empalme introducen una atenuación mucho mayor a la esperada. 📉', initialOptions: ['¿Cuánta señal pierde un splitter 1:8?', '¿Y un conector SC/APC?', '¿Cómo sé si un empalme quedó mal?'] },
                        { lessonTitle: 'Curvas Peligrosas: Macro y Micro', initialContent: 'La fibra es sensible a las curvas. Una **macrocurva** es una curva visible y pronunciada en el cable (ej. doblarlo en un ángulo de 90 grados), lo que hace que la luz se "escape". Una **microcurva** es una imperfección a nivel microscópico, a menudo causada por presión sobre la fibra (ej. un precinto demasiado apretado), que también causa pérdida de señal. ⚠️', initialOptions: ['¿Cómo detecto una macrocurva?', '¿Cómo detecto una microcurva?', '¿Son reparables?'] }
                    ],
                    quiz: [
                        { question: '¿Cuál de los siguientes NO es una causa normal de atenuación en la fibra?', options: ['La distancia', 'Un splitter', 'El color del cable', 'Un conector'], correctAnswer: 'El color del cable' },
                        { question: 'Una curva muy pronunciada y visible en un cable de fibra se llama:', options: ['Empalme', 'Microcurva', 'Splitter', 'Macrocurva'], correctAnswer: 'Macrocurva' },
                        { question: 'Un precinto plástico demasiado apretado sobre un cable de fibra puede causar una:', options: ['Macrocurva', 'Microcurva', 'Mejora de la señal', 'Fusión en frío'], correctAnswer: 'Microcurva' },
                        { question: 'Un conector sucio causa una...', options: ['Atenuación mayor a la esperada', 'Señal más fuerte', 'No afecta la señal', 'Mejora en la conexión'], correctAnswer: 'Atenuación mayor a la esperada' },
                        { question: 'El cálculo previo de todas las pérdidas de señal en un enlace se llama:', options: ['Análisis de espectro', 'Inventario de red', 'Presupuesto de potencia', 'Diagrama de flujo'], correctAnswer: 'Presupuesto de potencia' }
                    ]
                }
            ],
            finalProject: {
                title: 'Diagnóstico de un Escenario de Baja Señal',
                description: 'Se te presenta un caso: un técnico en campo mide la señal en la casa de un cliente y obtiene -30 dBm. Describe en un texto cuáles son las 3 causas más probables de este problema (ej: conector sucio, fibra doblada, problema en splitter, etc.) y qué pasos seguirías para identificar cuál de ellas es la culpable.',
                evaluationCriteria: [
                    'Identificación de al menos 3 causas probables y relevantes para la baja señal.',
                    'Descripción de un proceso de diagnóstico lógico y secuencial.',
                    'Aplicabilidad de los pasos de solución en un escenario de campo real.'
                ]
            }
        }
    },
    
    // =================================================================
    // --- ROL: TÉCNICO INSTALADOR FTTH ---
    // =================================================================
    {
        id: 'template-ftth-01',
        topic: 'Fundamentos de Fibra Óptica y Seguridad para Técnicos',
        role: 'Técnico Instalador FTTH',
        depth: 'Básico',
        course: {
            title: 'Ruta 1: Fundamentos de Fibra y Seguridad (Básico)',
            description: 'El punto de partida esencial para todo técnico de campo. Aprende qué es la fibra óptica, por qué es superior, y lo más importante: cómo trabajar de forma segura en todo momento.',
            modules: [
                {
                    moduleTitle: 'Módulo 1: ¿Qué es la Fibra Óptica?',
                    lessons: [
                        { lessonTitle: 'La Luz como Mensajera', initialContent: 'La fibra óptica es un hilo delgado de vidrio o plástico que transmite información usando pulsos de luz. 💡 Es como un cable, pero en lugar de electricidad, viaja luz. Esto la hace inmune a interferencias eléctricas y mucho más rápida que los cables de cobre tradicionales.', initialOptions: ['¿Por qué es más rápida?', '¿De qué está hecha exactamente?', '¿Qué es un "pulso" de luz?'] },
                        { lessonTitle: 'Ventajas Clave sobre el Cobre', initialContent: 'La fibra gana en casi todo: **1. Velocidad y Ancho de Banda:** Puede transportar muchísima más información. **2. Distancia:** La señal llega mucho más lejos sin debilitarse. **3. Inmunidad:** No le afectan las tormentas eléctricas ni las interferencias de otros cables. **4. Seguridad:** Es muy difícil de interceptar.', initialOptions: ['¿Tiene alguna desventaja?', '¿Qué es el ancho de banda?', 'Siguiente tema.'] }
                    ],
                    quiz: [
                        { question: 'La fibra óptica transmite información usando:', options: ['Electricidad', 'Sonido', 'Pulsos de luz', 'Ondas de radio'], correctAnswer: 'Pulsos de luz' },
                        { question: 'Una ventaja de la fibra sobre el cobre es que:', options: ['Es más barata de producir', 'Es inmune a interferencias eléctricas', 'Es más flexible', 'Pesa más'], correctAnswer: 'Es inmune a interferencias eléctricas' },
                        { question: '¿Qué término se refiere a la capacidad de un medio para transportar información?', options: ['Voltaje', 'Latencia', 'Ancho de banda', 'Resistencia'], correctAnswer: 'Ancho de banda' },
                        { question: 'La fibra óptica está hecha principalmente de:', options: ['Cobre y aluminio', 'Plástico y acero', 'Vidrio o plástico muy puros', 'Goma y tela'], correctAnswer: 'Vidrio o plástico muy puros' },
                        { question: 'En comparación con el cobre, la señal de luz en la fibra puede viajar:', options: ['Distancias mucho más cortas', 'Distancias mucho más largas', 'La misma distancia', 'Solo en línea recta'], correctAnswer: 'Distancias mucho más largas' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 2: Tipos de Fibra y Cables',
                    lessons: [
                        { lessonTitle: 'Monomodo vs. Multimodo', initialContent: 'Existen dos grandes familias de fibra. Nosotros en TELNET CO usamos **Monomodo (Single Mode)**. Tiene un núcleo extremadamente delgado (9 micrones) que permite que un solo rayo de luz viaje, ideal para largas distancias. La fibra **Multimodo (Multi Mode)** tiene un núcleo más grueso, permite que viajen múltiples rayos de luz, pero es solo para distancias cortas (ej. dentro de un edificio).', initialOptions: ['¿Por qué usamos Monomodo?', '¿Cómo las diferencio visualmente?', 'Siguiente.'] },
                        { lessonTitle: 'Anatomía de un Cable de Fibra', initialContent: 'El hilo de vidrio es frágil. Por eso viene dentro de un cable con varias capas de protección: 1. **Núcleo (Core):** Por donde viaja la luz. 2. **Revestimiento (Cladding):** Refleja la luz para que no se escape del núcleo. 3. **Recubrimiento (Buffer/Coating):** Primera capa de plástico protector. 4. **Miembros de Tracción (Kevlar):** Fibras que le dan resistencia. 5. **Chaqueta (Jacket):** La cubierta exterior que vemos.', initialOptions: ['¿Qué es el Kevlar?', '¿Todos los cables son iguales?', '¿Qué es un cable de acometida?'] }
                    ],
                    quiz: [
                        { question: '¿Qué tipo de fibra utiliza TELNET CO para su red FTTH?', options: ['Multimodo', 'Monomodo', 'Plástico', 'Cobre'], correctAnswer: 'Monomodo' },
                        { question: 'La fibra Monomodo es ideal para:', options: ['Distancias cortas', 'Conectar un PC al router', 'Redes de área local (LAN)', 'Largas distancias'], correctAnswer: 'Largas distancias' },
                        { question: 'La capa del cable de fibra que evita que la luz se escape del núcleo es el:', options: ['Chaqueta', 'Kevlar', 'Revestimiento (Cladding)', 'Buffer'], correctAnswer: 'Revestimiento (Cladding)' },
                        { question: 'Las fibras de Kevlar en un cable de fibra sirven para:', options: ['Conducir la luz', 'Proteger del agua', 'Darle resistencia a la tracción', 'Aislar de la electricidad'], correctAnswer: 'Darle resistencia a la tracción' },
                        { question: 'El núcleo de la fibra Monomodo es:', options: ['Muy grueso', 'Extremadamente delgado', 'Del mismo tamaño que el Multimodo', 'Hueco'], correctAnswer: 'Extremadamente delgado' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 3: EPP y Seguridad Básica',
                    lessons: [
                        { lessonTitle: 'Tu Equipo de Protección Personal (EPP)', initialContent: 'Tu seguridad es la prioridad #1. Antes de cualquier trabajo, debes usar tu EPP completo: **Casco**, **Gafas de seguridad**, **Guantes de trabajo** y **Botas de seguridad**. 👷‍♂️ Sin excusas. Las gafas son cruciales para proteger tus ojos de fragmentos de fibra al cortarla.', initialOptions: ['¿Qué pasa si no uso mi EPP?', '¿Hay otros EPP?', 'Siguiente.'] },
                        { lessonTitle: 'Manejo Seguro de la Fibra', initialContent: 'Aunque no conduce electricidad, la fibra de vidrio rota es peligrosa. Los pequeños fragmentos son como agujas de vidrio. **Nunca** te toques los ojos o la boca mientras trabajas. Usa siempre un recipiente seguro para desechar los trozos de fibra sobrantes, ¡nunca los dejes en el suelo!', initialOptions: ['¿Qué hago si me clavo un trozo?', '¿Cómo se limpia el área de trabajo?', 'Entendido.'] }
                    ],
                    quiz: [
                        { question: '¿Qué significa EPP?', options: ['Equipo para Postes', 'Elementos de Protección Personal', 'Equipo de Primera Persona', 'Emergencia, Prevenir, Proteger'], correctAnswer: 'Elementos de Protección Personal' },
                        { question: '¿Por qué son especialmente importantes las gafas de seguridad al trabajar con fibra?', options: ['Para ver mejor la luz', 'Para proteger los ojos de fragmentos de vidrio', 'Para proteger del sol', 'Es solo una regla'], correctAnswer: 'Para proteger los ojos de fragmentos de vidrio' },
                        { question: 'Los trozos sobrantes de fibra deben ser:', options: ['Dejados en el suelo', 'Soplados para que se vayan', 'Desechados en un recipiente seguro', 'Guardados en el bolsillo'], correctAnswer: 'Desechados en un recipiente seguro' },
                        { question: '¿Cuál es el principal peligro de un fragmento de fibra?', options: ['Puede explotar', 'Es tóxico', 'Puede clavarse en la piel o los ojos', 'Conduce electricidad'], correctAnswer: 'Puede clavarse en la piel o los ojos' },
                        { question: 'Antes de iniciar cualquier trabajo, lo primero que debes hacer es:', options: ['Llamar al cliente', 'Medir la señal', 'Ponerte tu EPP completo', 'Tomar un café'], correctAnswer: 'Ponerte tu EPP completo' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 4: Trabajo Seguro en Alturas',
                    lessons: [
                        { lessonTitle: 'La Escalera: Tu Base', initialContent: 'Tu escalera es una herramienta crítica. Antes de usarla, **inspecciónala**: revisa que no tenga golpes, fisuras y que las zapatas antideslizantes estén en buen estado. Apóyala siempre sobre una superficie firme y en un ángulo seguro (aproximadamente 75 grados).', initialOptions: ['¿Cuál es el ángulo seguro?', '¿Cómo aseguro la escalera?', 'Siguiente.'] },
                        { lessonTitle: 'El Arnés y la Línea de Vida', initialContent: 'Para subir a un poste, el **arnés de seguridad** es obligatorio. Aprende a ponértelo correctamente, ajustando todas las correas. Tu **línea de vida (eslinga)** debe estar siempre conectada a un punto de anclaje seguro en el poste. ¡Jamás te desancles para reposicionarte!', initialOptions: ['¿Cómo inspecciono mi arnés?', '¿Qué es un punto de anclaje seguro?', 'Entendido, la seguridad es primero.'] }
                    ],
                    quiz: [
                        { question: '¿Qué EPP es obligatorio para subir a un poste?', options: ['Solo el casco', 'Guantes y gafas', 'Arnés de seguridad', 'Botas especiales'], correctAnswer: 'Arnés de seguridad' },
                        { question: 'Antes de usar una escalera, debes:', options: ['Pintarla de un color visible', 'Inspeccionarla en busca de daños', 'Mojarla para que no resbale', 'Quitarle las zapatas'], correctAnswer: 'Inspeccionarla en busca de daños' },
                        { question: 'La línea de vida (eslinga) debe estar:', options: ['Guardada en el bolsillo mientras subes', 'Conectada a tu cinturón', 'Siempre conectada a un punto de anclaje seguro', 'Enrollada en tu mano'], correctAnswer: 'Siempre conectada a un punto de anclaje seguro' },
                        { question: 'El ángulo recomendado para apoyar una escalera es de aproximadamente:', options: ['90 grados', '45 grados', '30 grados', '75 grados'], correctAnswer: '75 grados' },
                        { question: '¿Cuándo es aceptable desanclarse en las alturas?', options: ['Para moverse más rápido', 'Cuando nadie está mirando', 'Si el anclaje está muy lejos', 'Nunca'], correctAnswer: 'Nunca' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 5: Riesgos Eléctricos en Postes',
                    lessons: [
                        { lessonTitle: 'No Estamos Solos en el Poste', initialContent: 'Recuerda que compartimos el poste con la red eléctrica. ⚡️ Estos cables de media y baja tensión son extremadamente peligrosos. Tu primera tarea es **identificar las líneas eléctricas** y mantener siempre una distancia segura.', initialOptions: ['¿Cuál es la distancia segura?', '¿Cómo diferencio los cables?', 'Siguiente.'] },
                        { lessonTitle: 'Reglas de Oro Eléctricas', initialContent: '**Regla #1: Considera todos los cables como energizados** hasta que se demuestre lo contrario. **Regla #2: No toques ningún cable que no sea el de fibra**. **Regla #3: Cuidado con las herramientas**, no permitas que tu escalera o herramientas metálicas hagan contacto con líneas eléctricas. **Regla #4: En caso de tormenta, no trabajes en postes.**', initialOptions: ['¿Qué hago si mi escalera toca un cable?', '¿El cable de fibra puede conducir electricidad?', 'Entendido.'] }
                    ],
                    quiz: [
                        { question: 'Al trabajar en un poste, debes considerar los cables eléctricos como:', options: ['Inofensivos', 'Desenergizados', 'Potencialmente energizados y peligrosos', 'Parte de nuestra red'], correctAnswer: 'Potencialmente energizados y peligrosos' },
                        { question: '¿Cuál es la acción correcta si empieza una tormenta eléctrica?', options: ['Subir más rápido para terminar', 'Suspender el trabajo en postes inmediatamente', 'Usar guantes de goma', 'No hacer nada, la fibra no conduce'], correctAnswer: 'Suspender el trabajo en postes inmediatamente' },
                        { question: 'La principal precaución con herramientas metálicas en un poste es:', options: ['Limpiarlas bien', 'Evitar que toquen las líneas eléctricas', 'Asegurarlas con cinta', 'Pintarlas de un color aislante'], correctAnswer: 'Evitar que toquen las líneas eléctricas' },
                        { question: 'La distancia que debes mantener de las líneas eléctricas se conoce como:', options: ['Distancia de confort', 'Distancia de trabajo', 'Distancia de seguridad', 'Distancia mínima'], correctAnswer: 'Distancia de seguridad' },
                        { question: 'Si no estás seguro de qué tipo de cable es uno, debes:', options: ['Tocarlo con un guante', 'Asumir que es seguro y moverlo', 'Asumir que es peligroso y no tocarlo', 'Cortarlo'], correctAnswer: 'Asumir que es peligroso y no tocarlo' }
                    ]
                }
            ],
            finalProject: {
                title: 'Análisis de Riesgos de un Escenario',
                description: 'Se te presenta una foto de un poste de luz con varios cables. Describe en un texto: 1. Los EPP que usarías para trabajar en ese poste. 2. Los riesgos potenciales que observas (eléctricos, de altura, etc.). 3. Los 5 pasos de seguridad más importantes que seguirías antes y durante el trabajo en ese poste.',
                evaluationCriteria: [
                    'Identificación correcta del EPP necesario.',
                    'Reconocimiento de los principales riesgos en el escenario.',
                    'Descripción de un procedimiento de trabajo seguro y lógico.'
                ]
            }
        }
    },
    {
        id: 'template-ftth-02',
        topic: 'Herramientas del Técnico FTTH: Uso y Cuidado',
        role: 'Técnico Instalador FTTH',
        depth: 'Básico',
        course: {
            title: 'Ruta 2: Dominio de Herramientas Esenciales (Básico)',
            description: 'Conoce a fondo tu kit de herramientas. Aprende el uso correcto, cuidado y la función de cada pieza clave para una instalación de calidad.',
            modules: [
                {
                    moduleTitle: 'Módulo 1: Herramientas de Corte y Preparación',
                    lessons: [
                        { lessonTitle: 'La Peladora de Fibra (Stripper)', initialContent: 'La [searchable]peladora de fibra[/searchable] tiene 3 agujeros de precisión. Cada uno es para remover una capa específica del cable: la chaqueta exterior, el recubrimiento (buffer) y finalmente el acrilato (coating) para dejar el vidrio expuesto. Usar el agujero incorrecto puede dañar la fibra. ¡Practica para lograr un movimiento suave y firme!', initialOptions: ['¿Cuál es el orden para pelar?', '¿Requiere calibración?', 'Siguiente.'] },
                        { lessonTitle: 'La Cortadora de Precisión (Cleaver)', initialContent: 'Después de pelar la fibra, necesitas un corte perfectamente plano a 90 grados para que la luz pase sin problemas. Para eso sirve la [searchable]cortadora de precisión o cleaver[/searchable]. Colocas la fibra, la aseguras y una cuchilla de diamante o tungsteno hace un corte impecable. Un mal corte es una causa común de alta pérdida de señal.', initialOptions: ['¿Cómo funciona la cuchilla?', '¿Se desgasta?', '¿Qué pasa si el corte no es a 90°?'] }
                    ],
                    quiz: [
                        { question: '¿Para qué se utiliza la herramienta "stripper"?', options: ['Para cortar la fibra a 90 grados', 'Para medir la potencia de la luz', 'Para remover las capas protectoras de la fibra', 'Para fusionar dos fibras'], correctAnswer: 'Para remover las capas protectoras de la fibra' },
                        { question: 'Un corte perfecto de la fibra debe ser a:', options: ['45 grados', '180 grados', '90 grados', 'Cualquier ángulo es válido'], correctAnswer: '90 grados' },
                        { question: 'La herramienta que realiza el corte final y preciso de la fibra es el:', options: ['Stripper', 'Power Meter', 'Bisturí', 'Cleaver'], correctAnswer: 'Cleaver' },
                        { question: 'Usar el orificio incorrecto en la peladora puede:', options: ['Hacer el trabajo más rápido', 'Mejorar la señal', 'Rayar o romper la fibra de vidrio', 'Limpiar la fibra'], correctAnswer: 'Rayar o romper la fibra de vidrio' },
                        { question: 'Un mal corte con el cleaver es una causa principal de:', options: ['Mejor conexión', 'Alta pérdida de señal', 'Ahorro de tiempo', 'No tiene efectos importantes'], correctAnswer: 'Alta pérdida de señal' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 2: Herramientas de Limpieza',
                    lessons: [
                        { lessonTitle: 'Alcohol Isopropílico y Paños sin Pelusa', initialContent: 'La limpieza es crucial. Una mota de polvo invisible puede bloquear gran parte de la señal. El método estándar es usar **alcohol isopropílico de alta pureza (99%)** y **paños especiales que no dejen pelusa**. Humedece el paño y limpia la punta de la fibra (ferrule) con un movimiento recto.', initialOptions: ['¿Por qué no usar alcohol normal?', '¿Puedo reusar un paño?', '¿Qué es el "ferrule"?'] },
                        { lessonTitle: 'El Limpiador de "Un Clic"', initialContent: 'Para conectores en acopladores o en la roseta, es difícil usar un paño. Para eso existe el [searchable]limpiador de un clic[/searchable]. Es una herramienta que insertas en el conector y, al presionarla, un hilo de limpieza especial avanza y limpia la cara del conector de forma automática. Es rápido y muy efectivo.', initialOptions: ['¿Cuántas limpiezas dura?', '¿Sirve para todos los conectores?', 'Siguiente.'] }
                    ],
                    quiz: [
                        { question: 'El alcohol recomendado para limpiar fibra óptica debe tener una pureza de:', options: ['70%', 'Cualquiera sirve', '99% o más', '50%'], correctAnswer: '99% o más' },
                        { question: '¿Por qué no se debe usar un paño común para limpiar la fibra?', options: ['Porque puede rayar la fibra', 'Porque puede dejar pelusa', 'Porque no absorbe el alcohol', 'Ambas A y B son correctas'], correctAnswer: 'Ambas A y B son correctas' },
                        { question: 'La herramienta para limpiar conectores dentro de acopladores se llama:', options: ['Stripper', 'Cleaver', 'Limpiador de "un clic"', 'VFL'], correctAnswer: 'Limpiador de "un clic"' },
                        { question: 'La punta de un conector de fibra que se limpia se llama:', options: ['Jacket', 'Buffer', 'Ferrule', 'Kevlar'], correctAnswer: 'Ferrule' },
                        { question: 'Una de las principales causas de atenuación (pérdida de señal) en un conector es:', options: ['La suciedad', 'El exceso de luz', 'El color del conector', 'La marca del conector'], correctAnswer: 'La suciedad' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 3: Medidores Básicos',
                    lessons: [
                        { lessonTitle: 'El Power Meter Óptico (OPM)', initialContent: 'El **Optical Power Meter (OPM)** o Medidor de Potencia Óptica es tu herramienta de diagnóstico más importante. Mide cuánta luz está llegando al punto donde lo conectas. Se mide en **dBm**. Recuerda configurar la longitud de onda correcta (usualmente **1490nm**) para medir la señal que recibe la ONT.', initialOptions: ['¿Qué es dBm?', '¿Por qué debo configurar la longitud de onda?', '¿Qué pasa si mido en 1310nm?'] },
                        { lessonTitle: 'El VFL (Localizador Visual de Fallos)', initialContent: 'El **VFL** es un láser rojo muy potente. Lo conectas a la fibra y la luz roja viajará por ella. Si hay una rotura o una curva muy pronunciada cerca, la luz se "escapará" y verás un punto rojo brillante en el lugar exacto del fallo. 🔦 ¡Es extremadamente útil para encontrar problemas en la roseta o en los últimos metros de cable!', initialOptions: ['¿Es peligroso para los ojos?', '¿Qué alcance tiene?', 'Siguiente.'] }
                    ],
                    quiz: [
                        { question: '¿Qué mide un Power Meter Óptico (OPM)?', options: ['La velocidad del internet', 'La cantidad de luz (potencia)', 'El voltaje del cable', 'La temperatura de la fibra'], correctAnswer: 'La cantidad de luz (potencia)' },
                        { question: 'La unidad de medida del OPM es:', options: ['Voltios', 'Watts', 'dBm', 'Ohmios'], correctAnswer: 'dBm' },
                        { question: 'Para medir la señal que llega a la ONT, debes configurar el OPM en la longitud de onda de:', options: ['1310nm', '1550nm', '1490nm', '850nm'], correctAnswer: '1490nm' },
                        { question: 'El VFL es útil para encontrar:', options: ['Problemas a 20 km de distancia', 'La velocidad de la conexión', 'Fallos cercanos como roturas o curvas pronunciadas', 'Conectores sucios'], correctAnswer: 'Fallos cercanos como roturas o curvas pronunciadas' },
                        { question: '¿Cuál es la principal precaución de seguridad al usar un VFL?', options: ['No mojarlo', 'No apuntar el láser directamente a los ojos', 'Usar baterías nuevas', 'No dejarlo caer'], correctAnswer: 'No apuntar el láser directamente a los ojos' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 4: Cuidado y Mantenimiento de Herramientas',
                    lessons: [
                        { lessonTitle: 'Manteniendo el Filo: El Cleaver', initialContent: 'La cuchilla de tu cortadora de precisión tiene varias posiciones. Cuando notes que los cortes ya no son buenos (lo verás en la fusionadora o con un microscopio), debes **rotar la cuchilla** a la siguiente posición. Una vez que todas las posiciones se han usado, la cuchilla debe ser reemplazada. Mantén el cleaver siempre limpio de residuos de fibra.', initialOptions: ['¿Cómo se rota la cuchilla?', '¿Cada cuánto debo limpiarlo?', 'Siguiente.'] },
                        { lessonTitle: 'Calibración y Baterías', initialContent: 'Tu Power Meter y tu Fusionadora son equipos de precisión. Asegúrate de que tengan siempre baterías cargadas. La fusionadora realiza una **calibración de arco** automática o manual para ajustarse a las condiciones ambientales (humedad, temperatura). Realiza esta calibración periódicamente para asegurar fusiones de calidad.', initialOptions: ['¿Qué es una calibración de arco?', '¿El Power Meter se calibra?', 'Entendido.'] }
                    ],
                    quiz: [
                        { question: 'Cuando un cleaver deja de cortar bien, lo primero que debes hacer es:', options: ['Comprar uno nuevo', 'Aceitar la cuchilla', 'Rotar la cuchilla a una nueva posición', 'Limpiarlo con agua'], correctAnswer: 'Rotar la cuchilla a una nueva posición' },
                        { question: 'La calibración de arco es un procedimiento que se realiza en la:', options: ['Cortadora de precisión (Cleaver)', 'Fusionadora', 'Power Meter', 'Peladora (Stripper)'], correctAnswer: 'Fusionadora' },
                        { question: '¿Por qué es importante la calibración de arco?', options: ['Para que la fusionadora se vea mejor', 'Para ajustar la potencia del arco a las condiciones ambientales', 'Para limpiar la fusionadora', 'Para cargar la batería'], correctAnswer: 'Para ajustar la potencia del arco a las condiciones ambientales' },
                        { question: 'El cuidado principal de todas tus herramientas es:', options: ['Prestárselas a otros', 'Dejarlas bajo la lluvia', 'Mantenerlas limpias y protegidas en su estuche', 'Modificarlas para que sean más rápidas'], correctAnswer: 'Mantenerlas limpias y protegidas en su estuche' },
                        { question: 'Un cleaver sucio con residuos de fibra puede causar:', options: ['Cortes más rápidos', 'Cortes imprecisos y de mala calidad', 'No afecta en nada', 'Que la cuchilla dure más'], correctAnswer: 'Cortes imprecisos y de mala calidad' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 5: El Kit Completo del Técnico',
                    lessons: [
                        { lessonTitle: 'Más Allá de lo Básico: Otras Herramientas', initialContent: 'Además de las herramientas de fibra, tu kit debe incluir: **Tijeras de Kevlar** (para cortar los hilos de resistencia), **Alicates y destornilladores**, **Cinta aislante**, y un **Taladro** para las instalaciones. Un buen técnico es organizado y tiene todo a la mano.', initialOptions: ['¿Por qué necesito tijeras especiales para Kevlar?', '¿Qué tipo de broca uso?', 'Siguiente.'] },
                        { lessonTitle: 'Organización y Checklist Diario', initialContent: 'Antes de salir a tu jornada, revisa tu vehículo y tu kit. ✅ ¿Están todas las herramientas? ¿Están limpias y cargadas? ¿Tienes suficientes conectores, cable y otros consumibles? Unos minutos de revisión por la mañana te pueden ahorrar horas de problemas en campo.', initialOptions: ['Crear un checklist de ejemplo', '¿Qué consumibles son los más importantes?', 'Entendido, ¡a trabajar!'] }
                    ],
                    quiz: [
                        { question: '¿Para qué se usan las tijeras de Kevlar?', options: ['Para cortar la chaqueta del cable', 'Para pelar la fibra de vidrio', 'Para cortar los hilos de aramida (Kevlar) de resistencia', 'Para cortar cinta aislante'], correctAnswer: 'Para cortar los hilos de aramida (Kevlar) de resistencia' },
                        { question: 'Una buena práctica antes de iniciar la jornada de trabajo es:', options: ['Esperar la primera llamada del día', 'Revisar que todas tus herramientas y materiales estén en orden', 'Llenar el tanque de gasolina al mediodía', 'Limpiar el carro por fuera'], correctAnswer: 'Revisar que todas tus herramientas y materiales estén en orden' },
                        { question: '¿Cuál de las siguientes NO es una herramienta de preparación de fibra?', options: ['Stripper', 'Cleaver', 'Taladro', 'Alcohol Isopropílico'], correctAnswer: 'Taladro' },
                        { question: 'Ser organizado con tus herramientas te ayuda a:', options: ['Trabajar más rápido y ser más profesional', 'Perder menos herramientas', 'Evitar accidentes', 'Todas las anteriores'], correctAnswer: 'Todas las anteriores' },
                        { question: 'Los conectores y el cable de fibra se consideran:', options: ['Herramientas reutilizables', 'Materiales consumibles', 'Equipos de medición', 'EPP'], correctAnswer: 'Materiales consumibles' }
                    ]
                }
            ],
            finalProject: {
                title: 'Preparación de una Punta de Fibra para Conexión',
                description: 'Describe, paso a paso, el proceso completo para preparar una punta de fibra de acometida para instalar un conector mecánico. Debes nombrar cada herramienta que usarías, en el orden correcto, y explicar brevemente qué haces con ella. Por ejemplo: "Paso 1: Uso la peladora de chaqueta para remover 5 cm de la cubierta exterior...". Adjunta una foto de una punta de fibra que hayas preparado y cortado tú mismo.',
                evaluationCriteria: [
                    'Secuencia correcta de los pasos (pelado, limpieza, corte).',
                    'Mención correcta de las herramientas para cada paso.',
                    'Descripción clara y concisa de cada acción.'
                ]
            }
        }
    },
    {
        id: 'template-ftth-03',
        topic: 'Instalación Domiciliaria: Acometida y Conectorización',
        role: 'Técnico Instalador FTTH',
        depth: 'Básico',
        course: {
            title: 'Ruta 3: Instalación Domiciliaria Exitosa (Básico)',
            description: 'Aprende el proceso físico de una instalación estándar, desde el tendido del cable de acometida hasta la instalación del conector y la roseta óptica.',
            modules: [
                {
                    moduleTitle: 'Módulo 1: Planificación de la Acometida',
                    lessons: [
                        { lessonTitle: 'Del Poste a la Casa: El Recorrido', initialContent: 'La **acometida** es el tramo de cable de fibra que va desde nuestra caja de distribución (CTO o NAP) en el poste hasta la casa del cliente. Antes de tender el cable, planifica la ruta más corta, segura y estéticamente aceptable. Evita cruzar sobre cables eléctricos y busca un recorrido discreto.', initialOptions: ['¿Qué es una CTO/NAP?', '¿Cómo se fija el cable?', '¿Necesito permiso del cliente?'] },
                        { lessonTitle: 'Tipos de Cable de Acometida', initialContent: 'Usamos principalmente cables de acometida **planos (drop flat)**, que contienen la fibra y un mensajero de acero para darle tensión y soporte. 📏 Asegúrate de dejar un bucle de reserva (coca) de cable en el poste y cerca de la casa, para futuras reparaciones o movimientos.', initialOptions: ['¿Por qué se deja una reserva?', '¿Cuánto cable debo dejar?', 'Siguiente.'] }
                    ],
                    quiz: [
                        { question: 'El cable que va del poste a la casa del cliente se llama:', options: ['Cable troncal', 'Cable de acometida', 'Pigtail', 'Patch cord'], correctAnswer: 'Cable de acometida' },
                        { question: 'La caja en el poste de donde sale la acometida se llama:', options: ['OLT', 'ONT', 'CTO o NAP', 'Router'], correctAnswer: 'CTO o NAP' },
                        { question: '¿Por qué se deja un bucle de reserva de cable?', options: ['Para que se vea más bonito', 'Para tener cable extra para futuras reparaciones', 'Es un requisito sin importancia', 'Para gastar más cable'], correctAnswer: 'Para tener cable extra para futuras reparaciones' },
                        { question: 'Al planificar la ruta de la acometida, debes buscar la ruta más:', options: ['Larga y complicada', 'Visible para todos', 'Corta, segura y estética', 'Cercana a los cables eléctricos'], correctAnswer: 'Corta, segura y estética' },
                        { question: 'El alambre de acero dentro del cable de acometida se llama:', options: ['Núcleo', 'Mensajero', 'Buffer', 'Kevlar'], correctAnswer: 'Mensajero' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 2: Técnicas de Tendido y Fijación',
                    lessons: [
                        { lessonTitle: 'El Anclaje: Grapas y Tensores', initialContent: 'Para fijar el cable de acometida, usamos **grapas de retención** o **tensores**. El mensajero de acero se ancla en el tensor, y el cable de fibra pasa sin tensión. 🛠️ En la pared de la casa, usa grapas de pared adecuadas para no estrangular el cable y causar macrocurvas.', initialOptions: ['¿Qué es una macrocurva?', '¿Cada cuánto pongo una grapa?', 'Siguiente.'] },
                        { lessonTitle: 'El Ingreso al Domicilio', initialContent: 'El punto de entrada a la casa debe ser acordado con el cliente. Se debe hacer una perforación limpia, usualmente con un taladro y una broca pasamuros. Una vez dentro, sella el agujero por fuera y por dentro con silicona para evitar filtraciones de agua o la entrada de insectos. 💧', initialOptions: ['¿Qué diámetro de broca uso?', '¿Qué hago si el cliente no quiere perforar?', 'Entendido.'] }
                    ],
                    quiz: [
                        { question: 'Para anclar la acometida y darle tensión, se usa el:', options: ['Propio cable de fibra', 'Mensajero de acero', 'Cinta aislante', 'Kevlar'], correctAnswer: 'Mensajero de acero' },
                        { question: 'Usar una grapa demasiado apretada en el cable puede causar una:', options: ['Mejora de señal', 'Macrocurva y pérdida de señal', 'Conexión más segura', 'No tiene efecto'], correctAnswer: 'Macrocurva y pérdida de señal' },
                        { question: 'Después de pasar el cable al interior de la casa, ¿qué debes hacer con la perforación?', options: ['Dejarla abierta para ventilación', 'Taparla con cinta', 'Sellarla con silicona por dentro y por fuera', 'Rellenarla con papel'], correctAnswer: 'Sellarla con silicona por dentro y por fuera' },
                        { question: 'La herramienta para fijar el cable a la pared de forma segura es:', options: ['Un clavo y un martillo', 'Grapas de pared adecuadas', 'Pegamento instantáneo', 'Cinta de doble cara'], correctAnswer: 'Grapas de pared adecuadas' },
                        { question: 'El punto de ingreso del cable a la casa debe ser:', options: ['Donde tú decidas', 'Acordado con el cliente', 'En el lugar más difícil', 'Cerca de una tubería de agua'], correctAnswer: 'Acordado con el cliente' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 3: Conectorización en Campo',
                    lessons: [
                        { lessonTitle: 'Conectores Mecánicos (Rápidos)', initialContent: 'El método más común en campo para poner un conector es el [searchable]conector mecánico o de campo[/searchable]. Después de preparar (pelar, limpiar, cortar) la punta de la fibra, la insertas en el conector. Un mecanismo interno la alinea con un trozo de fibra que ya viene dentro. Es rápido, pero introduce más pérdida que una fusión.', initialOptions: ['¿Qué es el gel de acoplamiento?', '¿Cómo sé si quedó bien puesto?', 'Siguiente.'] },
                        { lessonTitle: 'La Roseta Óptica: El Punto Final', initialContent: 'La **roseta óptica** es la caja de terminación que se instala en la pared dentro de la casa. 🏠 Dentro de ella, se organiza el excedente de fibra y se conecta el conector mecánico a un **acoplador**. Por fuera, de este acoplador saldrá un cable (patch cord) hacia la ONT.', initialOptions: ['¿Por qué se deja fibra de reserva en la roseta?', '¿Qué es un acoplador?', 'Entendido.'] }
                    ],
                    quiz: [
                        { question: 'El tipo de conector que se instala rápidamente en campo sin fusionadora se llama:', options: ['Pigtail', 'Conector mecánico', 'Conector de laboratorio', 'Patch cord'], correctAnswer: 'Conector mecánico' },
                        { question: 'La caja que se instala en la pared del cliente para terminar la fibra es la:', options: ['CTO', 'ONT', 'Roseta óptica', 'Splitter'], correctAnswer: 'Roseta óptica' },
                        { question: 'Dentro de la roseta, el conector de la acometida se conecta a un:', options: ['Switch', 'Acoplador', 'Fusible', 'Tornillo'], correctAnswer: 'Acoplador' },
                        { question: 'Comparado con una fusión, un conector mecánico típicamente tiene:', options: ['Menos pérdida de señal', 'Más pérdida de señal', 'La misma pérdida de señal', 'Cero pérdida de señal'], correctAnswer: 'Más pérdida de señal' },
                        { question: 'Antes de insertar la fibra en un conector mecánico, los 3 pasos son:', options: ['Medir, limpiar, cortar', 'Pelar, limpiar, cortar', 'Cortar, pelar, limpiar', 'Limpiar, medir, pelar'], correctAnswer: 'Pelar, limpiar, cortar' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 4: Verificación y Pruebas Iniciales',
                    lessons: [
                        { lessonTitle: 'La Primera Medición de Potencia', initialContent: 'Una vez que tienes la acometida dentro de la casa, pero **antes** de poner el conector, es el momento de la primera medición. Conectas tu Power Meter a la punta "desnuda" de la fibra usando un adaptador. Esto te dice la señal que llega desde la calle. Si aquí la señal ya es mala, el problema no está en tu conectorización.', initialOptions: ['¿Qué hago si la señal es mala aquí?', '¿Qué es un adaptador de fibra desnuda?', 'Siguiente.'] },
                        { lessonTitle: 'La Medición Final y el Diagnóstico', initialContent: 'Después de instalar el conector y la roseta, haces la medición final. Conectas el Power Meter al patch cord que saldrá hacia la ONT. La diferencia entre la primera y la segunda medición es la **pérdida que introdujo tu conector**. Debe ser muy baja (idealmente menos de 0.5 dB). Si la pérdida es alta, tu conector quedó mal instalado.', initialOptions: ['¿Qué es una pérdida aceptable?', '¿Qué hago si mi conector quedó mal?', 'Entendido.'] }
                    ],
                    quiz: [
                        { question: '¿Cuándo se debe realizar la primera medición de potencia en una instalación?', options: ['Al final de todo el proceso', 'Antes de instalar el conector mecánico', 'Al día siguiente', 'Solo si el cliente se queja'], correctAnswer: 'Antes de instalar el conector mecánico' },
                        { question: 'La diferencia de señal entre la medición antes y después del conector te indica:', options: ['La velocidad del plan', 'La pérdida introducida por tu conector', 'La distancia al poste', 'No significa nada'], correctAnswer: 'La pérdida introducida por tu conector' },
                        { question: 'Una pérdida de inserción ideal para un conector mecánico debería ser:', options: ['Menor a 0.5 dB', 'Entre 1 y 2 dB', 'Mayor a 3 dB', 'Exactamente 0 dB'], correctAnswer: 'Menor a 0.5 dB' },
                        { question: 'Si la primera medición (fibra desnuda) ya da una señal muy baja (ej. -30dBm), el problema probablemente está en:', options: ['Tu futuro conector', 'La red externa (CTO, cableado)', 'El Power Meter', 'La casa del cliente'], correctAnswer: 'La red externa (CTO, cableado)' },
                        { question: 'La medición final se realiza en el extremo del:', options: ['Cable de acometida', 'Patch cord que va a la ONT', 'Cable del poste', 'Conector de la CTO'], correctAnswer: 'Patch cord que va a la ONT' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 5: Organización y Limpieza del Sitio',
                    lessons: [
                        { lessonTitle: 'La Estética de la Instalación', initialContent: 'Una buena instalación no solo funciona bien, también se ve bien. Fija la roseta en un lugar lógico, organiza los cables con amarras o canaletas si es necesario. Un trabajo limpio y ordenado habla de tu profesionalismo y reduce la posibilidad de daños futuros.', initialOptions: ['¿Dónde es un buen lugar para la roseta?', '¿Debo usar canaletas?', 'Siguiente.'] },
                        { lessonTitle: 'No Dejar Rastro', initialContent: 'Al terminar, recoge **toda** la basura: recortes de cable, trozos de fibra (en su contenedor seguro), polvo de la perforación, empaques. Deja el área de trabajo del cliente más limpia de como la encontraste. Esto es parte fundamental de la **pasión por el cliente**.', initialOptions: ['¿Qué hago con los trozos de fibra?', '¿Quién provee los materiales de limpieza?', 'Entendido, trabajo terminado.'] }
                    ],
                    quiz: [
                        { question: 'Un trabajo limpio y ordenado demuestra:', options: ['Que tenías prisa', 'Profesionalismo', 'Que no tenías las herramientas correctas', 'Que el cliente no estaba mirando'], correctAnswer: 'Profesionalismo' },
                        { question: 'Al finalizar una instalación, debes:', options: ['Salir rápidamente', 'Dejar la basura para que el cliente la recoja', 'Recoger todas tus herramientas y basura', 'Pedirle al cliente que limpie'], correctAnswer: 'Recoger todas tus herramientas y basura' },
                        { question: 'Los trozos de fibra deben ser desechados en:', options: ['La basura del cliente', 'El suelo', 'Un contenedor seguro y específico para ello', 'El bolsillo'], correctAnswer: 'Un contenedor seguro y específico para ello' },
                        { question: 'Dejar el lugar de trabajo limpio es un ejemplo del valor de TELNET CO de:', options: ['Mejora Continua', 'Trabajo en Equipo', 'Pasión por el Cliente', 'Innovación'], correctAnswer: 'Pasión por el Cliente' },
                        { question: 'La organización de los cables dentro de la casa ayuda a:', options: ['Hacer la conexión más lenta', 'Prevenir desconexiones accidentales y daños', 'Confundir al cliente', 'No tiene ningún propósito'], correctAnswer: 'Prevenir desconexiones accidentales y daños' }
                    ]
                }
            ],
            finalProject: {
                title: 'Simulación de Instalación Domiciliaria Completa',
                description: 'Describe textualmente el proceso completo de una instalación, desde que llegas al poste hasta que dejas la roseta instalada y probada. Debes incluir: 1. La planificación de la ruta de acometida. 2. El proceso de tendido y fijación. 3. El paso a paso de la conectorización. 4. Dónde y cuándo harías las mediciones de potencia. 5. Cómo dejarías el sitio al terminar.',
                evaluationCriteria: [
                    'Descripción lógica y secuencial de todo el proceso de instalación.',
                    'Uso correcto de la terminología técnica (acometida, CTO, roseta, conector).',
                    'Inclusión de los puntos de control de calidad (mediciones) en los momentos correctos.'
                ]
            }
        }
    },
    {
        id: 'template-ftth-04',
        topic: 'Configuración y Activación de ONT en Cliente',
        role: 'Técnico Instalador FTTH',
        depth: 'Intermedio',
        course: {
            title: 'Ruta 4: Activación de Servicios en Cliente (Intermedio)',
            description: 'Aprende el proceso lógico de una instalación: la configuración de la ONT, la activación del servicio en coordinación con el NOC, y la configuración básica de la red Wi-Fi del cliente.',
            modules: [
                {
                    moduleTitle: 'Módulo 1: Instalación y Conexión de la ONT',
                    lessons: [
                        { lessonTitle: 'Ubicación Estratégica de la ONT', initialContent: 'La ubicación de la [searchable]ONT[/searchable] es clave. Debe estar cerca de una toma de corriente y en un lugar central de la casa para una mejor cobertura Wi-Fi (si la ONT es también el router). Evita lugares encerrados, cerca de metales o de otros aparatos electrónicos que puedan causar interferencia.', initialOptions: ['¿El cliente decide la ubicación?', '¿Qué hago si el mejor lugar no tiene enchufe?', 'Siguiente.'] },
                        { lessonTitle: 'Conexión Física: Patch Cord y Energía', initialContent: 'La conexión es simple: 1. Conecta el **patch cord** de fibra desde la roseta óptica al puerto PON/GPON de la ONT. 2. Conecta el adaptador de corriente de la ONT a un enchufe. 🔌 Espera unos minutos a que el equipo inicie completamente y las luces se estabilicen.', initialOptions: ['¿Qué es un "patch cord"?', '¿Qué indican las luces de la ONT?', 'Entendido.'] }
                    ],
                    quiz: [
                        { question: 'Para una mejor cobertura Wi-Fi, la ONT/Router debe ubicarse en:', options: ['Un armario cerrado', 'El sótano', 'Un lugar central y abierto de la casa', 'Cerca del microondas'], correctAnswer: 'Un lugar central y abierto de la casa' },
                        { question: 'El cable corto de fibra que va de la roseta a la ONT se llama:', options: ['Acometida', 'Cable de poder', 'Patch cord', 'Pigtail'], correctAnswer: 'Patch cord' },
                        { question: '¿Qué dos cosas se conectan a la ONT para que funcione?', options: ['El TV y el teléfono', 'El patch cord de fibra y el cable de corriente', 'Un cable de red y un cable USB', 'Solo el cable de corriente'], correctAnswer: 'El patch cord de fibra y el cable de corriente' },
                        { question: '¿Cuál de los siguientes lugares es el PEOR para ubicar un router Wi-Fi?', options: ['Encima de un estante de madera', 'En el centro de la sala', 'Dentro de un gabinete metálico', 'Lejos de las ventanas'], correctAnswer: 'Dentro de un gabinete metálico' },
                        { question: 'Después de conectar la ONT, debes:', options: ['Reiniciarla inmediatamente', 'Esperar a que las luces se estabilicen', 'Configurar el Wi-Fi de inmediato', 'Llamar al cliente'], correctAnswer: 'Esperar a que las luces se estabilicen' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 2: Coordinación con el NOC para Activación',
                    lessons: [
                        { lessonTitle: 'El Proceso de Provisión', initialContent: 'Tu instalación física está lista y la señal es correcta. Ahora, la ONT necesita ser **autorizada (aprovisionada)** en nuestra OLT. Este proceso lo realiza el **NOC (Centro de Operaciones de Red)** de forma remota. 📞', initialOptions: ['¿Qué información necesita el NOC?', '¿Cuánto tarda este proceso?', 'Siguiente.'] },
                        { lessonTitle: 'Comunicación con el NOC: El Dato Clave', initialContent: 'Para que el NOC pueda activar la ONT, necesitas proporcionarles el dato más importante: el **Número de Serie (SN o S/N)** de la ONT. Usualmente se encuentra en una etiqueta en la parte trasera o inferior del equipo. Comunícalo al NOC de forma clara y precisa a través del canal establecido (ej. llamada o Zoho Clip).', initialOptions: ['¿Qué es el número de serie?', '¿Qué hago si la etiqueta es ilegible?', '¿Qué confirma el NOC cuando termina?'] }
                    ],
                    quiz: [
                        { question: '¿Qué departamento de TELNET CO realiza la activación remota de la ONT?', options: ['Ventas', 'Recursos Humanos', 'NOC (Centro de Operaciones de Red)', 'Facturación'], correctAnswer: 'NOC (Centro de Operaciones de Red)' },
                        { question: '¿Cuál es el dato MÁS importante que debes darle al NOC para activar una ONT?', options: ['La dirección del cliente', 'El número de serie (SN) de la ONT', 'Tu nombre completo', 'La hora de instalación'], correctAnswer: 'El número de serie (SN) de la ONT' },
                        { question: 'El proceso de registrar y configurar una nueva ONT en la OLT se llama:', options: ['Instalación', 'Medición', 'Aprovisionamiento o autorización', 'Facturación'], correctAnswer: 'Aprovisionamiento o autorización' },
                        { question: 'Una vez el NOC autoriza la ONT, la luz "PON" en el equipo debería:', options: ['Ponerse roja', 'Apagarse', 'Quedar parpadeando rápidamente', 'Quedar encendida y fija'], correctAnswer: 'Quedar encendida y fija' },
                        { question: 'La comunicación con el NOC debe ser:', options: ['Lenta e informal', 'Clara, rápida y precisa', 'Solo por correo electrónico', 'A través del cliente'], correctAnswer: 'Clara, rápida y precisa' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 3: Configuración Básica del Router',
                    lessons: [
                        { lessonTitle: 'Accediendo a la Interfaz del Router', initialContent: 'Una vez la ONT está activa, si esta funciona como router, debes configurar la red Wi-Fi. Para ello, conectas un portátil al router por cable y accedes a su interfaz web a través de una dirección IP, usualmente `192.168.1.1` o `192.168.100.1`. El usuario y contraseña por defecto suelen estar en la etiqueta del equipo.', initialOptions: ['¿Qué es una dirección IP?', '¿Y si esa IP no funciona?', 'Siguiente.'] },
                        { lessonTitle: 'Configurando el Wi-Fi (SSID y Contraseña)', initialContent: 'Dentro de la interfaz, busca la sección de **Wireless** o **WLAN**. Aquí debes configurar dos cosas clave a petición del cliente: **1. SSID (Nombre de la red):** El nombre que el cliente quiere para su Wi-Fi. **2. Contraseña (Pre-Shared Key):** Una contraseña segura para su red, usando seguridad **WPA2** o **WPA3**.', initialOptions: ['¿Qué es WPA2?', '¿Qué es una contraseña segura?', '¿Debo configurar algo más?'] }
                    ],
                    quiz: [
                        { question: '¿Cuál es una dirección IP común para acceder a la configuración de un router?', options: ['8.8.8.8', '192.168.1.1', '255.255.255.0', 'google.com'], correctAnswer: '192.168.1.1' },
                        { question: 'El nombre de la red Wi-Fi se conoce como:', options: ['IP', 'WPA2', 'SSID', 'MAC'], correctAnswer: 'SSID' },
                        { question: 'El estándar de seguridad Wi-Fi recomendado actualmente es:', options: ['WEP', 'WPA', 'WPA2 o WPA3', 'Ninguno, dejarla abierta'], correctAnswer: 'WPA2 o WPA3' },
                        { question: '¿Dónde sueles encontrar el usuario y contraseña por defecto de un router?', options: ['En el contrato del cliente', 'En una etiqueta en el propio equipo', 'Debes adivinarlo', 'Todos usan "admin/admin"'], correctAnswer: 'En una etiqueta en el propio equipo' },
                        { question: 'La configuración de la red Wi-Fi se realiza a petición de:', options: ['El NOC', 'Tu supervisor', 'El cliente', 'Nadie, se deja por defecto'], correctAnswer: 'El cliente' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 4: Pruebas de Servicio y Verificación',
                    lessons: [
                        { lessonTitle: 'Prueba de Navegación y Conectividad', initialContent: '¡La prueba de fuego! 🔥 Conecta un dispositivo (tu celular o el del cliente) a la nueva red Wi-Fi e intenta navegar a varias páginas web (ej. google.com, telnet.com.co). Si cargan, tienes conectividad a internet. ¡Felicidades!', initialOptions: ['¿Qué hago si no navega?', '¿Debo probar en varios dispositivos?', 'Siguiente.'] },
                        { lessonTitle: 'El Test de Velocidad', initialContent: 'La última prueba es verificar que la velocidad del servicio sea la correcta. Usa una aplicación o página web de **test de velocidad** (como Speedtest.net o Fast.com) en un dispositivo conectado. El resultado debe ser muy cercano al plan que el cliente contrató. 🚀', initialOptions: ['¿Qué factores pueden afectar el test?', '¿Es mejor hacerlo por cable o Wi-Fi?', 'Entendido.'] }
                    ],
                    quiz: [
                        { question: 'La prueba más básica para confirmar que hay internet es:', options: ['Hacer un test de velocidad', 'Reiniciar el router', 'Intentar navegar a una página web', 'Mirar las luces de la ONT'], correctAnswer: 'Intentar navegar a una página web' },
                        { question: '¿Para qué sirve un test de velocidad?', options: ['Para ver cuántos dispositivos están conectados', 'Para medir el ping y las velocidades de carga y descarga', 'Para configurar la contraseña del Wi-Fi', 'Para ver la señal de la fibra'], correctAnswer: 'Para medir el ping y las velocidades de carga y descarga' },
                        { question: 'Para obtener el resultado más preciso, un test de velocidad se debe realizar preferiblemente:', options: ['Por Wi-Fi desde lejos', 'Con un dispositivo conectado por cable de red al router', 'Con muchos dispositivos usando internet al mismo tiempo', 'A la medianoche'], correctAnswer: 'Con un dispositivo conectado por cable de red al router' },
                        { question: 'Si las páginas web cargan pero el test de velocidad es muy bajo, ¿qué podría ser?', options: ['El cliente necesita un plan más caro', 'Un problema en el perfil de velocidad configurado por el NOC', 'El computador del cliente es muy lento', 'Todas las anteriores son posibles'], correctAnswer: 'Todas las anteriores son posibles' },
                        { question: 'Antes de irte, debes asegurarte de que:', options: ['El cliente sabe el nombre y la clave de su Wi-Fi', 'Al menos un dispositivo navega correctamente', 'La velocidad corresponde al plan contratado', 'Todas las anteriores'], correctAnswer: 'Todas las anteriores' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 5: Entrega del Servicio al Cliente',
                    lessons: [
                        { lessonTitle: 'Explicación Básica al Cliente', initialContent: 'Tu trabajo no termina al configurar el Wi-Fi. Tómate 2 minutos para explicarle al cliente: **1. Este es el nombre de tu red y esta es tu contraseña.** 2. **Qué hacer si el internet falla** (el famoso "reinicia la ONT y el router"). 3. **Cuáles son nuestros canales de soporte.** Un cliente informado es un cliente satisfecho.', initialOptions: ['¿Debo dejarle la clave anotada?', '¿Qué es lo más importante que debe recordar?', 'Siguiente.'] },
                        { lessonTitle: 'El Acta de Instalación y Cierre en Splynx', initialContent: 'El último paso es formalizar la entrega. Haz que el cliente firme el **Acta de Instalación**, confirmando que el servicio quedó funcionando. Inmediatamente después, toma una foto del acta, de la medición final y de la instalación, y **cierra la Tarea en Splynx** adjuntando todas las evidencias. ¡Ahora sí, trabajo completado! ✅', initialOptions: ['¿Qué pasa si el cliente no quiere firmar?', '¿Puedo cerrar la tarea más tarde?', 'Entendido. ¡A la siguiente instalación!'] }
                    ],
                    quiz: [
                        { question: '¿Qué información es crucial dejarle clara al cliente?', options: ['La marca y modelo de la ONT', 'El nombre y la contraseña de su red Wi-Fi', 'La dirección IP de la OLT', 'Tu número de teléfono personal'], correctAnswer: 'El nombre y la contraseña de su red Wi-Fi' },
                        { question: 'El documento que el cliente firma para aceptar el servicio se llama:', options: ['Contrato', 'Factura', 'Garantía', 'Acta de Instalación'], correctAnswer: 'Acta de Instalación' },
                        { question: 'Para cerrar tu trabajo en el sistema, debes actualizar la Tarea en:', options: ['OLT Cloud', 'Un grupo de WhatsApp', 'Splynx', 'Tu cuaderno personal'], correctAnswer: 'Splynx' },
                        { question: '¿Qué evidencias se adjuntan en Splynx para una instalación?', options: ['Solo la firma', 'Fotos de la instalación, medición y acta firmada', 'Un video de la instalación', 'No se adjunta nada'], correctAnswer: 'Fotos de la instalación, medición y acta firmada' },
                        { question: 'Enseñar al cliente a reiniciar sus equipos en caso de falla es un ejemplo de:', options: ['Pérdida de tiempo', 'Dar soporte proactivo y educar al cliente', 'Transferirle tu responsabilidad', 'Algo que solo debe hacer el NOC'], correctAnswer: 'Dar soporte proactivo y educar al cliente' }
                    ]
                }
            ],
            finalProject: {
                title: 'Checklist de Activación y Entrega',
                description: 'Crea un checklist detallado en texto con todos los pasos que seguirías desde el momento en que la ONT se enciende por primera vez hasta que te despides del cliente. El checklist debe incluir los puntos de coordinación con el NOC, la configuración del router, las pruebas de verificación y la entrega final del servicio al cliente, incluyendo la documentación en Splynx.',
                evaluationCriteria: [
                    'Inclusión de todos los pasos críticos en el orden correcto.',
                    'Claridad en la descripción de cada paso.',
                    'Énfasis en los puntos de control de calidad y la interacción con el cliente.'
                ]
            }
        }
    },
    {
        id: 'template-ftth-05',
        topic: 'Diagnóstico y Reparación de Averías Comunes en Campo',
        role: 'Técnico Instalador FTTH',
        depth: 'Intermedio',
        course: {
            title: 'Ruta 5: Diagnóstico y Reparación de Averías (Intermedio)',
            description: 'Aprende a pensar como un detective de la fibra. Domina las técnicas para diagnosticar y solucionar los problemas más comunes que encontrarás en el campo.',
            modules: [
                {
                    moduleTitle: 'Módulo 1: El Proceso de Diagnóstico Metódico',
                    lessons: [
                        { lessonTitle: 'Escuchar la Tarea de Splynx', initialContent: 'Tu investigación empieza leyendo la **Tarea en Splynx**. 🕵️‍♂️ ¿Qué reportó el cliente? ¿Qué luces vio el N1? ¿Qué diagnóstico hizo el NOC? Toda esa información son tus primeras pistas. Si el NOC reportó `-35 dBm` en OLT Cloud, ya sabes que tienes un problema serio de señal.', initialOptions: ['¿Qué hago si la tarea tiene poca información?', '¿Debo llamar al cliente antes de ir?', 'Siguiente.'] },
                        { lessonTitle: 'De Afuera hacia Adentro: Aislando la Falla', initialContent: 'El método más efectivo es empezar a medir desde el punto más cercano a la red e ir avanzando hacia el cliente. **Paso 1:** Mide en la CTO. Si la señal está bien ahí, la red troncal está OK. **Paso 2:** Mide en la entrada de la casa. Si está bien, la acometida está OK. **Paso 3:** Mide en la roseta. Si está bien, el cableado interno está OK. El punto donde la señal "se cae" es donde está la falla.', initialOptions: ['¿Qué potencias debo esperar en la CTO?', '¿Qué pasa si la señal ya está mal en la CTO?', 'Entendido, es un proceso de descarte.'] }
                    ],
                    quiz: [
                        { question: 'Tu primera fuente de información para una reparación es:', options: ['Llamar a tu supervisor', 'La Tarea asignada en Splynx', 'Preguntarle a otro técnico', 'La última factura del cliente'], correctAnswer: 'La Tarea asignada en Splynx' },
                        { question: 'El método de diagnóstico "de afuera hacia adentro" sirve para:', options: ['Hacer el trabajo más largo', 'Aislar sistemáticamente dónde está el punto de falla', 'Verificar solo la ONT', 'Culpar al cliente'], correctAnswer: 'Aislar sistemáticamente dónde está el punto de falla' },
                        { question: 'Si la señal en la CTO es buena pero en la entrada de la casa es mala, el problema está en:', options: ['La red troncal', 'La OLT', 'El cable de acometida', 'La ONT'], correctAnswer: 'El cable de acometida' },
                        { question: '¿Qué herramienta es indispensable para el método de diagnóstico por secciones?', options: ['Un taladro', 'Un multímetro', 'Un Power Meter Óptico', 'Una fusionadora'], correctAnswer: 'Un Power Meter Óptico' },
                        { question: 'Antes de ir a la casa del cliente, es una buena práctica:', options: ['Reiniciar la OLT', 'Llamar al cliente para coordinar la visita', 'Cancelar la tarea', 'No hacer nada'], correctAnswer: 'Llamar al cliente para coordinar la visita' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 2: Fallas de Conectorización y Cableado',
                    lessons: [
                        { lessonTitle: 'El Conector Malo: Causa #1', initialContent: 'Una causa extremadamente común de señal baja o nula es un **conector mecánico mal instalado**. Puede ser que la fibra no llegó al tope, que el corte no era perfecto, o que entró suciedad. La solución: **corta el conector y haz uno nuevo**. Siempre es la primera sospecha.', initialOptions: ['¿Cómo puedo saber si es el conector?', '¿Puedo "reparar" un conector mecánico?', 'Siguiente.'] },
                        { lessonTitle: 'Macrovurvas: El Enemigo Silencioso', initialContent: 'Una **macrocurva** (una curva muy cerrada) en el cable de acometida o en el patch cord puede causar una pérdida de señal masiva. Busca visualmente cables doblados en ángulos de 90 grados, aplastados por muebles o grapados con demasiada fuerza. A veces, simplemente alisar el cable soluciona el problema.', initialOptions: ['¿Cómo encuentro una macrocurva oculta?', '¿El VFL ayuda aquí?', 'Entendido.'] }
                    ],
                    quiz: [
                        { question: 'Ante una señal baja en la roseta, la primera acción correctiva suele ser:', options: ['Cambiar la ONT', 'Llamar al NOC', 'Cortar y hacer de nuevo el conector mecánico', 'Reiniciar el router'], correctAnswer: 'Cortar y hacer de nuevo el conector mecánico' },
                        { question: 'Un cable de fibra aplastado debajo de la pata de un sofá puede causar una:', options: ['Mejora en la velocidad', 'Macrovurva y pérdida de señal', 'Conexión más segura', 'No tiene efecto'], correctAnswer: 'Macrovurva y pérdida de señal' },
                        { question: 'La herramienta que te ayuda a ver una macrocurva como un punto de luz roja brillante es el:', options: ['Power Meter', 'Cleaver', 'VFL', 'Termómetro'], correctAnswer: 'VFL' },
                        { question: '¿Se puede reutilizar un conector mecánico que has cortado?', options: ['Sí, varias veces', 'No, es de un solo uso', 'Sí, si lo limpias bien', 'Solo si el cliente lo autoriza'], correctAnswer: 'No, es de un solo uso' },
                        { question: 'Una pérdida de más de 1 dB en un conector nuevo indica que:', options: ['La instalación fue perfecta', 'Probablemente quedó mal instalado', 'La fibra es de mala calidad', 'El Power Meter está dañado'], correctAnswer: 'Probablemente quedó mal instalado' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 3: Fibra Rota y Atenuadores',
                    lessons: [
                        { lessonTitle: 'Diagnóstico de una Fibra Rota', initialContent: 'Si la señal es nula (el Power Meter muestra "LO" o un valor muy bajo como -40 dBm) y el VFL no muestra luz en la punta, probablemente la **acometida esté rota** en algún punto. Inspecciona visualmente todo el recorrido del cable en busca de cortes, mordeduras o daños evidentes.', initialOptions: ['¿Qué hago si encuentro el corte?', '¿Y si no lo veo?', 'Siguiente.'] },
                        { lessonTitle: 'Señal Demasiado Fuerte: El Atenuador', initialContent: 'Es raro, pero a veces, si el cliente está muy cerca de la CTO y hay pocos splitters, la señal puede llegar **demasiado fuerte** (ej. -14 dBm). Esto puede "cegar" y dañar la ONT. La solución es instalar un **atenuador óptico**, que es como unas "gafas de sol" para la fibra, que reduce la señal en una cantidad fija (ej. 5 dB).', initialOptions: ['¿Cómo sé cuánta atenuación necesito?', '¿Dónde se instala el atenuador?', 'Entendido.'] }
                    ],
                    quiz: [
                        { question: 'Si tu Power Meter muestra "LO" o un valor extremadamente bajo, lo más probable es que:', options: ['La señal sea perfecta', 'La fibra esté rota', 'La ONT esté desconfigurada', 'El cliente no haya pagado'], correctAnswer: 'La fibra esté rota' },
                        { question: 'Un dispositivo que se usa para REDUCIR una señal óptica demasiado fuerte es un:', options: ['Amplificador', 'Splitter', 'Atenuador', 'Conector'], correctAnswer: 'Atenuador' },
                        { question: 'Si una señal llega a -14 dBm y necesitas que llegue a -19 dBm, necesitas un atenuador de:', options: ['3 dB', '5 dB', '10 dB', '1 dB'], correctAnswer: '5 dB' },
                        { question: 'Para reparar una acometida rota en el medio, generalmente se necesita:', options: ['Cinta aislante', 'Un conector mecánico', 'Instalar una caja de empalme y fusionar', 'Cambiar toda la acometida'], correctAnswer: 'Instalar una caja de empalme y fusionar' },
                        { question: 'Un atenuador se coloca usualmente:', options: ['En el poste', 'En el patch cord, justo antes de la ONT', 'Dentro de la OLT', 'Enterrado'], correctAnswer: 'En el patch cord, justo antes de la ONT' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 4: Problemas Relacionados con la ONT',
                    lessons: [
                        { lessonTitle: 'La ONT No Enciende', initialContent: 'Parece obvio, pero pasa. Si la ONT no tiene ninguna luz encendida, el problema es eléctrico. Verifica: 1. ¿El enchufe tiene corriente? (conecta otro aparato). 2. ¿El **adaptador de corriente (fuente de poder)** de la ONT está funcionando? A veces se dañan. Lleva siempre fuentes de repuesto.', initialOptions: ['¿Cómo pruebo un adaptador de corriente?', '¿Todas las ONT usan el mismo?', 'Siguiente.'] },
                        { lessonTitle: 'Flasheo o Reseteo de la ONT', initialContent: 'A veces, una ONT puede tener un problema de software y quedar "bloqueada". Un **reseteo de fábrica** puede solucionarlo. Busca el pequeño botón de "Reset" (a menudo hundido) y mantenlo presionado con un clip por 10-15 segundos. **¡Advertencia!** Esto borrará cualquier configuración, y la ONT deberá ser aprovisionada de nuevo por el NOC.', initialOptions: ['¿Cuándo debo hacer esto?', '¿Le aviso al NOC antes?', 'Entendido.'] }
                    ],
                    quiz: [
                        { question: 'Si ninguna luz de la ONT enciende, el problema es de tipo:', options: ['Óptico (fibra)', 'Software', 'Eléctrico (energía)', 'Configuración'], correctAnswer: 'Eléctrico (energía)' },
                        { question: 'Una causa común para que una ONT no encienda, incluso estando enchufada, es:', options: ['Fibra rota', 'Un adaptador de corriente dañado', 'Contraseña de Wi-Fi incorrecta', 'Un virus'], correctAnswer: 'Un adaptador de corriente dañado' },
                        { question: 'Realizar un reseteo de fábrica a una ONT causa que:', options: ['Se arregle la fibra', 'Se borre toda su configuración', 'Aumente la velocidad', 'No pase nada'], correctAnswer: 'Se borre toda su configuración' },
                        { question: 'Después de un reseteo de fábrica, la ONT necesita ser:', options: ['Limpiada', 'Reemplazada siempre', 'Aprovisionada de nuevo por el NOC', 'Pintada'], correctAnswer: 'Aprovisionada de nuevo por el NOC' },
                        { question: 'Antes de cambiar una ONT, ¿qué es lo último que deberías probar?', options: ['Cambiar el conector', 'Probar con otro adaptador de corriente', 'Medir la señal de nuevo', 'Reiniciar la OLT'], correctAnswer: 'Probar con otro adaptador de corriente' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 5: Documentación de la Avería',
                    lessons: [
                        { lessonTitle: 'Cerrando la Tarea en Splynx', initialContent: 'Resolver el problema es solo la mitad del trabajo. La otra mitad es documentarlo. En la **Tarea de Splynx**, debes explicar de forma clara y concisa: **1. Cuál era la causa raíz del problema.** (Ej: "Conector mecánico en roseta con alta pérdida"). **2. Qué acción correctiva realizaste.** (Ej: "Se rehizo conector y se verificó señal en -21 dBm").', initialOptions: ['¿Por qué es tan importante esto?', '¿Debo adjuntar fotos también?', 'Siguiente.'] },
                        { lessonTitle: 'La Importancia de un Buen Historial', initialContent: 'Tu nota en Splynx queda en el historial del cliente para siempre. Si en el futuro otro técnico o el NOC revisa ese cliente, tu nota le dará un contexto valioso sobre la salud de esa conexión. Un buen historial ahorra tiempo de diagnóstico en el futuro. ¡Piensa en tu "yo" del futuro y en tus compañeros!', initialOptions: ['¿Qué tipo de detalles son útiles?', '¿Qué debo evitar escribir?', 'Entendido. ¡A documentar!'] }
                    ],
                    quiz: [
                        { question: 'Al cerrar una tarea de reparación en Splynx, debes describir:', options: ['El clima del día', 'La causa del problema y la solución aplicada', 'La conversación que tuviste con el cliente', 'Cuánto tiempo te demoraste'], correctAnswer: 'La causa del problema y la solución aplicada' },
                        { question: '¿Por qué es tan importante documentar bien una reparación?', options: ['Para que tu jefe vea que trabajas', 'Para crear un historial técnico útil para futuras averías', 'Es un requisito burocrático sin importancia', 'Para poder cobrar más'], correctAnswer: 'Para crear un historial técnico útil para futuras averías' },
                        { question: 'Una buena nota de cierre en Splynx es:', options: ['Larga y detallada con opiniones personales', 'Corta, técnica y precisa', '"Se arregló"', 'No aplica'], correctAnswer: 'Corta, técnica y precisa' },
                        { question: '¿Es recomendable adjuntar una foto de la nueva medición de potencia tras una reparación?', options: ['No, nunca', 'Solo si el cliente lo pide', 'Sí, siempre es una buena práctica como evidencia', 'Solo si la señal quedó muy buena'], correctAnswer: 'Sí, siempre es una buena práctica como evidencia' },
                        { question: 'Pensar en que otros compañeros leerán tus notas es un ejemplo del valor de:', options: ['Pasión por el Cliente', 'Mejora Continua', 'Trabajo en Equipo', 'Innovación'], correctAnswer: 'Trabajo en Equipo' }
                    ]
                }
            ],
            finalProject: {
                title: 'Simulación de Diagnóstico de Tres Escenarios',
                description: 'Se te presentan tres tickets de Splynx con diferentes síntomas: 1. "Cliente sin servicio, luz LOS en rojo". 2. "Internet muy lento, se cae a ratos, señal remota en OLT Cloud -28.5 dBm". 3. "No prende la ONT, todo apagado". Para cada caso, describe en un texto cuál sería tu principal sospecha y cuál sería tu primer paso de diagnóstico al llegar a la casa del cliente.',
                evaluationCriteria: [
                    'Correcta interpretación de los síntomas de cada caso.',
                    'Planteamiento de una hipótesis de falla lógica para cada escenario.',
                    'Descripción de una primera acción de diagnóstico coherente y eficiente.'
                ]
            }
        }
    },
    {
        id: 'template-ftth-06',
        topic: 'Técnicas de Fusión de Fibra Óptica',
        role: 'Técnico Instalador FTTH',
        depth: 'Intermedio',
        course: {
            title: 'Ruta 6: Técnicas de Fusión de Fibra (Intermedio)',
            description: 'Eleva la calidad de tus conexiones aprendiendo el arte y la ciencia de la fusión por arco. Domina la preparación, ejecución y protección de empalmes perfectos.',
            modules: [
                {
                    moduleTitle: 'Módulo 1: Fusión vs. Conector Mecánico',
                    lessons: [
                        { lessonTitle: '¿Por Qué Fusionar?', initialContent: 'Un conector mecánico es rápido, pero une dos fibras a tope con un gel en medio. Una **fusión** usa un arco eléctrico para soldar los dos vidrios, creando una unión casi perfecta y continua. El resultado: una **pérdida de señal mucho menor (típicamente < 0.05 dB)** y una **conexión mucho más confiable y duradera**.', initialOptions: ['¿Cuál es la pérdida de un conector mecánico?', '¿Cuándo es mejor fusionar?', 'Siguiente.'] },
                        { lessonTitle: 'Pigtails: La Fusión en la Roseta', initialContent: 'Para tener la mejor calidad en la casa del cliente, en lugar de un conector mecánico, puedes fusionar un **pigtail**. Un [searchable]pigtail de fibra[/searchable] es un trozo corto de fibra con un conector de fábrica (de altísima calidad) en una punta. Tú fusionas la otra punta al cable de acometida, logrando una terminación de calidad superior.', initialOptions: ['¿Es más caro usar pigtails?', '¿Toma mucho más tiempo?', 'Entendido.'] }
                    ],
                    quiz: [
                        { question: 'La principal ventaja de un empalme por fusión sobre uno mecánico es:', options: ['Es más rápido de hacer', 'Menor pérdida de señal y mayor confiabilidad', 'No requiere herramientas especiales', 'Es más barato'], correctAnswer: 'Menor pérdida de señal y mayor confiabilidad' },
                        { question: 'Una pérdida de señal típica para una buena fusión es:', options: ['Menor a 0.05 dB', 'Alrededor de 0.5 dB', 'Mayor a 1 dB', 'Exactamente 0.75 dB'], correctAnswer: 'Menor a 0.05 dB' },
                        { question: 'Un trozo de cable con un conector de fábrica en una punta se llama:', options: ['Acometida', 'Patch cord', 'Pigtail', 'Splitter'], correctAnswer: 'Pigtail' },
                        { question: 'Fusionar un pigtail en la roseta del cliente resulta en:', options: ['Una conexión de menor calidad', 'Una terminación de calidad superior', 'Una instalación más rápida', 'Mayor pérdida de señal'], correctAnswer: 'Una terminación de calidad superior' },
                        { question: 'La fusión utiliza un ______ para unir las fibras.', options: ['Pegamento especial', 'Arco eléctrico', 'Gel de acoplamiento', 'Mecanismo de presión'], correctAnswer: 'Arco eléctrico' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 2: El Proceso de Fusión Paso a Paso',
                    lessons: [
                        { lessonTitle: 'Preparación Impecable de la Fibra', initialContent: 'El 90% del éxito de una fusión está en la preparación. El proceso es idéntico al de un conector, pero aún más riguroso: **1. Pelar** las capas con el stripper. **2. Limpiar** la fibra desnuda con alcohol isopropílico. **3. Cortar** la fibra con el cleaver de precisión para obtener una cara perfecta a 90 grados.', initialOptions: ['¿Qué pasa si no limpio bien?', '¿Cuánto debo pelar?', 'Siguiente.'] },
                        { lessonTitle: 'Alineación y Fusión Automática', initialContent: 'Colocas cada fibra en las guías de la [searchable]fusionadora[/searchable]. La máquina hace el resto: sus cámaras y motores de precisión **alinean los núcleos** de las fibras a nivel micrométrico, luego aplica un **arco eléctrico** para fundirlas y unirlas, y finalmente realiza un **test de tensión** y **estima la pérdida** del empalme. ¡Es pura magia tecnológica!', initialOptions: ['¿Qué es la alineación por núcleo?', '¿Qué significa si da un error?', 'Entendido.'] }
                    ],
                    quiz: [
                        { question: 'El éxito de una fusión depende en un 90% de:', options: ['La marca de la fusionadora', 'La temperatura ambiente', 'La correcta preparación de la fibra', 'La suerte'], correctAnswer: 'La correcta preparación de la fibra' },
                        { question: 'Las fusionadoras modernas usan cámaras y motores para:', options: ['Tomar fotos del proceso', 'Alinear los núcleos de las fibras con precisión', 'Enfriar la fibra después de la fusión', 'Limpiar la fibra automáticamente'], correctAnswer: 'Alinear los núcleos de las fibras con precisión' },
                        { question: 'Después de fusionar, la máquina realiza un test de ______ y estima la ______.', options: ['velocidad / latencia', 'tensión / pérdida', 'color / temperatura', 'voltaje / resistencia'], correctAnswer: 'tensión / pérdida' },
                        { question: 'El orden correcto de preparación de la fibra es:', options: ['Cortar, limpiar, pelar', 'Limpiar, pelar, cortar', 'Pelar, cortar, limpiar', 'Pelar, limpiar, cortar'], correctAnswer: 'Pelar, limpiar, cortar' },
                        { question: 'Si la fusionadora muestra un error como "Bad fiber end face", la causa más probable es:', options: ['Un mal corte con el cleaver', 'La fibra está sucia', 'La fibra está rota', 'Cualquiera de las anteriores'], correctAnswer: 'Cualquiera de las anteriores' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 3: Protección del Empalme',
                    lessons: [
                        { lessonTitle: 'El Manguito Termocontráctil', initialContent: 'La fusión es vidrio soldado con vidrio. ¡Es muy frágil! Para protegerla, antes de fusionar, debes haber pasado un **manguito termocontráctil (sleeve)** por una de las fibras. Después de la fusión, deslizas el manguito sobre la unión y lo metes en el pequeño horno de la fusionadora. El calor lo contrae, y una varilla de acero interna le da rigidez y protección mecánica.', initialOptions: ['¿Qué pasa si olvido poner el manguito?', '¿Cuánto tiempo tarda en el horno?', 'Siguiente.'] },
                        { lessonTitle: 'Organización en Cajas de Empalme', initialContent: 'Los empalmes fusionados se alojan en **bandejas de empalme** dentro de cajas de empalme o CTOs. Debes enrollar cuidadosamente el excedente de fibra en la bandeja y asegurar el manguito en su ranura designada. Una buena organización previene futuras roturas y facilita el mantenimiento.', initialOptions: ['¿Por qué se deja fibra de reserva?', '¿Cómo se organiza la bandeja?', 'Entendido.'] }
                    ],
                    quiz: [
                        { question: '¿Para qué sirve un manguito termocontráctil?', options: ['Para limpiar la fusión', 'Para medir la pérdida del empalme', 'Para proteger mecánicamente la fusión', 'Para enfriar la fusión'], correctAnswer: 'Para proteger mecánicamente la fusión' },
                        { question: '¿En qué momento del proceso debes colocar el manguito en la fibra?', options: ['Después de fusionar', 'Antes de empezar a pelar la fibra', 'Después de meterlo al horno', 'No es necesario'], correctAnswer: 'Antes de empezar a pelar la fibra' },
                        { question: 'Si olvidas poner el manguito y ya has fusionado, debes:', options: ['Dejar la fusión sin proteger', 'Ponerle cinta aislante', 'Romper la fusión y hacerla de nuevo, esta vez con el manguito', 'Intentar abrir el manguito y ponerlo encima'], correctAnswer: 'Romper la fusión y hacerla de nuevo, esta vez con el manguito' },
                        { question: 'Los empalmes fusionados se organizan y protegen dentro de:', options: ['Cajas de cartón', 'Bolsas plásticas', 'Bandejas de empalme', 'La ONT del cliente'], correctAnswer: 'Bandejas de empalme' },
                        { question: 'La varilla metálica dentro de un manguito sirve para:', options: ['Conducir electricidad', 'Darle rigidez al empalme', 'Atraer la luz', 'Disipar el calor'], correctAnswer: 'Darle rigidez al empalme' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 4: Fusionando en la Red de Distribución',
                    lessons: [
                        { lessonTitle: 'Trabajando en una CTO/NAP', initialContent: 'Fusionar en una **Caja de Terminación Óptica (CTO)**, también llamada NAP, requiere orden. Estas cajas tienen bandejas para organizar las fusiones de la fibra troncal con los splitters y las salidas hacia los clientes. Respeta el código de colores de las fibras y documenta siempre qué fibra y qué puerto de splitter estás usando para tu cliente.', initialOptions: ['¿Qué es el código de colores?', '¿Qué es una "sangría"?', 'Siguiente.'] },
                        { lessonTitle: 'La Sangría o Mid-Span Access', initialContent: 'A veces necesitas sacar un hilo de fibra de un cable troncal sin cortarlo por completo. Esto se llama **sangría (mid-span access)**. Se usan herramientas especiales para abrir una "ventana" en la chaqueta del cable y en los tubos (buffers) para acceder a las fibras internas sin interrumpir el servicio de las demás. Es una técnica avanzada que requiere mucha práctica.', initialOptions: ['¿Es un procedimiento riesgoso?', '¿Qué herramientas se usan?', 'Entendido.'] }
                    ],
                    quiz: [
                        { question: 'La caja en el poste que contiene los splitters y donde se conectan las acometidas se llama:', options: ['ONT', 'OLT', 'CTO / NAP', 'Roseta'], correctAnswer: 'CTO / NAP' },
                        { question: 'La técnica para acceder a las fibras de un cable principal sin cortarlo se llama:', options: ['Fusión', 'Conectorización', 'Sangría (mid-span access)', 'Splitteo'], correctAnswer: 'Sangría (mid-span access)' },
                        { question: '¿Para qué sirve el código de colores en los cables de fibra?', options: ['Para que se vean bonitos', 'Para identificar cada hilo de fibra de forma única', 'Para indicar la velocidad', 'No tiene ningún propósito'], correctAnswer: 'Para identificar cada hilo de fibra de forma única' },
                        { question: 'Al trabajar en una CTO, es crucial:', options: ['Usar los colores que más te gusten', 'Documentar y respetar la organización existente', 'Dejar la caja abierta', 'Cortar todas las fibras para empezar de cero'], correctAnswer: 'Documentar y respetar la organización existente' },
                        { question: 'Una sangría mal hecha puede causar:', options: ['Una mejora en la señal', 'La interrupción del servicio para muchos clientes', 'Un ahorro de cable', 'No tiene consecuencias'], correctAnswer: 'La interrupción del servicio para muchos clientes' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 5: Diagnóstico de Fusiones Defectuosas',
                    lessons: [
                        { lessonTitle: 'Interpretando la Estimación de la Fusionadora', initialContent: 'Después de cada fusión, la máquina te dará una **estimación de pérdida** (ej. 0.02 dB). Si este valor es alto (ej. > 0.1 dB), es una señal de que algo salió mal. La máquina también puede mostrar una imagen de la fusión; busca burbujas, líneas o desalineamientos en la imagen como pistas del problema.', initialOptions: ['¿Qué causa una pérdida alta?', '¿La estimación es 100% precisa?', 'Siguiente.'] },
                        { lessonTitle: 'Verificación con OTDR', initialContent: 'La única forma de saber la pérdida real de una fusión y su calidad a largo plazo es midiéndola con un **OTDR (Reflectómetro Óptico en el Dominio del Tiempo)**. Esta herramienta avanzada te mostrará la fusión como un "evento" en una gráfica, permitiéndote medir la pérdida con gran precisión. Aprenderás más sobre esto en rutas avanzadas.', initialOptions: ['¿Qué es un OTDR?', '¿El técnico de campo usa un OTDR?', 'Entendido, ¡a fusionar!'] }
                    ],
                    quiz: [
                        { question: 'Si tu fusionadora estima una pérdida de 0.25 dB, ¿qué debes hacer?', options: ['Aceptar la fusión, es un buen valor', 'Ignorar la advertencia', 'Rechazar la fusión, romperla y hacerla de nuevo', 'Limpiar la fusionadora'], correctAnswer: 'Rechazar la fusión, romperla y hacerla de nuevo' },
                        { question: 'Una burbuja o una línea oscura en la imagen de la fusión indica:', options: ['Una fusión perfecta', 'Un problema (suciedad, mal corte)', 'Que la fibra es de buena calidad', 'Que la máquina necesita calibración'], correctAnswer: 'Un problema (suciedad, mal corte)' },
                        { question: 'La herramienta que mide con mayor precisión la pérdida de un empalme es el:', options: ['Power Meter', 'VFL', 'OTDR', 'Multímetro'], correctAnswer: 'OTDR' },
                        { question: '¿Cuál de las siguientes es una causa común de una mala fusión?', options: ['Un corte de fibra imperfecto (mal cleave)', 'Suciedad en la fibra', 'Electrodos de la fusionadora sucios o gastados', 'Todas las anteriores'], correctAnswer: 'Todas las anteriores' },
                        { question: 'Una fusión de alta calidad es esencial para:', options: ['Hacer la instalación más lenta', 'Garantizar una conexión estable y con mínima pérdida a largo plazo', 'Gastar más material', 'Impresionar al cliente'], correctAnswer: 'Garantizar una conexión estable y con mínima pérdida a largo plazo' }
                    ]
                }
            ],
            finalProject: {
                title: 'Simulación de Reparación de Acometida con Fusión',
                description: 'Un cliente rompió su acometida a 5 metros de la casa. Describe tu plan de acción completo para repararla usando una caja de empalme pequeña y tu fusionadora. Debes detallar: 1. Las herramientas que prepararías. 2. El proceso paso a paso de preparación de ambos extremos del cable roto. 3. El proceso de fusión y protección con manguito. 4. Cómo organizarías la fibra y el empalme en la caja. 5. La prueba final que harías para verificar que la reparación fue exitosa.',
                evaluationCriteria: [
                    'Descripción correcta y ordenada del proceso de reparación por fusión.',
                    'Mención de todas las herramientas y materiales necesarios.',
                    'Inclusión de los pasos de protección y organización del empalme.',
                    'Descripción de una prueba de validación final coherente (ej. medición de potencia).'
                ]
            }
        }
    },
    {
        id: 'template-ftth-07',
        topic: 'Interpretación de OTDR para Localización de Fallas',
        role: 'Técnico Instalador FTTH',
        depth: 'Avanzado',
        course: {
            title: 'Ruta 7: Interpretación de OTDR (Avanzado)',
            description: 'Conviértete en un detective de élite de la red. Aprende a operar un OTDR y a interpretar sus trazas para encontrar fallas a kilómetros de distancia con una precisión asombrosa.',
            modules: [
                {
                    moduleTitle: 'Módulo 1: Principios del OTDR',
                    lessons: [
                        { lessonTitle: '¿Qué es un OTDR?', initialContent: 'Un **OTDR (Optical Time-Domain Reflectometer)** es un radar para fibra óptica. Envía un potente pulso de luz por la fibra y mide el tiempo y la intensidad de la luz que se refleja o se retrodispersa. Con esta información, dibuja una gráfica (traza) que es un mapa de todo lo que le pasa a la señal a lo largo del cable.', initialOptions: ['¿Qué es la retrodispersión?', '¿Es lo mismo que un Power Meter?', 'Siguiente.'] },
                        { lessonTitle: 'Configurando una Medición', initialContent: 'Antes de medir, debes configurar el OTDR. Los parámetros clave son: **1. Longitud de Onda:** (ej. 1310nm, 1550nm). **2. Rango de Distancia:** Debe ser mayor a la longitud del cable que mides. **3. Ancho de Pulso:** Pulsos cortos dan más resolución (ven eventos cercanos), pulsos largos llegan más lejos. **4. Tiempo de Promediado:** Más tiempo reduce el ruido y da una traza más limpia.', initialOptions: ['¿Qué es el "índice de refracción"?', '¿Qué es la "zona muerta"?', 'Entendido.'] }
                    ],
                    quiz: [
                        { question: 'Un OTDR funciona como un:', options: ['Termómetro para fibra', 'Radar para fibra', 'Voltímetro para fibra', 'Amperímetro para fibra'], correctAnswer: 'Radar para fibra' },
                        { question: 'Para ver eventos muy cercanos entre sí, debes usar un ancho de pulso:', options: ['Largo', 'Corto', 'Mediano', 'No importa el pulso'], correctAnswer: 'Corto' },
                        { question: 'Si el cable que vas a medir mide 10 km, ¿qué rango de distancia deberías configurar?', options: ['1 km', '5 km', 'Un rango mayor a 10 km, ej. 20 km', 'No se configura la distancia'], correctAnswer: 'Un rango mayor a 10 km, ej. 20 km' },
                        { question: 'Aumentar el tiempo de promediado en un OTDR sirve para:', options: ['Hacer la medida más rápido', 'Introducir más ruido en la traza', 'Obtener una traza más limpia y precisa', 'Gastar más batería'], correctAnswer: 'Obtener una traza más limpia y precisa' },
                        { question: 'Un OTDR mide la luz que es:', options: ['Absorbida por la fibra', 'Reflejada y retrodispersada', 'Transmitida hasta el final', 'Convertida en calor'], correctAnswer: 'Reflejada y retrodispersada' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 2: Anatomía de una Traza de OTDR',
                    lessons: [
                        { lessonTitle: 'La Línea Base: La Fibra Misma', initialContent: 'La [searchable]traza de OTDR[/searchable] es una gráfica con la distancia en el eje X y la potencia (en dB) en el eje Y. La línea principal que desciende suavemente representa la atenuación normal de la fibra a medida que la luz viaja. Una pendiente más pronunciada significa una fibra de peor calidad o con problemas.', initialOptions: ['¿Por qué la línea desciende?', '¿Qué es la atenuación por km?', 'Siguiente.'] },
                        { lessonTitle: 'Eventos: Cosas que Pasan en la Fibra', initialContent: 'Cualquier cosa que no sea la fibra misma es un **evento**. Los eventos se ven como interrupciones en la línea base. Hay dos tipos principales: **1. Eventos Reflectivos:** Picos hacia arriba, causados por conectores, roturas o el final de la fibra. **2. Eventos No Reflectivos:** Caídas súbitas sin pico, causadas por empalmes por fusión o macrocurvas.', initialOptions: ['¿Cómo diferencio un conector de una rotura?', '¿Una fusión perfecta se ve en el OTDR?', 'Entendido.'] }
                    ],
                    quiz: [
                        { question: 'En una traza de OTDR, el eje X representa la:', options: ['Potencia', 'Distancia', 'Longitud de onda', 'Temperatura'], correctAnswer: 'Distancia' },
                        { question: 'Una caída súbita en la traza, sin un pico hacia arriba, es un evento no reflectivo, típico de:', options: ['Un conector', 'El final de la fibra', 'Un empalme por fusión o una macrocurva', 'Una rotura al aire'], correctAnswer: 'Un empalme por fusión o una macrocurva' },
                        { question: 'Un pico agudo hacia arriba en la traza es un evento reflectivo, típico de:', options: ['Una macrocurva', 'Una fusión perfecta', 'Un conector o una rotura', 'Una atenuación normal'], correctAnswer: 'Un conector o una rotura' },
                        { question: 'La pendiente descendente de la línea base de la traza representa:', options: ['La velocidad de la luz', 'La atenuación normal de la fibra', 'La cantidad de clientes', 'La temperatura del cable'], correctAnswer: 'La atenuación normal de la fibra' },
                        { question: 'Si la pendiente de la fibra de repente se vuelve más pronunciada, podría indicar:', options: ['Una mejora en la fibra', 'Una sección de fibra dañada o de mala calidad', 'El final del cable', 'Un conector'], correctAnswer: 'Una sección de fibra dañada o de mala calidad' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 3: Analizando Eventos Reflectivos',
                    lessons: [
                        { lessonTitle: 'El Evento de un Conector', initialContent: 'Un buen conector se ve como un pico reflectivo seguido de una pequeña caída (la pérdida de inserción). El OTDR te permite colocar cursores para medir tanto la **reflectancia** (qué tan "brillante" es el pico) como la **pérdida** (cuánto cae la señal después del pico).', initialOptions: ['¿Qué es una buena pérdida para un conector?', '¿Y una buena reflectancia?', 'Siguiente.'] },
                        { lessonTitle: 'El Final de la Fibra y Roturas', initialContent: 'El **final de la fibra** se ve como un pico reflectivo muy grande y después, la traza cae abruptamente al nivel de ruido. ¡No hay más fibra que medir! Una **rotura** se ve muy similar, pero ocurre a una distancia inesperada. El OTDR te dirá con precisión a cuántos metros o kilómetros está esa rotura.', initialOptions: ['¿Qué es el "nivel de ruido"?', '¿Cómo diferencio el final de una rotura?', 'Entendido.'] }
                    ],
                    quiz: [
                        { question: 'Un evento reflectivo con un gran pico, después del cual la traza cae al nivel de ruido, indica:', options: ['Un buen empalme', 'Una macrocurva', 'El final de la fibra o una rotura', 'Un splitter'], correctAnswer: 'El final de la fibra o una rotura' },
                        { question: 'Con un OTDR, puedes medir dos características de un conector:', options: ['Color y temperatura', 'Pérdida y reflectancia', 'Voltaje y corriente', 'Ancho y alto'], correctAnswer: 'Pérdida y reflectancia' },
                        { question: 'Si una traza debería medir 10 km pero encuentras un evento final a los 3.25 km, has encontrado:', options: ['Un splitter', 'Un empalme', 'Una rotura en el cable', 'Una atenuación normal'], correctAnswer: 'Una rotura en el cable' },
                        { question: 'Una alta reflectancia en un conector es:', options: ['Buena, significa que la luz rebota bien', 'Mala, puede causar problemas en la red', 'Indiferente', 'Imposible de medir'], correctAnswer: 'Mala, puede causar problemas en la red' },
                        { question: 'La principal utilidad del OTDR en una avería es:', options: ['Medir la velocidad de internet', 'Decirte la ubicación exacta de una falla', 'Limpiar los conectores', 'Configurar la ONT'], correctAnswer: 'Decirte la ubicación exacta de una falla' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 4: Analizando Eventos No Reflectivos',
                    lessons: [
                        { lessonTitle: 'El Evento de una Fusión', initialContent: 'Un empalme por fusión ideal tiene tan poca pérdida que es casi invisible para el OTDR. Una fusión normal se ve como una pequeña caída vertical en la traza, sin pico reflectivo. Si la caída es muy grande, la fusión tiene una alta pérdida y debe rehacerse.', initialOptions: ['¿Cuánto es una pérdida aceptable?', '¿Puede una fusión "ganar" señal?', 'Siguiente.'] },
                        { lessonTitle: 'Detectando Curvas (Macrobends)', initialContent: 'Una macrocurva también se ve como un evento no reflectivo, una caída en la señal. La clave para diferenciarla de una fusión es que la pérdida de una curva a menudo **depende de la longitud de onda**. Si mides a 1550nm, la pérdida por la curva será mucho mayor que si mides a 1310nm. Esto es una pista clave.', initialOptions: ['¿Por qué la pérdida cambia con la longitud de onda?', '¿El OTDR me dice "esto es una curva"?', 'Entendido.'] }
                    ],
                    quiz: [
                        { question: 'Un evento no reflectivo es típico de:', options: ['Un conector SC/APC', 'Una rotura de fibra', 'Un empalme por fusión', 'El inicio del cable'], correctAnswer: 'Un empalme por fusión' },
                        { question: 'A veces, una traza de OTDR puede mostrar una "ganancia" aparente en una fusión. Esto es un error de medición llamado:', options: ['Evento fantasma', 'Gainer', 'Pico de Fresnel', 'Zona muerta'], correctAnswer: 'Gainer' },
                        { question: 'Una pista para identificar una macrocurva con un OTDR es:', options: ['Medir con un pulso muy largo', 'Medir en dos longitudes de onda (ej. 1310 y 1550nm) y comparar las pérdidas', 'Calentar la fibra', 'Enfriar la fibra'], correctAnswer: 'Medir en dos longitudes de onda (ej. 1310 y 1550nm) y comparar las pérdidas' },
                        { question: 'En una curva, la pérdida de señal suele ser mayor en la longitud de onda de:', options: ['1310nm', '1550nm', 'Son iguales', 'No se puede medir'], correctAnswer: '1550nm' },
                        { question: 'Si un evento no reflectivo tiene una pérdida de 0.8 dB, es probable que sea:', options: ['Una fusión excelente', 'Una fusión mala o una curva severa', 'Un conector', 'El final de la fibra'], correctAnswer: 'Una fusión mala o una curva severa' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 5: Escenarios Prácticos y Documentación',
                    lessons: [
                        { lessonTitle: 'Caso Práctico: Falla Masiva en un Tramo', initialContent: 'El NOC reporta un puerto PON entero caído. Vas al nodo, conectas el OTDR a la fibra troncal de ese PON. La traza muestra una rotura a 2.345 km. Con los mapas de la red, puedes determinar que esa distancia corresponde a un cruce de calle específico. ¡Has encontrado el punto exacto para que el equipo de reparación trabaje!', initialOptions: ['¿Necesito un "lanzador" de fibra?', '¿Cómo se documenta esto?', 'Siguiente.'] },
                        { lessonTitle: 'Guardando y Reportando Trazas', initialContent: 'Cada medición importante debe ser guardada. El archivo de la traza (usualmente en formato `.sor`) es la "radiografía" de esa fibra en ese momento. Al documentar una reparación en Splynx, adjuntar la traza del antes y el después es la mejor evidencia de un trabajo bien hecho.', initialOptions: ['¿Qué es un archivo .sor?', '¿Qué software uso para verlas?', 'Entendido. ¡A medir!'] }
                    ],
                    quiz: [
                        { question: 'Un "lanzador" de fibra (launch cable) se usa con el OTDR para:', options: ['Extender el alcance de la medición', 'Poder ver y medir el primer conector de la red', 'Limpiar la fibra antes de medir', 'Atenuar la señal'], correctAnswer: 'Poder ver y medir el primer conector de la red' },
                        { question: 'El formato de archivo estándar para guardar una traza de OTDR es:', options: ['.txt', '.pdf', '.jpg', '.sor'], correctAnswer: '.sor' },
                        { question: 'En un escenario de falla masiva, el OTDR es la herramienta más eficiente para:', options: ['Medir la velocidad de cada cliente', 'Encontrar la distancia exacta al punto de la falla', 'Reiniciar la OLT', 'Hablar con los clientes'], correctAnswer: 'Encontrar la distancia exacta al punto de la falla' },
                        { question: 'Adjuntar una traza de OTDR a una tarea en Splynx sirve como:', options: ['Una forma de gastar datos', 'Evidencia técnica y profesional del trabajo realizado', 'Un requisito sin importancia', 'Algo que solo los ingenieros entienden'], correctAnswer: 'Evidencia técnica y profesional del trabajo realizado' },
                        { question: 'Un OTDR es una herramienta de tipo:', options: ['Preventivo', 'Correctivo', 'De diagnóstico avanzado', 'Todas las anteriores'], correctAnswer: 'Todas las anteriores' }
                    ]
                }
            ],
            finalProject: {
                title: 'Análisis de Trazas de OTDR',
                description: 'Se te presentarán 3 imágenes de trazas de OTDR diferentes. Para cada una, debes identificar: 1. El tipo de evento principal que se muestra (ej. conector, fusión, rotura). 2. La distancia a la que ocurre el evento. 3. Una evaluación de si el evento es "aceptable" o "malo" y por qué (ej. "Conector malo por alta pérdida y reflectancia").',
                evaluationCriteria: [
                    'Identificación correcta del tipo de evento en cada traza.',
                    'Lectura precisa de la distancia del evento en la gráfica.',
                    'Justificación técnica coherente sobre la calidad del evento.'
                ]
            }
        }
    },
    {
        id: 'template-ftth-08',
        topic: 'Mantenimiento de Redes de Distribución FTTH',
        role: 'Técnico Instalador FTTH',
        depth: 'Avanzado',
        course: {
            title: 'Ruta 8: Mantenimiento de Red de Distribución (Avanzado)',
            description: 'Ve más allá de la casa del cliente. Aprende a trabajar en la red de distribución, gestionando CTOs, realizando sangrías y ejecutando mantenimiento preventivo.',
            modules: [
                {
                    moduleTitle: 'Módulo 1: La Caja de Terminación Óptica (CTO)',
                    lessons: [
                        { lessonTitle: 'Anatomía de una CTO/NAP', initialContent: 'La [searchable]CTO o NAP[/searchable] es el punto de encuentro en el poste. Dentro, encontrarás: **1. Bandejas de empalme:** para las fusiones. **2. Splitters:** para dividir la señal. **3. Puertos de acometida:** para conectar los cables drop que van a los clientes. La organización y etiquetado dentro de la CTO es vital.', initialOptions: ['¿Qué tipo de splitters usamos?', '¿Cómo se sella una CTO?', 'Siguiente.'] },
                        { lessonTitle: 'Balanceado vs. Desbalanceado', initialContent: 'Los splitters pueden ser **balanceados** (dividen la señal por igual, ej. un 1:8) o **desbalanceados** (sacan una pequeña parte de la señal y dejan pasar el resto, ej. un 90/10). Las redes GPON como la nuestra usan principalmente **splitters balanceados** para asegurar que todos los clientes de una CTO reciban una potencia similar.', initialOptions: ['¿Dónde se usaría uno desbalanceado?', '¿Qué es la "pérdida por inserción" de un splitter?', 'Entendido.'] }
                    ],
                    quiz: [
                        { question: '¿Qué componente clave se encuentra dentro de una CTO?', options: ['La OLT', 'Las ONTs', 'Los Splitters', 'Los routers de los clientes'], correctAnswer: 'Los Splitters' },
                        { question: 'En una red GPON, se usan principalmente splitters de tipo:', options: ['Desbalanceado', 'Mecánico', 'Balanceado', 'Activo'], correctAnswer: 'Balanceado' },
                        { question: 'Una buena organización y etiquetado dentro de una CTO es importante para:', options: ['Hacerla más pesada', 'Facilitar futuras instalaciones y reparaciones', 'Cumplir una norma estética', 'No es importante'], correctAnswer: 'Facilitar futuras instalaciones y reparaciones' },
                        { question: 'Un splitter 1:16 tiene:', options: ['1 entrada y 16 salidas', '16 entradas y 1 salida', '8 entradas y 8 salidas', 'No se puede saber'], correctAnswer: '1 entrada y 16 salidas' },
                        { question: 'Cada vez que una señal pasa por un splitter, sufre una:', options: ['Ganancia de potencia', 'Pérdida de inserción', 'Reflexión total', 'Modulación'], correctAnswer: 'Pérdida de inserción' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 2: Técnicas de Trabajo en CTO',
                    lessons: [
                        { lessonTitle: 'Apertura y Cierre Correcto', initialContent: 'Las CTOs están diseñadas para ser herméticas y proteger las fibras. Al abrir una, hazlo con cuidado. Al cerrarla, asegúrate de que todos los **sellos de goma** estén limpios y en su lugar, y aprieta los cierres de forma uniforme para garantizar la estanqueidad. Una CTO mal cerrada puede llenarse de agua y dañar los empalmes.', initialOptions: ['¿Qué pasa si un sello está dañado?', '¿Cómo limpio los sellos?', 'Siguiente.'] },
                        { lessonTitle: 'Respetando el Código de Colores', initialContent: 'Dentro de los cables multifibra, cada hilo tiene un color único según un estándar (ej. TIA-598-C). El orden suele ser: Azul, Naranja, Verde, Marrón, Gris, Blanco... 🎨 Es **absolutamente crítico** que respetes este código al fusionar, para asegurar que la fibra correcta del troncal se conecte al splitter y luego al cliente correcto.', initialOptions: ['¿Dónde encuentro el estándar de colores?', '¿Qué pasa si me equivoco de color?', 'Entendido.'] }
                    ],
                    quiz: [
                        { question: 'La principal razón para cerrar herméticamente una CTO es:', options: ['Para que no se vea por dentro', 'Proteger las fibras y fusiones de la humedad y el polvo', 'Evitar que los clientes la abran', 'Para que pese menos'], correctAnswer: 'Proteger las fibras y fusiones de la humedad y el polvo' },
                        { question: 'El estándar de colores de la fibra sirve para:', options: ['Decorar el cable', 'Identificar de forma única cada hilo de fibra', 'Indicar la potencia de la señal', 'Marcar la distancia'], correctAnswer: 'Identificar de forma única cada hilo de fibra' },
                        { question: 'Si te equivocas al fusionar una fibra de color incorrecta en la CTO, el resultado será que:', options: ['El internet del cliente será más rápido', 'El cliente no tendrá servicio o se conectará a un puerto equivocado', 'No pasa nada, todas las fibras son iguales', 'La OLT se reiniciará'], correctAnswer: 'El cliente no tendrá servicio o se conectará a un puerto equivocado' },
                        { question: 'Antes de cerrar una CTO, debes verificar el estado de los:', options: ['Tornillos de la tapa', 'Sellos de goma', 'Colores de la caja', 'Manual de instrucciones'], correctAnswer: 'Sellos de goma' },
                        { question: 'Un buen técnico, al trabajar en una CTO que otro manipuló, primero debe:', options: ['Criticar el trabajo anterior', 'Entender la organización actual antes de tocar nada', 'Desconectar todo y empezar de cero', 'Llamar al técnico anterior'], correctAnswer: 'Entender la organización actual antes de tocar nada' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 3: Mantenimiento Preventivo',
                    lessons: [
                        { lessonTitle: 'Inspección Visual de la Red', initialContent: 'El mantenimiento preventivo empieza con la vista. Al estar en campo, observa: ¿Hay cables de acometida muy bajos o sueltos? ¿Hay una CTO con la tapa rota o mal cerrada? ¿Ves un cable de fibra con una curva muy pronunciada? Reportar estos problemas **antes** de que causen una falla es un trabajo de gran valor.', initialOptions: ['¿Cómo reporto estos hallazgos?', '¿Debo arreglarlo yo mismo?', 'Siguiente.'] },
                        { lessonTitle: 'Limpieza y Organización de CTOs', initialContent: 'Periódicamente, se deben abrir las CTOs para una inspección interna. Esto incluye: limpiar los sellos, verificar que no haya entrado humedad, asegurarse de que los manguitos de fusión estén bien sujetos en sus bandejas y que las fibras no tengan curvas pronunciadas dentro de la caja. Un "peinado" de la CTO puede prevenir muchas averías futuras.', initialOptions: ['¿Cada cuánto se hace esto?', '¿Qué herramientas necesito?', 'Entendido.'] }
                    ],
                    quiz: [
                        { question: 'Reportar un cable de acometida que está muy bajo es un ejemplo de:', options: ['Mantenimiento correctivo', 'Mantenimiento predictivo', 'Mantenimiento preventivo', 'Instalación'], correctAnswer: 'Mantenimiento preventivo' },
                        { question: '¿Cuál es un signo de una CTO que necesita mantenimiento urgente?', options: ['Está recién pintada', 'Tiene la tapa rota o mal cerrada', 'Está en un poste muy alto', 'Tiene muchos cables conectados'], correctAnswer: 'Tiene la tapa rota o mal cerrada' },
                        { question: 'El "peinado" de una CTO se refiere a:', options: ['Pintar la caja', 'Limpiarla por fuera', 'Organizar cuidadosamente las fibras y empalmes en su interior', 'Cambiar todos los conectores'], correctAnswer: 'Organizar cuidadosamente las fibras y empalmes en su interior' },
                        { question: 'El objetivo principal del mantenimiento preventivo es:', options: ['Facturar más horas al cliente', 'Resolver problemas antes de que se conviertan en averías que afecten al cliente', 'Mantener a los técnicos ocupados', 'Probar herramientas nuevas'], correctAnswer: 'Resolver problemas antes de que se conviertan en averías que afecten al cliente' },
                        { question: 'Una inspección interna de una CTO incluye:', options: ['Verificar el nivel de la señal', 'Comprobar la ausencia de humedad y la correcta organización', 'Reiniciar el splitter', 'Cambiar la caja por una nueva'], correctAnswer: 'Comprobar la ausencia de humedad y la correcta organización' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 4: Diagnóstico de Fallas en la Distribución',
                    lessons: [
                        { lessonTitle: 'Falla de Splitter', initialContent: 'Aunque los splitters son pasivos y muy confiables, pueden fallar. Si mides la potencia en la entrada del splitter y es buena, pero en varias de sus salidas es nula o muy baja, el splitter podría estar dañado. Esto afectaría a todos los clientes conectados a él.', initialOptions: ['¿Cómo confirmo que es el splitter?', '¿Es fácil cambiarlo?', 'Siguiente.'] },
                        { lessonTitle: 'Atenuación en el Troncal', initialContent: 'Si llegas a una CTO y la señal de entrada (la fibra troncal) ya es muy baja, el problema está "aguas arriba", en algún punto entre esa CTO y la central. Aquí es donde el **OTDR** se vuelve indispensable para encontrar la ubicación exacta de esa atenuación o rotura en el troncal.', initialOptions: ['¿Qué puede causar atenuación en el troncal?', '¿Esto lo repara un técnico de instalación?', 'Entendido.'] }
                    ],
                    quiz: [
                        { question: 'Si la señal de entrada a un splitter es buena, pero todas las salidas tienen mala señal, la sospecha recae sobre:', options: ['La OLT', 'Las ONTs de los clientes', 'El splitter', 'El cable de acometida'], correctAnswer: 'El splitter' },
                        { question: 'Una falla en un splitter afectará a:', options: ['Un solo cliente', 'Ningún cliente', 'Todos los clientes conectados a ese splitter', 'Toda la red'], correctAnswer: 'Todos los clientes conectados a ese splitter' },
                        { question: 'Si la señal que llega a la CTO ya es mala, el problema está en:', options: ['La acometida del cliente', 'La red troncal', 'La ONT', 'La roseta'], correctAnswer: 'La red troncal' },
                        { question: 'La herramienta definitiva para encontrar una falla a lo largo de un cable troncal es el:', options: ['VFL', 'Power Meter', 'OTDR', 'Fusionadora'], correctAnswer: 'OTDR' },
                        { question: 'Los problemas en la red de distribución suelen causar averías de tipo:', options: ['Individual (un solo cliente)', 'Masivo (múltiples clientes)', 'Eléctrico', 'De software'], correctAnswer: 'Masivo (múltiples clientes)' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 5: Documentación y Actualización de Inventario',
                    lessons: [
                        { lessonTitle: 'Mapas de Red y As-Built', initialContent: 'Cuando realizas un cambio en la red (ej. usar un puerto de splitter diferente, reparar un troncal), es vital que esa información se actualice en nuestros sistemas, como **OLT Cloud**. La documentación "As-Built" (como fue construido) debe reflejar la realidad del campo para que los diagnósticos remotos del NOC sean precisos.', initialOptions: ['¿Quién actualiza esta información?', '¿Qué pasa si no se actualiza?', 'Siguiente.'] },
                        { lessonTitle: 'Etiquetado: Dejando Pistas para el Futuro', initialContent: 'Un buen técnico deja todo mejor de como lo encontró. Esto incluye el **etiquetado**. Dentro de una CTO, etiqueta qué fibra va a qué splitter, o qué puerto va a qué cliente. Una etiqueta clara puede ahorrarle horas de trabajo al próximo técnico que tenga que intervenir en esa caja.', initialOptions: ['¿Qué información debe tener una etiqueta?', '¿Hay un formato estándar?', 'Entendido, ¡a documentar!'] }
                    ],
                    quiz: [
                        { question: 'La documentación que refleja el estado real de la red en campo se llama:', options: ['Manual de usuario', 'As-Built', 'Factura', 'Contrato'], correctAnswer: 'As-Built' },
                        { question: '¿Por qué es crítico mantener actualizado el inventario en OLT Cloud?', options: ['Para que el NOC pueda hacer diagnósticos remotos precisos', 'Es un requisito legal', 'Para que la red sea más rápida', 'No es importante'], correctAnswer: 'Para que el NOC pueda hacer diagnósticos remotos precisos' },
                        { question: 'Una buena práctica al trabajar en una CTO es:', options: ['Quitar todas las etiquetas existentes', 'Dejar un etiquetado claro y actualizado', 'No tocar las etiquetas', 'Usar un lápiz para etiquetar'], correctAnswer: 'Dejar un etiquetado claro y actualizado' },
                        { question: 'Si cambias a un cliente de puerto en un splitter, debes:', options: ['Informarle solo al cliente', 'No decírselo a nadie', 'Asegurarte de que el cambio se refleje en los sistemas de gestión', 'Esperar a que el NOC se dé cuenta'], correctAnswer: 'Asegurarte de que el cambio se refleje en los sistemas de gestión' },
                        { question: 'Un buen etiquetado y una documentación As-Built precisa son ejemplos de:', options: ['Trabajo en Equipo y Mejora Continua', 'Solo Mejora Continua', 'Solo Trabajo en Equipo', 'Pasión por el Cliente'], correctAnswer: 'Trabajo en Equipo y Mejora Continua' }
                    ]
                }
            ],
            finalProject: {
                title: 'Plan de Mantenimiento para una CTO',
                description: 'Se te entrega una foto de una CTO desorganizada y con posibles problemas (cables tensos, sin sellos). Debes crear un plan de trabajo detallado para realizarle un mantenimiento completo. El plan debe incluir: 1. Herramientas y EPP necesarios. 2. Pasos de seguridad a seguir. 3. Procedimiento para reorganizar las fibras ("peinado"). 4. Puntos de inspección clave (sellos, fusiones, atenuación). 5. Proceso de cierre y documentación.',
                evaluationCriteria: [
                    'Inclusión de todos los aspectos de seguridad y herramientas.',
                    'Descripción de un proceso de trabajo lógico y ordenado.',
                    'Capacidad para identificar problemas potenciales en la CTO.',
                    'Énfasis en la documentación y buenas prácticas al finalizar.'
                ]
            }
        }
    },
    {
        id: 'template-ftth-09',
        topic: 'Calidad de Servicio y Trato con el Cliente Avanzado',
        role: 'Técnico Instalador FTTH',
        depth: 'Avanzado',
        course: {
            title: 'Ruta 9: Excelencia en Servicio al Cliente (Avanzado)',
            description: 'La diferencia entre un buen técnico y un técnico excepcional es el trato con el cliente. Aprende a comunicar, gestionar expectativas y resolver situaciones difíciles con profesionalismo.',
            modules: [
                {
                    moduleTitle: 'Módulo 1: La Psicología del Cliente con Avería',
                    lessons: [
                        { lessonTitle: 'Empatía: Ponerse en sus Zapatos', initialContent: 'Un cliente sin internet a menudo está frustrado, no contigo, sino con la situación. Tu primer trabajo es escuchar y mostrar empatía. Frases como "Entiendo completamente su frustración, vamos a solucionarlo" pueden cambiar totalmente el tono de la visita.', initialOptions: ['¿Qué no debo decir nunca?', '¿Cómo manejo a un cliente muy enojado?', 'Siguiente.'] },
                        { lessonTitle: 'De Técnico a Asesor de Confianza', initialContent: 'No eres solo un "reparador de cables". Eres el experto de TELNET CO en la casa del cliente. Habla con seguridad, pero de forma sencilla. Explica lo que estás haciendo sin usar jerga excesiva. Tu objetivo es que el cliente sienta que está en manos de un profesional competente y confiable.', initialOptions: ['¿Cómo explico qué es la "potencia óptica"?', '¿Debo darle mi número personal?', 'Entendido.'] }
                    ],
                    quiz: [
                        { question: 'La habilidad de entender y compartir los sentimientos de otra persona se llama:', options: ['Simpatía', 'Empatía', 'Antipatía', 'Apatía'], correctAnswer: 'Empatía' },
                        { question: 'Ante un cliente frustrado, lo primero que debes hacer es:', options: ['Discutir con él', 'Ignorar su frustración', 'Escuchar y mostrar empatía', 'Decirle que no es tu problema'], correctAnswer: 'Escuchar y mostrar empatía' },
                        { question: 'Al explicar un problema técnico, debes usar un lenguaje:', options: ['Lo más complejo posible para sonar inteligente', 'Claro, sencillo y sin jerga excesiva', 'Ambiguo para no comprometerte', 'Exclusivamente en inglés'], correctAnswer: 'Claro, sencillo y sin jerga excesiva' },
                        { question: 'Tu rol en la casa del cliente es el de un:', options: ['Simple instalador', 'Vendedor', 'Asesor técnico de confianza', 'Visitante'], correctAnswer: 'Asesor técnico de confianza' },
                        { question: 'Una frase como "No sé, eso es problema del NOC" es un ejemplo de:', options: ['Buena comunicación', 'Mala comunicación, rompe el trabajo en equipo', 'Honestidad radical', 'Transferencia de responsabilidad'], correctAnswer: 'Mala comunicación, rompe el trabajo en equipo' }
                    ]
                },
                {
                    moduleTitle: 'Módulo 2: Comunicación Efectiva',
                    lessons: [
                        { lessonTitle: 'Gestionando Expectativas', initialContent: 'Sé honesto y claro sobre los tiempos. Si una reparación va a tomar más de lo esperado, comunícaselo al cliente. Es mejor decir "Esto tomará aproximadamente una hora más" que dejarlo en la incertidumbre. Gestionar expectativas evita que la frustración crezca.', initialOptions: ['¿Qué hago si no sé cuánto va a tardar?', '¿Y si es un problema de la red externa?', 'Siguiente.'] },
                        { lessonTitle: 'El Arte de Explicar la Solución', initialContent: 'Cuando hayas resuelto el problema, explica brevemente y en términos sencillos qué pasó y qué hiciste. Por ejemplo: "El cable de fibra estaba muy doblado detrás del sofá, lo que bloqueaba la señal. Lo he reorganizado y ahora la señal es perfecta". Esto le da al cliente una sensación de cierre y confianza.', initialOptions: ['¿Debo mostrarle las mediciones?', '¿Qué hago si vuelve a pasar?', 'Entendido.'] }
                    ],
                    quiz: [
                        { question: 'Si una reparación se complica, lo mejor es:', options: ['No decirle nada al cliente para no preocuparlo', 'Comunicarle proactivamente que tomará más tiempo', 'Irse y volver al día siguiente sin avisar', 'Decirle que el problema no tiene solución'], correctAnswer: 'Comunicarle proactivamente que tomará más tiempo' },
                        { question: 'Al explicarle la solución al cliente, ¿qué tipo de lenguaje debes usar?', options: ['Muy técnico para demostrar conocimiento', 'Sencillo y claro, enfocado en el beneficio', 'Vago para no dar detalles', 'El mismo que usas con el NOC'], correctAnswer: 'Sencillo y claro, enfocado en el beneficio' },
                        { question: '¿Por qué es importante gestionar las expectativas del cliente sobre los tiempos?', options: ['Para que el cliente no moleste', 'Para evitar que la frustración del cliente aumente', 'Para poder cobrar más por el tiempo extra', 'No es importante, lo que importa es arreglarlo'], correctAnswer: 'Para evitar que la frustración del cliente aumente' },
                        { question: 'Una buena explicación de la solución al cliente le da una sensación de:', options: ['Confusión y duda', 'Cierre y confianza en el servicio', 'Ganas de cancelar el servicio', 'Indiferencia'], correctAnswer: 'Cierre y confianza en el servicio' },
                        { question: 'Si no sabes cuánto tiempo tardará una reparación compleja, lo mejor es:', options: ['Inventar un tiempo corto para calmar al cliente', 'No decir nada y esperar a que pregunte', 'Ser honesto, explicar la complejidad y dar un estimado aproximado', 'Decirle que vuelva a llamar en unas horas'], correctAnswer: 'Ser honesto, explicar la complejidad y dar un estimado aproximado' }
                    ]
                }
            ],
            finalProject: {
                title: 'Análisis de Caso: Manejo de Cliente Difícil',
                description: 'Se te presenta un video con la simulación de una visita a un cliente que está muy molesto porque es la tercera vez que reporta la misma falla. Describe en un texto: 1. Cómo abordarías al cliente al llegar, usando la empatía. 2. Qué frases usarías para gestionar sus expectativas y calmar la situación. 3. Cómo le explicarías la solución final de una manera que reconstruya su confianza en TELNET CO.',
                evaluationCriteria: [
                    'Uso efectivo de técnicas de comunicación empática.',
                    'Capacidad para gestionar las expectativas de un cliente frustrado.',
                    'Habilidad para comunicar una solución de forma clara y que genere confianza.',
                    'Profesionalismo en el lenguaje y el enfoque propuesto.'
                ]
            }
        }
    }
];

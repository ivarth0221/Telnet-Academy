
import type { Achievement } from './types';
import { PioneerBadge, BuilderBadge, ScholarBadge, StreakBadge, TrophyIcon, ClipboardDocumentCheckIcon, BrainCircuitIcon, AcademicCapIcon } from './components/IconComponents';

export const XP_FOR_LEVEL = (level: number) => 500 * level * level;

export const LEVEL_NAMES: { [key: number]: string } = {
  1: "Novato",
  2: "Aprendiz",
  5: "Oficial",
  10: "Veterano",
  15: "Experto",
  20: "Maestro",
  25: "Gran Maestro",
  30: "Leyenda"
};

export const ALL_ACHIEVEMENTS: Record<string, Achievement> = {
  pioneer: {
    id: 'pioneer',
    name: 'Pionero',
    description: 'Creaste tu primera ruta de habilidad.',
    icon: PioneerBadge,
    celebrationText: '¡Felicidades, {userName}! Has dado el primer paso en tu viaje de aprendizaje.'
  },
  scholar: {
    id: 'scholar',
    name: 'Erudito',
    description: 'Completaste una ruta de habilidad por primera vez.',
    icon: ScholarBadge,
    celebrationText: '¡Ruta completada! {userName}, has demostrado una dedicación increíble.'
  },
  builder: {
    id: 'builder',
    name: 'Constructor',
    description: 'Completaste tu primer proyecto final.',
    icon: BuilderBadge,
    celebrationText: '¡Proyecto entregado! {userName}, estás aplicando tus conocimientos de forma práctica.'
  },
  streak_7: {
    id: 'streak_7',
    name: 'Imparable',
    description: 'Mantuviste una racha de estudio de 7 días.',
    icon: StreakBadge,
    celebrationText: '¡Una semana de constancia, {userName}! Tu dedicación es impresionante.'
  },
  perfect_quiz: {
      id: 'perfect_quiz',
      name: 'Cerebrito',
      description: 'Obtuviste una puntuación perfecta en una prueba.',
      icon: TrophyIcon,
      celebrationText: '¡Puntuación perfecta, {userName}! Demuestras un dominio total del tema.'
  },
  competency_verified: {
    id: 'competency_verified',
    name: 'Competencia Verificada',
    description: 'Recibiste una evaluación por competencias en tu proyecto final.',
    icon: ClipboardDocumentCheckIcon,
    celebrationText: '¡Tu proyecto ha sido evaluado, {userName}! Has recibido feedback valioso.'
  },
  remedial_student: {
    id: 'remedial_student',
    name: 'Estudiante Adaptativo',
    description: 'Usaste la IA para generar una lección de refuerzo personalizada.',
    icon: BrainCircuitIcon,
    celebrationText: '¡Bien hecho, {userName}! Usar todas las herramientas es de inteligentes.'
  },
  final_exam_passed: {
    id: 'final_exam_passed',
    name: 'Competencia Validada',
    description: 'Aprobaste el riguroso examen final de IA.',
    icon: AcademicCapIcon,
    celebrationText: '¡Lo lograste, {userName}! Has superado el examen y validado tu competencia.'
  },
  level_2: {
    id: 'level_2',
    name: 'Aprendiz',
    description: 'Alcanzaste el Nivel 2. ¡Tu viaje ha comenzado!',
    icon: TrophyIcon,
    celebrationText: '¡{userName} ha alcanzado el Nivel de Aprendiz! Sigue así.'
  },
  level_5: {
      id: 'level_5',
      name: 'Oficial',
      description: 'Alcanzaste el Nivel 5. Demuestras un progreso constante.',
      icon: TrophyIcon,
      celebrationText: '¡{userName} ha alcanzado el Nivel de Oficial! Un verdadero profesional en desarrollo.'
  },
  level_10: {
      id: 'level_10',
      name: 'Veterano',
      description: 'Alcanzaste el Nivel 10. Tu experiencia es notable.',
      icon: TrophyIcon,
      celebrationText: '¡Impresionante, {userName}! Has llegado al Nivel de Veterano.'
  },
  level_15: {
      id: 'level_15',
      name: 'Experto',
      description: 'Alcanzaste el Nivel 15. Eres un referente en la materia.',
      icon: TrophyIcon,
      celebrationText: '¡Felicidades, {userName}! Has alcanzado el Nivel de Experto.'
  },
  level_20: {
      id: 'level_20',
      name: 'Maestro',
      description: 'Alcanzaste el Nivel 20. Tu dominio es excepcional.',
      icon: TrophyIcon,
      celebrationText: '¡Increíble, {userName}! Has sido reconocido como Maestro.'
  },
  level_25: {
      id: 'level_25',
      name: 'Gran Maestro',
      description: 'Alcanzaste el Nivel 25. Tu conocimiento inspira a otros.',
      icon: TrophyIcon,
      celebrationText: '¡Un logro legendario, {userName}! Eres un Gran Maestro.'
  },
  level_30: {
      id: 'level_30',
      name: 'Leyenda',
      description: 'Alcanzaste el Nivel 30. Tu sabiduría es legendaria.',
      icon: TrophyIcon,
      celebrationText: '¡{userName}, te has convertido en una Leyenda de TELNET ACADEMY!'
  }
};

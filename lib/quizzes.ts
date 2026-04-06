export interface Question {
  question: string
  image: boolean
  options: string[]
  correct: number
  feedback: string
}

export interface Quiz {
  id: string
  title: string
  description: string
  category: string
  questions: Question[]
  requiredScore: number
}

export const QUIZZES: Quiz[] = [
  {
    id: "quiz-1",
    title: "Fundamentos del ODS 4",
    category: "Básico",
    description: "Aprende los pilares fundamentales de la Educación de Calidad.",
    requiredScore: 2,
    questions: [
      {
        question: "¿Cuál es el objetivo principal del ODS 4?",
        image: true,
        options: [
          "Garantizar una educación inclusiva y de calidad",
          "Reducir la pobreza extrema",
          "Promover la igualdad de género",
        ],
        correct: 0,
        feedback: 'El ODS 4 busca "Garantizar una educación inclusiva, equitativa y de calidad y promover oportunidades de aprendizaje durante toda la vida para todos".',
      },
      {
        question: "¿Cuántos objetivos tiene la Agenda 2030?",
        image: true,
        options: ["10 objetivos", "17 objetivos", "25 objetivos"],
        correct: 1,
        feedback: "La Agenda 2030 cuenta con 17 Objetivos de Desarrollo Sostenible.",
      },
      {
        question: "¿En qué año se aprobó la Agenda 2030?",
        image: true,
        options: ["2010", "2015", "2020"],
        correct: 1,
        feedback: "La Agenda 2030 fue aprobada en septiembre de 2015 por la Asamblea General de las Naciones Unidas.",
      },
    ],
  },
  {
    id: "quiz-2",
    title: "Educación Inclusiva y Equitativa",
    category: "Intermedio",
    description: "Profundiza en la importancia de la inclusión en el sistema educativo.",
    requiredScore: 2,
    questions: [
      {
        question: "¿Qué significa 'educación inclusiva'?",
        image: true,
        options: [
          "Solo para personas con discapacidad",
          "Educación para todos, eliminando barreras al aprendizaje",
          "Educación en escuelas privadas seleccionadas",
        ],
        correct: 1,
        feedback: "La educación inclusiva supone que todos los estudiantes aprendan juntos en instituciones educativas regulares.",
      },
      {
        question: "¿Cuál es una meta clave para 2030 respecto a la enseñanza primaria?",
        image: true,
        options: [
          "Que sea obligatoria pero de pago",
          "Que todos los niños y niñas terminen la enseñanza primaria y secundaria gratuita",
          "Reducir el horario escolar a la mitad",
        ],
        correct: 1,
        feedback: "Una meta central es asegurar que todas las niñas y todos los niños terminen la enseñanza primaria y secundaria, que ha de ser gratuita, equitativa y de calidad.",
      },
    ],
  },
  {
    id: "quiz-3",
    title: "Alfabetización y Competencias",
    category: "Avanzado",
    description: "Reto final sobre competencias técnicas y alfabetización universal.",
    requiredScore: 1,
    questions: [
      {
        question: "¿Qué porcentaje de jóvenes y adultos se busca que estén alfabetizados para 2030?",
        image: true,
        options: [
          "Al menos el 50%",
          "Una gran proporción",
          "Todos los jóvenes y una proporción considerable de adultos",
        ],
        correct: 2,
        feedback: "El objetivo es asegurar que todos los jóvenes y una proporción considerable de los adultos, tanto hombres como mujeres, estén alfabetizados y tengan nociones elementales de aritmética.",
      },
    ],
  },
]

"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"

const quizQuestions = [
  {
    question: "Cual es el objetivo del ODS 4?",
    image: true,
    options: [
      "Garantizar una educacion inclusiva y de calidad",
      "Reducir la pobreza extrema",
      "Promover la igualdad de genero",
    ],
    correct: 0,
    feedback:
      'El ODS 4 busca "Garantizar una educacion inclusiva, equitativa y de calidad y promover oportunidades de aprendizaje durante toda la vida para todos".',
  },
  {
    question: "Cuantos objetivos tiene la Agenda 2030?",
    image: true,
    options: ["10 objetivos", "17 objetivos", "25 objetivos"],
    correct: 1,
    feedback: "La Agenda 2030 cuenta con 17 Objetivos de Desarrollo Sostenible.",
  },
  {
    question: "En que ano se aprobo la Agenda 2030?",
    image: true,
    options: ["2010", "2015", "2020"],
    correct: 1,
    feedback: "La Agenda 2030 fue aprobada en septiembre de 2015 por la Asamblea General de las Naciones Unidas.",
  },
]

export function QuizPage() {
  const { } = useApp()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)

  const question = quizQuestions[currentQuestion]

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index)
    if (index === question.correct) {
      setScore(score + 1)
    }
    setShowResult(true)
  }

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setCurrentQuestion(0)
      setSelectedAnswer(null)
      setShowResult(false)
      setScore(0)
    }
  }

  if (showResult) {
    return <QuizResult question={question} selectedAnswer={selectedAnswer!} onNext={handleNext} />
  }

  return (
    <main className="p-4 md:p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-foreground mb-6">
        Prueba tus conocimientos:
      </h2>

      <div className="bg-secondary rounded-xl p-6 shadow-sm">
        {/* Question header */}
        <div className="bg-primary text-primary-foreground rounded-lg py-3 px-6 text-center mb-4">
          <span className="font-bold text-lg">{question.question}</span>
        </div>

        {/* Question image */}
        {question.image && (
          <div className="flex justify-center mb-6">
            <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
              <div className="w-24 h-24 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#0093d5" strokeWidth="2" />
                  {[...Array(17)].map((_, i) => {
                    const angle = (i * 360) / 17 - 90
                    const x1 = 50 + 30 * Math.cos((angle * Math.PI) / 180)
                    const y1 = 50 + 30 * Math.sin((angle * Math.PI) / 180)
                    const x2 = 50 + 45 * Math.cos((angle * Math.PI) / 180)
                    const y2 = 50 + 45 * Math.sin((angle * Math.PI) / 180)
                    const colors = ["#e5243b", "#dda63a", "#4c9f38", "#c5192d", "#ff3a21", "#26bde2", "#fcc30b", "#a21942", "#fd6925", "#dd1367", "#fd9d24", "#bf8b2e", "#3f7e44", "#0a97d9", "#56c02b", "#00689d", "#19486a"]
                    return (
                      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={colors[i]} strokeWidth="4" strokeLinecap="round" />
                    )
                  })}
                  <text x="50" y="44" textAnchor="middle" fill="#0093d5" fontSize="10" fontWeight="bold">AGENDA</text>
                  <text x="50" y="62" textAnchor="middle" fill="#0093d5" fontSize="16" fontWeight="bold">2030</text>
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Answer options */}
        <div className="flex flex-col gap-3">
          {question.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-full text-center font-medium hover:bg-[#0080b8] transition-colors"
            >
              Respuesta {String.fromCharCode(65 + i)}: {option}
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}

function QuizResult({
  question,
  selectedAnswer,
  onNext,
}: {
  question: (typeof quizQuestions)[0]
  selectedAnswer: number
  onNext: () => void
}) {
  const isCorrect = selectedAnswer === question.correct

  return (
    <main className="p-4 md:p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-foreground mb-6">
        La respuesta correcta era:
      </h2>

      <div className="bg-secondary rounded-xl p-6 shadow-sm">
        {/* Question */}
        <div className="bg-primary text-primary-foreground rounded-lg py-3 px-6 text-center mb-4">
          <span className="font-bold text-lg">{question.question}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Image */}
          <div className="flex-shrink-0 bg-card rounded-lg p-4 border border-border flex items-center justify-center">
            <div className="w-24 h-24">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#0093d5" strokeWidth="2" />
                {[...Array(17)].map((_, i) => {
                  const angle = (i * 360) / 17 - 90
                  const x1 = 50 + 30 * Math.cos((angle * Math.PI) / 180)
                  const y1 = 50 + 30 * Math.sin((angle * Math.PI) / 180)
                  const x2 = 50 + 45 * Math.cos((angle * Math.PI) / 180)
                  const y2 = 50 + 45 * Math.sin((angle * Math.PI) / 180)
                  const colors = ["#e5243b", "#dda63a", "#4c9f38", "#c5192d", "#ff3a21", "#26bde2", "#fcc30b", "#a21942", "#fd6925", "#dd1367", "#fd9d24", "#bf8b2e", "#3f7e44", "#0a97d9", "#56c02b", "#00689d", "#19486a"]
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={colors[i]} strokeWidth="4" strokeLinecap="round" />
                })}
                <text x="50" y="44" textAnchor="middle" fill="#0093d5" fontSize="10" fontWeight="bold">AGENDA</text>
                <text x="50" y="62" textAnchor="middle" fill="#0093d5" fontSize="16" fontWeight="bold">2030</text>
              </svg>
            </div>
          </div>

          {/* Feedback */}
          <div className="flex-1 bg-primary/20 rounded-lg p-4 flex items-center">
            <div>
              <p className={`font-bold mb-2 ${isCorrect ? "text-green-600 dark:text-green-400" : "text-[#c5192d]"}`}>
                {isCorrect ? "Correcto!" : "Incorrecto"}
              </p>
              <p className="text-foreground text-sm leading-relaxed">{question.feedback}</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onNext}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-[#0080b8] transition-colors"
          >
            Siguiente
          </button>
        </div>
      </div>
    </main>
  )
}

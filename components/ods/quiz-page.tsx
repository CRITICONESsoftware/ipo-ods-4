"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { QUIZZES, Quiz, Question } from "@/lib/quizzes"
import { Lock, CheckCircle2, Play, Trophy, ArrowLeft, Star, LogIn } from "lucide-react"

export function QuizPage() {
  const { completedQuizzes, completeQuiz, addNotification, user, setCurrentPage } = useApp()
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)

  if (!user) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center p-8">
        <div className="bg-card border-2 border-dashed border-border rounded-3xl p-12 text-center max-w-sm animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Acceso Restringido</h2>
          <p className="text-muted-foreground font-medium mb-8">Debes iniciar sesión para participar en los cuestionarios y ganar logros.</p>
          <button
            onClick={() => setCurrentPage("login")}
            className="w-full bg-primary text-primary-foreground font-black py-4 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 group"
          >
            <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            IR AL LOGIN
          </button>
        </div>
      </main>
    )
  }

  const activeQuiz = QUIZZES.find(q => q.id === selectedQuizId)

  const handleStartQuiz = (id: string) => {
    setSelectedQuizId(id)
    setCurrentQuestionIdx(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
    setScore(0)
    setQuizFinished(false)
  }

  const handleAnswer = (index: number) => {
    if (showFeedback) return
    setSelectedAnswer(index)
    if (index === activeQuiz!.questions[currentQuestionIdx].correct) {
      setScore(prev => prev + 1)
    }
    setShowFeedback(true)
  }

  const handleNext = () => {
    if (currentQuestionIdx < activeQuiz!.questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    } else {
      setQuizFinished(true)
      const passed = score >= activeQuiz!.requiredScore
      if (passed && !completedQuizzes.includes(activeQuiz!.id)) {
        completeQuiz(activeQuiz!.id)
        if (user) {
          addNotification(
            "¡Cuestionario Completado!",
            `Has superado con éxito '${activeQuiz!.title}'. ¡Sigue así!`,
            "profile"
          )
        }
      }
    }
  }

  const resetSelection = () => {
    setSelectedQuizId(null)
  }

  if (!selectedQuizId) {
    return <QuizSelector onSelect={handleStartQuiz} />
  }

  if (quizFinished) {
    return (
      <QuizSummary
        quiz={activeQuiz!}
        score={score}
        onBack={resetSelection}
        onRetry={() => handleStartQuiz(selectedQuizId)}
      />
    )
  }

  const question = activeQuiz!.questions[currentQuestionIdx]

  return (
    <main className="p-4 md:p-8 max-w-2xl mx-auto animate-in fade-in duration-500">
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); resetSelection(); }}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 font-bold uppercase text-xs tracking-widest select-none"
      >
        <ArrowLeft size={16} /> Volver a la selección
      </a>

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-2">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{activeQuiz!.category}</span>
            <h2 className="text-2xl font-black uppercase tracking-tighter">{activeQuiz!.title}</h2>
          </div>
          <span className="text-sm font-black text-muted-foreground whitespace-nowrap">
            {currentQuestionIdx + 1} / {activeQuiz!.questions.length}
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${((currentQuestionIdx + 1) / activeQuiz!.questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-card border-2 border-border rounded-[2rem] p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />

        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-8 leading-tight">{question.question}</h3>

          <div className="space-y-3">
            {question.options.map((option, i) => {
              let variant = "default"
              if (showFeedback) {
                if (i === question.correct) variant = "correct"
                else if (i === selectedAnswer) variant = "incorrect"
                else variant = "dimmed"
              }

              return (
                <a
                  key={i}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!showFeedback) handleAnswer(i);
                  }}
                  className={`w-full p-5 rounded-2xl text-left font-bold transition-all flex items-center justify-between group select-none block ${variant === "default" && !showFeedback ? "bg-muted hover:bg-primary hover:text-primary-foreground" :
                    variant === "correct" ? "bg-green-500 text-white shadow-lg shadow-green-500/20 pointer-events-none" :
                      variant === "incorrect" ? "bg-destructive text-white shadow-lg shadow-destructive/20 pointer-events-none" :
                        "opacity-40 grayscale pointer-events-none"
                    }`}
                >
                  <span className="flex-1">{option}</span>
                  {variant === "correct" && <CheckCircle2 size={20} />}
                </a>
              )
            })}
          </div>

          {showFeedback && (
            <div className="mt-8 p-6 bg-primary/10 rounded-2xl border-2 border-primary/20 animate-in slide-in-from-bottom-4 duration-500">
              <p className="text-sm font-bold text-foreground leading-relaxed">
                <span className="text-primary uppercase tracking-widest text-[10px] block mb-1">Explicación:</span>
                {question.feedback}
              </p>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); handleNext(); }}
                className="w-full mt-6 bg-primary text-primary-foreground font-black py-4 rounded-xl shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 group select-none block text-center"
              >
                {currentQuestionIdx < activeQuiz!.questions.length - 1 ? "SIGUIENTE PREGUNTA" : "FINALIZAR TEST"}
                <Play className="w-4 h-4 group-hover:translate-x-1 transition-transform inline-block" />
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

function QuizSelector({ onSelect }: { onSelect: (id: string) => void }) {
  const { completedQuizzes } = useApp()

  return (
    <main className="p-4 md:p-8 max-w-4xl mx-auto animate-in fade-in duration-700">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-[900] tracking-tighter uppercase mb-2">Academia ODS 4</h2>
        <p className="text-muted-foreground font-medium">Completa los retos para desbloquear nuevos niveles de conocimiento.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {QUIZZES.map((quiz, index) => {
          const isCompleted = completedQuizzes.includes(quiz.id)
          const isUnlocked = index === 0 || completedQuizzes.includes(QUIZZES[index - 1].id)

          return (
            <div
              key={quiz.id}
              className={`flex flex-col bg-card border-2 rounded-[2.5rem] p-8 shadow-xl transition-all relative overflow-hidden group ${isUnlocked ? "border-border hover:border-primary cursor-pointer" : "border-border/30 opacity-60"
                }`}
              onClick={() => isUnlocked && onSelect(quiz.id)}
            >
              {/* Background accent */}
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 transition-transform duration-700 group-hover:scale-150 ${isCompleted ? "bg-green-500/10" : isUnlocked ? "bg-primary/5" : "bg-muted"
                }`} />

              <div className="mb-6 relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-4 rounded-2xl shadow-lg border-2 ${isCompleted ? "bg-green-500 border-green-400 text-white" :
                    isUnlocked ? "bg-primary border-primary/50 text-white" :
                      "bg-muted border-border text-muted-foreground"
                    }`}>
                    {isCompleted ? <Trophy size={24} /> : isUnlocked ? <Play size={24} className="fill-current" /> : <Lock size={24} />}
                  </div>
                  {isCompleted && (
                    <div className="bg-green-500/20 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/30">
                      COMPLETADO
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{quiz.category}</span>
                <h3 className="text-xl font-black uppercase tracking-tighter mt-1">{quiz.title}</h3>
                <p className="text-sm text-muted-foreground font-medium mt-3 leading-relaxed">{quiz.description}</p>
              </div>

              <div className="mt-auto flex items-center justify-between pt-6 border-t border-border/50">
                <div className="flex items-center gap-1.5">
                  <Star size={14} className={isUnlocked ? "text-[#fcc30b] fill-[#fcc30b]" : "text-muted-foreground"} />
                  <span className="text-xs font-black uppercase tracking-widest">{quiz.questions.length} Preguntas</span>
                </div>
                {!isUnlocked && (
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-60">BLOQUEADO</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}

function QuizSummary({ quiz, score, onBack, onRetry }: { quiz: Quiz, score: number, onBack: () => void, onRetry: () => void }) {
  const passed = score >= quiz.requiredScore
  const percentage = (score / quiz.questions.length) * 100

  return (
    <main className="p-4 md:p-8 max-w-xl mx-auto animate-in zoom-in duration-500">
      <div className="bg-card border-2 border-border rounded-[3rem] p-12 shadow-2xl text-center relative overflow-hidden">
        <div className={`absolute inset-0 opacity-10 ${passed ? "bg-green-500" : "bg-destructive"}`} />

        <div className="relative z-10">
          <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl rotate-3`}>
            {passed ? (
              <div className="bg-green-500 w-full h-full rounded-[2rem] flex items-center justify-center text-white">
                <Trophy size={48} className="animate-bounce" />
              </div>
            ) : (
              <div className="bg-destructive w-full h-full rounded-[2rem] flex items-center justify-center text-white text-4xl font-black">
                !
              </div>
            )}
          </div>

          <h2 className="text-4xl font-[900] tracking-tighter uppercase mb-2">
            {passed ? "¡RETO SUPERADO!" : "INTÉNTALO DE NUEVO"}
          </h2>
          <p className="text-muted-foreground font-medium mb-8">
            {passed
              ? `Felicidades, has demostrado un gran conocimiento sobre ${quiz.title}.`
              : `Has obtenido ${score} aciertos de ${quiz.questions.length}. Necesitas al menos ${quiz.requiredScore} para aprobar.`}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-muted p-6 rounded-3xl border border-border">
              <span className="block text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Aciertos</span>
              <span className="text-3xl font-black tracking-tighter">{score}/{quiz.questions.length}</span>
            </div>
            <div className="bg-muted p-6 rounded-3xl border border-border">
              <span className="block text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Porcentaje</span>
              <span className="text-3xl font-black tracking-tighter">{Math.round(percentage)}%</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {passed ? (
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); onBack(); }}
                className="w-full bg-primary text-primary-foreground font-black py-5 rounded-2xl shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] select-none block text-center"
              >
                DESCUBRIR MÁS RETOS
              </a>
            ) : (
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); onRetry(); }}
                className="w-full bg-primary text-primary-foreground font-black py-5 rounded-2xl shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] select-none block text-center"
              >
                REINTENTAR TEST
              </a>
            )}
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); onBack(); }}
              className="w-full bg-muted text-foreground font-black py-4 rounded-2xl hover:bg-muted/70 transition-all select-none block text-center"
            >
              SALIR AL MENÚ
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}

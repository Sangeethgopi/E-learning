"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, XCircle, ChevronRight, Clock, Heart } from "lucide-react";
import { useRouter } from "next/navigation";

const MOCK_QUESTIONS = [
  {
    id: "1",
    question: "What is the primary function of DNA?",
    options: ["Energy production", "Protein synthesis", "Storing genetic information", "Cellular respiration"],
    correct: "Storing genetic information",
  },
  {
    id: "2",
    question: "Which organelle is known as the powerhouse of the cell?",
    options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi apparatus"],
    correct: "Mitochondria",
  },
  {
    id: "3",
    question: "What is the process by which plants make their own food?",
    options: ["Glycolysis", "Photosynthesis", "Fermentation", "Transpiration"],
    correct: "Photosynthesis",
  }
];

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  const progress = (currentStep / MOCK_QUESTIONS.length) * 100;

  const handleCheck = () => {
    if (!selectedOption) return;
    
    const correct = selectedOption === MOCK_QUESTIONS[currentStep].correct;
    setIsCorrect(correct);
    setIsAnswered(true);
    
    if (correct) {
      setScore(s => s + 1);
    } else {
      setLives(l => Math.max(0, l - 1));
    }
  };

  const handleNext = () => {
    if (currentStep < MOCK_QUESTIONS.length - 1) {
      setCurrentStep(s => s + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <TrophyIcon className="w-32 h-32 text-yellow-500 mx-auto mb-8" />
          <h1 className="text-4xl font-bold font-outfit mb-4 text-white">Quiz Completed!</h1>
          <p className="text-xl text-slate-400 mb-8">You scored {score} out of {MOCK_QUESTIONS.length}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
              <p className="text-xs text-indigo-400 uppercase font-bold tracking-wider mb-1">XP Earned</p>
              <p className="text-2xl font-bold text-white">+{score * 10}</p>
            </div>
            <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20">
              <p className="text-xs text-orange-400 uppercase font-bold tracking-wider mb-1">Accuracy</p>
              <p className="text-2xl font-bold text-white">{Math.round((score/MOCK_QUESTIONS.length)*100)}%</p>
            </div>
          </div>

          <button 
            onClick={() => router.push("/dashboard")}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all w-full"
          >
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="h-20 px-8 flex items-center justify-between max-w-5xl mx-auto w-full">
        <button onClick={() => router.back()} className="text-slate-400 hover:text-white transition-colors">
          <X size={28} />
        </button>
        
        <div className="flex-1 mx-8 h-4 bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
          />
        </div>

        <div className="flex items-center gap-2 text-red-500 font-bold">
          <Heart fill="currentColor" size={24} />
          <span className="text-lg">{lives}</span>
        </div>
      </header>

      {/* Question Section */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full px-4 py-12">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentStep}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="w-full space-y-12"
          >
            <h2 className="text-3xl font-bold font-outfit text-center leading-tight">
              {MOCK_QUESTIONS[currentStep].question}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {MOCK_QUESTIONS[currentStep].options.map((option, idx) => (
                <OptionButton
                  key={idx}
                  text={option}
                  selected={selectedOption === option}
                  onClick={() => !isAnswered && setSelectedOption(option)}
                  disabled={isAnswered}
                  status={isAnswered ? (option === MOCK_QUESTIONS[currentStep].correct ? "correct" : option === selectedOption ? "wrong" : "default") : "default"}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Action Bar */}
      <footer className={`h-32 border-t flex items-center justify-center px-8 transition-colors ${
        isAnswered 
          ? (isCorrect ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20")
          : "bg-slate-900/50 border-slate-800"
      }`}>
        <div className="max-w-3xl w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isAnswered && (
              <>
                <div className={`p-3 rounded-full ${isCorrect ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                  {isCorrect ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
                </div>
                <div>
                  <h3 className={`font-bold text-xl ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                    {isCorrect ? "Excellent!" : "Not quite right"}
                  </h3>
                  {!isCorrect && (
                    <p className="text-red-400/80 text-sm">Correct answer: {MOCK_QUESTIONS[currentStep].correct}</p>
                  )}
                </div>
              </>
            )}
          </div>

          <button
            onClick={isAnswered ? handleNext : handleCheck}
            disabled={!selectedOption}
            className={`px-12 py-4 rounded-2xl font-bold transition-all transform active:scale-95 disabled:opacity-50 disabled:scale-100 ${
              isAnswered
                ? (isCorrect ? "bg-green-600 hover:bg-green-500" : "bg-red-600 hover:bg-red-500")
                : "bg-indigo-600 hover:bg-indigo-500 text-white"
            }`}
          >
            {isAnswered ? "CONTINUE" : "CHECK"}
          </button>
        </div>
      </footer>
    </div>
  );
}

function OptionButton({ text, selected, onClick, disabled, status }: any) {
  const statusStyles: any = {
    default: selected 
      ? "bg-indigo-500/10 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]" 
      : "bg-slate-900 border-slate-800 hover:bg-slate-800/50",
    correct: "bg-green-500/10 border-green-500 text-green-400",
    wrong: "bg-red-500/10 border-red-500 text-red-400",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group w-full p-6 text-left rounded-2xl border-2 transition-all flex items-center justify-between ${statusStyles[status]}`}
    >
      <span className={`text-lg font-bold font-outfit ${selected ? "text-white" : "text-slate-300"}`}>
        {text}
      </span>
      <div className={`h-6 w-6 rounded-full border-2 transition-all flex items-center justify-center ${
        selected ? "border-white bg-white" : "border-slate-700"
      }`}>
        {selected && <CheckCircle2 size={16} className="text-indigo-600" />}
      </div>
    </button>
  );
}

function TrophyIcon(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

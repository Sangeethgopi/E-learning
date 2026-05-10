"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Zap, User, Target, Crown } from "lucide-react";

interface Player {
  username: string;
  score: number;
  progress: number;
}

interface BattleRoomProps {
  roomId: string;
  userId: string;
  username: string;
  quizData: any;
}

export default function BattleRoom({ roomId, userId, username, quizData }: BattleRoomProps) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [roomState, setRoomState] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.host}/ws/battle/${roomId}/${userId}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WS Event:", data);
      
      switch (data.event) {
        case "ROOM_STATE":
          setRoomState(data.payload);
          break;
        case "PLAYER_UPDATE":
          setRoomState((prev: any) => ({
            ...prev,
            players: {
              ...prev.players,
              [data.payload.user_id]: data.payload.state
            }
          }));
          break;
        case "GAME_OVER":
          setGameOver(true);
          setWinner(data.payload.winner_id);
          break;
      }
    };

    setSocket(ws);
    return () => ws.close();
  }, [roomId, userId]);

  const handleAnswer = (isCorrect: boolean) => {
    if (socket && isCorrect) {
      socket.send(JSON.stringify({
        event: "ANSWER_CORRECT",
        payload: { points: 10 }
      }));
    }
    
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  if (!roomState) return <div className="flex items-center justify-center h-96">Connecting to battle...</div>;

  const myState = roomState.players[userId];
  const opponentId = Object.keys(roomState.players).find(id => id !== userId);
  const opponentState = opponentId ? roomState.players[opponentId] : null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      {/* HUD */}
      <div className="grid grid-cols-2 gap-8">
        {/* My Stats */}
        <div className="p-6 rounded-3xl bg-slate-900 border-2 border-indigo-500/50 shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <User size={80} />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/40">
              <Zap size={24} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">You</p>
              <h3 className="text-xl font-bold">{username}</h3>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-4xl font-black font-outfit text-white">{myState?.score || 0} XP</div>
            <div className="text-sm font-bold text-indigo-400">Question {currentQuestionIndex + 1}/{quizData.questions.length}</div>
          </div>
          {/* Progress Bar */}
          <div className="h-2 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
            <motion.div 
              className="h-full bg-indigo-500"
              initial={{ width: 0 }}
              animate={{ width: `${(currentQuestionIndex / quizData.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Opponent Stats */}
        <div className="p-6 rounded-3xl bg-slate-900 border-2 border-rose-500/30 shadow-2xl shadow-rose-500/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-rose-500">
            <Target size={80} />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/20 flex items-center justify-center border border-rose-500/50">
              <User size={24} className="text-rose-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Opponent</p>
              <h3 className="text-xl font-bold">{opponentState?.username || "Waiting..."}</h3>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-4xl font-black font-outfit text-rose-400">{opponentState?.score || 0} XP</div>
            <div className="text-sm font-bold text-slate-500">Progress: {opponentState?.progress || 0}/{quizData.questions.length}</div>
          </div>
          {/* Opponent Progress Bar */}
          <div className="h-2 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
            <motion.div 
              className="h-full bg-rose-500"
              initial={{ width: 0 }}
              animate={{ width: `${((opponentState?.progress || 0) / quizData.questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quiz Area */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {!gameOver ? (
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-10 rounded-[2.5rem] bg-slate-950 border border-slate-800 shadow-2xl space-y-8"
            >
              <h2 className="text-3xl font-bold font-outfit text-center leading-tight">
                {quizData.questions[currentQuestionIndex].question_text}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quizData.questions[currentQuestionIndex].options.map((option: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(option.is_correct)}
                    className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/50 transition-all text-left group flex items-center justify-between"
                  >
                    <span className="font-medium text-slate-300 group-hover:text-white">{option.option_text}</span>
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {String.fromCharCode(65 + i)}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-16 rounded-[3rem] bg-slate-900 border-4 border-indigo-500 shadow-[0_0_100px_rgba(99,102,241,0.2)] text-center space-y-8 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent" />
              <div className="relative z-10 space-y-4">
                <div className="w-24 h-24 rounded-full bg-indigo-600 mx-auto flex items-center justify-center shadow-2xl shadow-indigo-500/50">
                  {winner === userId ? <Crown size={48} className="text-white" /> : <Trophy size={48} className="text-white" />}
                </div>
                <h1 className="text-6xl font-black font-outfit uppercase italic tracking-tighter">
                  {winner === userId ? "Victory!" : "Defeat!"}
                </h1>
                <p className="text-xl text-slate-400">
                  {winner === userId ? `You earned +50 XP and a victory token!` : `Better luck next time! You earned +10 XP.`}
                </p>
                <div className="pt-8">
                  <button 
                    onClick={() => window.location.href = '/dashboard'}
                    className="px-12 py-4 bg-white text-slate-950 font-black rounded-2xl hover:scale-105 transition-transform uppercase tracking-widest"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

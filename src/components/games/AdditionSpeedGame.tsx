"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Zap, Activity } from 'lucide-react';

export default function AdditionSpeedGame() {
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [question, setQuestion] = useState({ a: 0, b: 0, options: [] as number[], answer: 0 });
    const [resultMsg, setResultMsg] = useState("");
    const [shake, setShake] = useState(false);
    const [particles, setParticles] = useState<{ id: number, x: number, y: number }[]>([]);

    // Ovoz effektlari - Web Audio API (Fayl talab qilinmaydi)
    const playSuccessSound = () => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioContext();

            // Chiroyli "Ting!" ovozi
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();

            osc.connect(gainNode);
            gainNode.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.1); // C6

            gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

            osc.start();
            osc.stop(ctx.currentTime + 0.4);
        } catch (e) { console.log("Audio not supported"); }
    };

    const playErrorSound = () => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioContext();

            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();

            osc.connect(gainNode);
            gainNode.connect(ctx.destination);

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.3);

            gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

            osc.start();
            osc.stop(ctx.currentTime + 0.3);
        } catch (e) { console.log("Audio not supported"); }
    };

    const generateQuestion = (currentLevel: number) => {
        const maxNum = currentLevel * 10;
        const a = Math.floor(Math.random() * maxNum) + 1;
        const b = Math.floor(Math.random() * maxNum) + 1;
        const ans = a + b;

        let opts = [ans];
        while (opts.length < 3) {
            let falseAns = ans + Math.floor(Math.random() * 10) - 5;
            if (falseAns !== ans && falseAns > 0 && !opts.includes(falseAns)) {
                opts.push(falseAns);
            }
        }
        opts.sort(() => Math.random() - 0.5);
        setQuestion({ a, b, options: opts, answer: ans });
    };

    useEffect(() => {
        generateQuestion(level);
    }, [level]);

    const triggerParticles = () => {
        const newParticles = Array.from({ length: 10 }).map((_, i) => ({
            id: Date.now() + i,
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200 - 100
        }));
        setParticles(newParticles);
        setTimeout(() => setParticles([]), 1000);
    };

    const handleAnswer = (selected: number) => {
        if (selected === question.answer) {
            playSuccessSound();
            triggerParticles();
            setScore(s => s + 10);
            setResultMsg("Barakalla! To'g'ri topdingiz 🎉");
            setTimeout(() => {
                setResultMsg("");
                generateQuestion(level);
                if (score > 0 && score % 40 === 0) setLevel(l => l + 1);
            }, 1000);
        } else {
            playErrorSound();
            setShake(true);
            setResultMsg("Xato! Qaytadan urinib ko'ring 🥺");
            setTimeout(() => {
                setShake(false);
                setResultMsg("");
            }, 800);
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center p-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-[3rem] shadow-2xl border-8 border-white">

            {/* Kichik effektlar */}
            <AnimatePresence>
                {particles.map(p => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                        animate={{ opacity: 0, scale: 1.5, x: p.x, y: p.y }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute z-50 pointer-events-none text-4xl"
                        style={{ left: '50%', top: '50%' }}
                    >
                        ⭐
                    </motion.div>
                ))}
            </AnimatePresence>

            <div className="flex items-center gap-4 mb-4">
                <div className="bg-yellow-400 p-3 rounded-full shadow-[0_4px_0_#b45309]">
                    <Zap className="text-white" size={32} />
                </div>
                <h2 className="text-5xl font-extrabold text-blue-900 drop-shadow-md">Tezkor Qo&apos;shish</h2>
            </div>

            <div className="flex gap-6 mb-8 w-full justify-between mt-4">
                <div className="flex-1 bg-white flex flex-col items-center py-4 rounded-3xl shadow-[0_6px_0_#d1d5db] border-4 border-gray-100">
                    <span className="text-gray-500 font-bold text-lg uppercase">Daraja</span>
                    <span className="text-4xl font-black text-yellow-500">{level}</span>
                </div>
                <div className="flex-1 bg-white flex flex-col items-center py-4 rounded-3xl shadow-[0_6px_0_#d1d5db] border-4 border-gray-100 relative overflow-hidden">
                    <span className="text-gray-500 font-bold text-lg uppercase">Ball</span>
                    <div className="flex items-center gap-2">
                        <span className="text-4xl font-black text-green-500">{score}</span>
                        <Star className="text-green-500 fill-green-500" size={28} />
                    </div>
                </div>
            </div>

            <motion.div
                key={question.a + question.b}
                initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="text-7xl font-black text-blue-900 mb-10 bg-white/80 backdrop-blur-sm px-16 py-10 rounded-[3rem] shadow-inner border-4 border-white/50"
            >
                {question.a} <span className="text-orange-500 drop-shadow-sm">+</span> {question.b} = <span className="text-red-500 animate-pulse">?</span>
            </motion.div>

            <motion.div
                animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="flex gap-6 relative z-10"
            >
                {question.options.map((opt, i) => (
                    <motion.button
                        whileHover={{ scale: 1.1, y: -5 }}
                        whileTap={{ scale: 0.9, y: 5 }}
                        key={i}
                        onClick={() => handleAnswer(opt)}
                        className="kid-button bg-gradient-to-b from-orange-400 to-orange-500 text-white text-5xl font-black rounded-[2rem] w-32 h-32 shadow-[0_8px_0_#c2410c] border-4 border-orange-300 hover:brightness-110 flex items-center justify-center"
                    >
                        {opt}
                    </motion.button>
                ))}
            </motion.div>

            <div className="h-16 mt-8 flex items-center justify-center">
                <AnimatePresence>
                    {resultMsg && (
                        <motion.div
                            initial={{ scale: 0.5, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            className={`text-3xl font-black px-8 py-4 rounded-3xl shadow-lg border-4 ${resultMsg.includes("Xato") ? "bg-red-100 text-red-600 border-red-300" : "bg-green-100 text-green-600 border-green-300"}`}
                        >
                            {resultMsg}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

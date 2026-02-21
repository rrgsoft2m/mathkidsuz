"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowLeft, Award, Zap } from 'lucide-react';

const QUESTIONS_PER_LEVEL = 5;

export default function MathEngine() {
    const [step, setStep] = useState<'SELECT_DIGIT' | 'SELECT_OP' | 'PLAYING'>('SELECT_DIGIT');
    const [digits, setDigits] = useState(1);
    const [operator, setOperator] = useState('+');

    const [level, setLevel] = useState(1);
    const [questionCount, setQuestionCount] = useState(0);
    const [score, setScore] = useState(0);
    const [question, setQuestion] = useState({ a: 0, b: 0, options: [] as number[], answer: 0 });
    const [resultMsg, setResultMsg] = useState("");
    const [shake, setShake] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [particles, setParticles] = useState<{ id: number, x: number, y: number }[]>([]);

    const [showLevelUp, setShowLevelUp] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }, []);

    const playSuccessSound = () => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
            osc.start();
            osc.stop(ctx.currentTime + 0.4);
        } catch (e) { }
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
        } catch (e) { }
    };

    const playLevelUpSound = () => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();

            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            osc.type = 'triangle';

            const now = ctx.currentTime;
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.setValueAtTime(554.37, now + 0.15);
            osc.frequency.setValueAtTime(659.25, now + 0.3);
            osc.frequency.setValueAtTime(880, now + 0.45);

            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.5, now + 0.1);
            gainNode.gain.setValueAtTime(0.5, now + 0.6);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1.5);

            osc.start(now);
            osc.stop(now + 1.5);
        } catch (e) { }
    };

    const saveScoreToProfile = (points: number) => {
        const u = localStorage.getItem('mathkids_user');
        if (u) {
            let parsed = JSON.parse(u);
            parsed.score = (parsed.score || 0) + points;
            localStorage.setItem('mathkids_user', JSON.stringify(parsed));
            window.dispatchEvent(new Event('auth_change')); // notify navbar
        }
    }

    const getMultiplier = (d: number) => {
        if (d === 1) return { min: 1, max: 9 };
        if (d === 2) return { min: 10, max: 99 };
        return { min: 100, max: 999 };
    };

    const generateQuestion = (dig: number, op: string, lvl: number) => {
        const limitsA = getMultiplier(dig);
        let a = 0, b = 0, ans = 0;

        if (op === '/') {
            const limitsB = getMultiplier(dig);
            let maxAns = dig === 1 ? (lvl * 3 + 2) : dig === 2 ? (lvl * 5 + 10) : (lvl * 10 + 20);
            b = Math.floor(Math.random() * (limitsB.max - limitsB.min + 1)) + limitsB.min;
            ans = Math.floor(Math.random() * Math.min(maxAns, 99)) + 1;
            a = b * ans;
        } else if (op === '*') {
            a = Math.floor(Math.random() * (limitsA.max - limitsA.min + 1)) + limitsA.min;
            let maxB = lvl * 3 + (dig === 1 ? 2 : 1);
            if (dig > 1) maxB = Math.min(maxB, 99);
            b = Math.floor(Math.random() * maxB) + (dig === 1 ? limitsA.min : 2);
            ans = a * b;
        } else if (op === '-') {
            a = Math.floor(Math.random() * (limitsA.max - limitsA.min + 1)) + limitsA.min;
            b = Math.floor(Math.random() * (limitsA.max - limitsA.min + 1)) + limitsA.min;
            if (a < b) { let temp = a; a = b; b = temp; }
            ans = a - b;
        } else {
            a = Math.floor(Math.random() * (limitsA.max - limitsA.min + 1)) + limitsA.min;
            b = Math.floor(Math.random() * (limitsA.max - limitsA.min + 1)) + limitsA.min;
            ans = a + b;
        }

        let opts = [ans];
        while (opts.length < 3) {
            let noise = Math.floor(Math.random() * 10) - 5;
            if (noise === 0) noise = 2;
            let stepSize = dig === 1 ? 1 : Math.max(2, Math.floor(ans / 10));
            let falseAns = ans + (noise * stepSize);
            if (falseAns >= 0 && !opts.includes(falseAns)) opts.push(falseAns);
        }
        opts.sort(() => Math.random() - 0.5);
        setQuestion({ a, b, options: opts, answer: ans });
    };

    useEffect(() => {
        if (step === 'PLAYING' && !showLevelUp) {
            setSelectedAnswer(null); // Reset when new level/question generated
            generateQuestion(digits, operator, level);
        }
    }, [step, level, digits, operator, showLevelUp]);

    const triggerParticles = () => {
        const newParticles = Array.from({ length: 12 }).map((_, i) => ({
            id: Date.now() + i,
            x: (Math.random() - 0.5) * 300,
            y: (Math.random() - 0.5) * 300 - 100
        }));
        setParticles(newParticles);
        setTimeout(() => setParticles([]), 1000);
    };

    const handleLevelUp = () => {
        setShowLevelUp(true);
        playLevelUpSound();

        // Add bonus score and save
        setScore(s => s + 50);
        saveScoreToProfile(100);

        setTimeout(() => {
            setLevel(l => l + 1);
            setQuestionCount(0);
            setShowLevelUp(false);
        }, 4500); // 4.5 seconds awesome party!
    }

    const handleAnswer = (selected: number) => {
        if (showLevelUp) return; // disable clicks during levelup
        if (selectedAnswer !== null) return; // disable clicks if an answer is currently animating logic

        if (selected === question.answer) {
            playSuccessSound();
            triggerParticles();
            setSelectedAnswer(selected); // Trigger transition of this number to the question board
            setScore(s => s + 10);
            saveScoreToProfile(10);
            setResultMsg("Zo'r! 🎉");

            setTimeout(() => {
                setResultMsg("");
                setSelectedAnswer(null);
                let newCount = questionCount + 1;
                if (newCount >= QUESTIONS_PER_LEVEL) {
                    handleLevelUp();
                } else {
                    setQuestionCount(newCount);
                    generateQuestion(digits, operator, level);
                }
            }, 1200);
        } else {
            playErrorSound();
            setShake(true);
            setResultMsg("Xato! Yana urinib ko'r 🥺");
            setTimeout(() => {
                setShake(false);
                setResultMsg("");
            }, 800);
        }
    };

    const renderStep1 = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center w-full h-full">
            <h2 className="text-3xl md:text-5xl font-extrabold text-blue-900 mb-6 md:mb-10 border-b-8 border-blue-300 pb-4 text-center inline-block drop-shadow-sm">Raqamlarni tanla</h2>
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full justify-center">
                {[
                    { v: 1, label: "1 Xonali", desc: "0-9 gacha", color: "bg-green-100 border-green-500 text-green-900 hover:bg-green-200" },
                    { v: 2, label: "2 Xonali", desc: "10-99 gacha", color: "bg-yellow-100 border-yellow-500 text-yellow-900 hover:bg-yellow-200" },
                    { v: 3, label: "3 Xonali", desc: "100+", color: "bg-orange-100 border-orange-500 text-orange-900 hover:bg-orange-200" }
                ].map(btn => (
                    <div key={btn.v} onClick={() => { setDigits(btn.v); setStep('SELECT_OP'); }}
                        className={`kid-button cursor-pointer flex-[1] max-w-[280px] px-6 py-6 md:px-8 md:py-10 rounded-[2rem] md:rounded-[2.5rem] border-b-[8px] md:border-b-[10px] border-4 shadow-lg flex flex-col items-center mx-auto w-full ${btn.color}`}>
                        <div className="text-5xl md:text-7xl font-black mb-2 md:mb-4 drop-shadow-md">{btn.v}</div>
                        <div className="text-2xl md:text-3xl font-extrabold mb-1 md:mb-2">{btn.label}</div>
                        <div className="opacity-80 font-bold text-lg md:text-xl">{btn.desc}</div>
                    </div>
                ))}
            </div>
        </motion.div>
    );

    const renderStep2 = () => (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center w-full h-full">
            <h2 className="text-3xl md:text-5xl font-extrabold text-blue-900 mb-6 md:mb-10 border-b-8 border-blue-300 pb-4 text-center drop-shadow-sm">Amalni tanla</h2>
            <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-3xl">
                {[
                    { op: '+', label: "Qo'shish", icon: "➕", color: "bg-blue-100 border-blue-500 text-blue-900" },
                    { op: '-', label: "Ayirish", icon: "➖", color: "bg-orange-100 border-orange-500 text-orange-900" },
                    { op: '*', label: "Ko'paytirish", icon: "✖️", color: "bg-emerald-100 border-emerald-500 text-emerald-900" },
                    { op: '/', label: "Bo'lish", icon: "➗", color: "bg-rose-100 border-rose-500 text-rose-900" },
                ].map(btn => (
                    <div key={btn.op} onClick={() => { setOperator(btn.op); setStep('PLAYING'); setLevel(1); setQuestionCount(0); setScore(0); }}
                        className={`kid-button cursor-pointer px-4 py-6 md:px-6 md:py-10 rounded-[2rem] md:rounded-[2.5rem] border-b-[8px] md:border-b-[10px] border-4 shadow-lg flex flex-col items-center justify-center hover:brightness-95 ${btn.color}`}>
                        <div className="text-[3rem] md:text-[5rem] font-black mb-2 md:mb-4 drop-shadow-lg">{btn.icon}</div>
                        <div className="text-xl md:text-3xl font-extrabold">{btn.label}</div>
                    </div>
                ))}
            </div>
            <button onClick={() => setStep('SELECT_DIGIT')} className="mt-8 md:mt-10 font-bold text-gray-400 hover:text-gray-600 bg-white border-4 border-gray-200 px-6 md:px-8 py-3 md:py-4 rounded-full md:rounded-3xl shadow-sm flex items-center gap-2 text-xl md:text-2xl transition-all">
                <ArrowLeft strokeWidth={3} /> Ortqaga
            </button>
        </motion.div>
    );

    const renderLevelUp = () => (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-blue-900/90 backdrop-blur-md rounded-[3rem] overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ y: -50, x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0, rotate: 0 }}
                    animate={{ y: typeof window !== 'undefined' ? window.innerHeight + 100 : 800, rotate: 360, x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0 }}
                    transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, ease: 'linear' }}
                    className="absolute w-6 h-6 rounded-sm z-0"
                    style={{ backgroundColor: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][Math.floor(Math.random() * 5)] }}
                />
            ))}
            <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 10 }}
                className="flex flex-col items-center text-center p-12 bg-white rounded-[4rem] shadow-2xl border-[12px] border-yellow-400"
            >
                <div className="text-8xl mb-6">🏆</div>
                <h1 className="text-5xl md:text-6xl font-black text-rose-500 drop-shadow-md mb-4 uppercase">Barakalla!
                </h1>
                <p className="text-3xl font-extrabold text-blue-900 leading-snug">
                    Siz {level}-bosqichni muvaffaqiyatli yakunladingiz!
                </p>
                <div className="mt-8 bg-green-100 text-green-700 font-black text-3xl px-8 py-4 rounded-[2rem] border-4 border-green-400 animate-pulse">
                    +50 Qahramon Balli!
                </div>
                <div className="mt-8 text-xl font-bold text-gray-400">Keyingi bosqich yuklanmoqda... 🚀</div>
            </motion.div>
        </div>
    );

    const renderPlaying = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center relative min-h-[60vh]">

            {showLevelUp && renderLevelUp()}

            <AnimatePresence>
                {particles.map(p => (
                    <motion.div key={p.id} initial={{ opacity: 1, scale: 0, x: 0, y: 0 }} animate={{ opacity: 0, scale: 2.5, x: p.x, y: p.y }} transition={{ duration: 0.8, ease: "easeOut" }} className="absolute z-50 pointer-events-none text-6xl drop-shadow-xl" style={{ left: '50%', top: '50%' }}>⭐</motion.div>
                ))}
            </AnimatePresence>

            <div className="w-full flex justify-between items-center bg-white/70 backdrop-blur-md p-3 md:p-5 rounded-[2rem] md:rounded-[2.5rem] border-4 border-white mb-6 md:mb-8 shadow-md">
                <button onClick={() => setStep('SELECT_OP')} className="bg-white p-3 md:p-4 rounded-[1rem] md:rounded-[1.5rem] shadow-sm hover:bg-gray-100 border-4 border-gray-200 transition-colors">
                    <ArrowLeft className="text-gray-800" size={24} strokeWidth={3} />
                </button>
                <div className="flex gap-2 md:gap-4">
                    <div className="bg-yellow-400 border-b-4 md:border-b-8 border-yellow-600 text-yellow-900 px-4 md:px-8 py-2 md:py-3 rounded-[1.5rem] md:rounded-[2rem] font-black text-sm md:text-2xl flex items-center gap-1 md:gap-3 shadow-sm">
                        <Award size={20} className="md:w-[32px] md:h-[32px]" /> <span className="hidden sm:inline">Bosqich:</span> {level}
                    </div>
                    <div className="bg-green-400 border-b-4 md:border-b-8 border-green-600 text-green-900 px-4 md:px-8 py-2 md:py-3 rounded-[1.5rem] md:rounded-[2rem] font-black text-sm md:text-2xl flex items-center gap-1 md:gap-3 shadow-sm">
                        <Star size={20} className="fill-green-900 md:w-[32px] md:h-[32px]" /> <span className="hidden sm:inline">Ball:</span> {score}
                    </div>
                </div>
            </div>

            <div className="w-full max-w-xl bg-gray-200 rounded-full h-6 mb-12 overflow-hidden shadow-inner border-[3px] border-gray-300 relative">
                <motion.div
                    className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(questionCount / QUESTIONS_PER_LEVEL) * 100}%` }}
                    transition={{ duration: 0.5, type: 'spring' }}
                />
                <div className="absolute inset-0 flex items-center justify-center font-black text-emerald-900 text-xs tracking-widest opacity-60">
                    {questionCount} / {QUESTIONS_PER_LEVEL}
                </div>
            </div>

            <motion.div
                key={question.a + question.b + operator}
                initial={{ scale: 0.5, rotate: -3, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.6 }}
                className="text-[4rem] sm:text-[5rem] md:text-[8rem] font-black text-blue-900 mb-8 md:mb-16 bg-white/95 backdrop-blur-xl px-6 sm:px-12 md:px-24 py-8 md:py-20 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl border-[8px] md:border-[12px] border-white flex justify-center items-center gap-2 sm:gap-4 md:gap-6 w-full max-w-full overflow-hidden"
            >
                <span className="truncate">{question.a}</span>
                <span className="text-indigo-500 drop-shadow-md mx-1 sm:mx-2">{operator === '/' ? '÷' : operator === '*' ? '×' : operator}</span>
                <span className="truncate">{question.b}</span>
                <span className="text-gray-300 mx-1 sm:mx-2">=</span>
                <div className="relative inline-flex items-center justify-center">
                    {selectedAnswer === null ? (
                        <span className="text-rose-500 animate-pulse bg-rose-50 rounded-[1.5rem] md:rounded-[2rem] px-4 sm:px-6 border-[4px] md:border-[6px] border-rose-200 shadow-inner inline-flex h-full items-center justify-center -translate-y-1 md:-translate-y-2">?</span>
                    ) : (
                        <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className="text-green-500 rounded-[1.5rem] md:rounded-[2rem] px-4 sm:px-6 bg-green-50 border-[4px] md:border-[6px] border-green-300 shadow-inner inline-flex h-full items-center justify-center -translate-y-1 md:-translate-y-2"
                        >
                            {selectedAnswer}
                        </motion.span>
                    )}
                </div>
            </motion.div>

            <motion.div animate={shake ? { x: [-15, 15, -15, 15, 0] } : {}} transition={{ duration: 0.4 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-10 relative z-10 w-full max-w-4xl px-4">
                {question.options.map((opt, i) => (
                    <motion.button
                        layout
                        whileHover={selectedAnswer === null ? { scale: 1.05, y: -4 } : {}}
                        whileTap={selectedAnswer === null ? { scale: 0.95, y: 4 } : {}}
                        key={`${question.a}-${question.b}-${i}`} // Force new keys so layout animations don't bug cross-questions
                        onClick={() => handleAnswer(opt)}
                        disabled={showLevelUp || selectedAnswer !== null}
                        animate={{
                            opacity: selectedAnswer !== null && selectedAnswer !== opt ? 0 : 1, // Fade out wrong options
                            scale: selectedAnswer === opt ? 0 : 1 // Shrink the selected option before it moves
                        }}
                        transition={{ duration: 0.3 }}
                        className="kid-button bg-gradient-to-b from-blue-400 to-blue-500 text-white text-[3rem] md:text-[4rem] font-black rounded-[2rem] md:rounded-[3rem] w-full py-4 md:py-8 shadow-[0_8px_0_#1e3a8a] md:shadow-[0_12px_0_#1e3a8a] border-[4px] md:border-8 border-blue-200 hover:brightness-110 flex items-center justify-center active:shadow-none active:border-blue-600 active:translate-y-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {opt}
                    </motion.button>
                ))}
            </motion.div>

            <div className="h-28 mt-12 flex items-center justify-center">
                <AnimatePresence>
                    {resultMsg && !showLevelUp && (
                        <motion.div
                            initial={{ scale: 0.5, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.8, opacity: 0, y: -20 }}
                            className={`text-4xl font-black px-12 py-6 rounded-[2.5rem] shadow-2xl border-8 ${resultMsg.includes("Xato") ? "bg-red-50 text-red-600 border-red-400" : "bg-green-50 text-green-600 border-green-400"}`}
                        >
                            {resultMsg}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );

    return (
        <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 md:p-14 rounded-[2.5rem] md:rounded-[4rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-[4px] sm:border-[8px] md:border-[12px] border-white min-h-[500px] md:min-h-[700px] flex items-center justify-center relative overscroll-none overflow-hidden">
            {step === 'SELECT_DIGIT' && renderStep1()}
            {step === 'SELECT_OP' && renderStep2()}
            {step === 'PLAYING' && renderPlaying()}
        </div>
    );
}

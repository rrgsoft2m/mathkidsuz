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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center w-full h-full py-8">
            <h2 className="text-3xl md:text-5xl font-extrabold text-blue-900 mb-6 md:mb-10 border-b-8 border-blue-300 pb-4 text-center inline-block drop-shadow-sm px-4">Raqamlarni tanla</h2>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full justify-center px-4">
                {[
                    { v: 1, label: "1 Xonali", desc: "0-9 gacha", color: "bg-green-100 border-green-500 text-green-900 hover:bg-green-200" },
                    { v: 2, label: "2 Xonali", desc: "10-99 gacha", color: "bg-yellow-100 border-yellow-500 text-yellow-900 hover:bg-yellow-200" },
                    { v: 3, label: "3 Xonali", desc: "100+", color: "bg-orange-100 border-orange-500 text-orange-900 hover:bg-orange-200" }
                ].map(btn => (
                    <div key={btn.v} onClick={() => { setDigits(btn.v); setStep('SELECT_OP'); }}
                        className={`kid-button cursor-pointer flex-1 max-w-[320px] px-4 py-6 md:px-8 md:py-10 rounded-2xl md:rounded-[2.5rem] border-b-[6px] md:border-b-[10px] border-4 shadow-lg flex flex-col items-center mx-auto w-full transition-all ${btn.color}`}>
                        <div className="text-5xl md:text-7xl font-black mb-2 md:mb-4 drop-shadow-md leading-none">{btn.v}</div>
                        <div className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-1 md:mb-2">{btn.label}</div>
                        <div className="opacity-80 font-bold text-base md:text-xl">{btn.desc}</div>
                    </div>
                ))}
            </div>
        </motion.div>
    );

    const renderStep2 = () => (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center w-full h-full py-8">
            <h2 className="text-3xl md:text-5xl font-extrabold text-blue-900 mb-6 md:mb-10 border-b-8 border-blue-300 pb-4 text-center drop-shadow-sm px-4">Amalni tanla</h2>
            <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-3xl px-4">
                {[
                    { op: '+', label: "Qo'shish", icon: "➕", color: "bg-blue-100 border-blue-500 text-blue-900 hover:bg-blue-200" },
                    { op: '-', label: "Ayirish", icon: "➖", color: "bg-orange-100 border-orange-500 text-orange-900 hover:bg-orange-200" },
                    { op: '*', label: "Ko'paytirish", icon: "✖️", color: "bg-emerald-100 border-emerald-500 text-emerald-900 hover:bg-emerald-200" },
                    { op: '/', label: "Bo'lish", icon: "➗", color: "bg-rose-100 border-rose-500 text-rose-900 hover:bg-rose-200" },
                ].map(btn => (
                    <div key={btn.op} onClick={() => { setOperator(btn.op); setStep('PLAYING'); setLevel(1); setQuestionCount(0); setScore(0); }}
                        className={`kid-button cursor-pointer px-3 py-6 sm:px-4 sm:py-8 md:px-6 md:py-10 rounded-2xl md:rounded-[2.5rem] border-b-[6px] md:border-b-[10px] border-4 shadow-lg flex flex-col items-center justify-center transition-all ${btn.color}`}>
                        <div className="text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] font-black mb-2 md:mb-4 drop-shadow-lg leading-none">{btn.icon}</div>
                        <div className="text-lg sm:text-2xl md:text-3xl font-extrabold text-center leading-tight">{btn.label}</div>
                    </div>
                ))}
            </div>
            <button onClick={() => setStep('SELECT_DIGIT')} className="mt-8 md:mt-10 font-bold text-slate-500 hover:text-slate-800 bg-white border-4 border-slate-200 px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-3xl shadow-sm flex items-center gap-2 text-lg md:text-2xl transition-all cursor-pointer">
                <ArrowLeft strokeWidth={3} /> Ortga
            </button>
        </motion.div>
    );

    const renderLevelUp = () => (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-md rounded-3xl sm:rounded-[3rem] overflow-hidden">
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
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 10 }}
                className="flex flex-col items-center text-center p-8 md:p-12 bg-white rounded-[2rem] md:rounded-[4rem] shadow-2xl border-8 md:border-[12px] border-yellow-400 mx-4"
            >
                <div className="text-6xl md:text-8xl mb-4 md:mb-6">🏆</div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-rose-500 drop-shadow-md mb-2 md:mb-4 uppercase">Barakalla!
                </h1>
                <p className="text-xl sm:text-3xl font-extrabold text-blue-900 leading-snug px-4">
                    Siz {level}-bosqichni yakunladingiz!
                </p>
                <div className="mt-6 md:mt-8 bg-emerald-100 text-emerald-700 font-black text-2xl md:text-3xl px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-[2rem] border-4 border-emerald-400 animate-pulse drop-shadow-sm">
                    +50 Qahramon Balli!
                </div>
                <div className="mt-6 md:mt-8 text-lg font-bold text-slate-400">Keyingi bosqich yuklanmoqda... 🚀</div>
            </motion.div>
        </div>
    );

    const renderPlaying = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center relative min-h-[60vh] md:min-h-[70vh]">

            {showLevelUp && renderLevelUp()}

            <AnimatePresence>
                {particles.map(p => (
                    <motion.div key={p.id} initial={{ opacity: 1, scale: 0, x: 0, y: 0 }} animate={{ opacity: 0, scale: 2.5, x: p.x, y: p.y }} transition={{ duration: 0.8, ease: "easeOut" }} className="absolute z-50 pointer-events-none text-4xl sm:text-6xl drop-shadow-xl" style={{ left: '50%', top: '50%' }}>⭐</motion.div>
                ))}
            </AnimatePresence>

            <div className="w-full flex flex-col sm:flex-row justify-between items-center bg-white/80 backdrop-blur-xl p-3 md:p-5 rounded-2xl sm:rounded-[2rem] border-4 border-white mb-6 md:mb-8 shadow-sm gap-4">
                <button onClick={() => setStep('SELECT_OP')} className="bg-white p-3 md:p-4 rounded-xl sm:rounded-[1.5rem] shadow-sm hover:bg-gray-50 border-4 border-gray-100 transition-colors w-full sm:w-auto flex justify-center cursor-pointer">
                    <ArrowLeft className="text-gray-700" size={24} strokeWidth={3} />
                </button>
                <div className="flex gap-2 sm:gap-4 w-full sm:w-auto justify-center">
                    <div className="bg-yellow-400 border-b-[4px] md:border-b-[6px] border-yellow-500 text-yellow-900 px-4 md:px-6 py-2 rounded-xl sm:rounded-[1.5rem] font-black text-sm sm:text-lg md:text-xl flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto">
                        <Award size={20} className="md:w-6 md:h-6" /> <span className="hidden sm:inline">Bosqich:</span> {level}
                    </div>
                    <div className="bg-emerald-400 border-b-[4px] md:border-b-[6px] border-emerald-500 text-emerald-900 px-4 md:px-6 py-2 rounded-xl sm:rounded-[1.5rem] font-black text-sm sm:text-lg md:text-xl flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto">
                        <Star size={20} className="fill-emerald-900 md:w-6 md:h-6" /> <span className="hidden sm:inline">Ball:</span> {score}
                    </div>
                </div>
            </div>

            <div className="w-full max-w-2xl bg-gray-100 rounded-full h-4 sm:h-6 mb-8 md:mb-12 overflow-hidden shadow-inner border-4 border-white relative">
                <motion.div
                    className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(questionCount / QUESTIONS_PER_LEVEL) * 100}%` }}
                    transition={{ duration: 0.5, type: 'spring' }}
                />
                <div className="absolute inset-0 flex items-center justify-center font-black text-emerald-900 text-[10px] sm:text-xs tracking-widest opacity-80">
                    {questionCount} / {QUESTIONS_PER_LEVEL}
                </div>
            </div>

            <motion.div
                key={question.a + question.b + operator}
                initial={{ scale: 0.9, rotate: -1, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className="text-[3rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[7.5rem] font-black text-slate-800 mb-8 md:mb-12 bg-white px-4 sm:px-8 md:px-12 py-6 sm:py-8 md:py-12 rounded-3xl sm:rounded-[2.5rem] md:rounded-[3rem] shadow-xl border-4 sm:border-8 border-slate-100 flex justify-center items-center gap-3 sm:gap-6 md:gap-8 w-full max-w-4xl flex-wrap drop-shadow-sm leading-none"
            >
                <span className="drop-shadow-sm leading-none">{question.a}</span>
                <span className="text-blue-500 drop-shadow-sm leading-none">{operator === '/' ? '÷' : operator === '*' ? '×' : operator}</span>
                <span className="drop-shadow-sm leading-none">{question.b}</span>
                <span className="text-slate-300 drop-shadow-sm leading-none">=</span>
                <div className="relative inline-flex items-center justify-center min-w-[4rem] sm:min-w-[5rem] md:min-w-[6rem] h-14 sm:h-20 md:h-28">
                    {selectedAnswer === null ? (
                        <span className="text-rose-500 animate-pulse bg-rose-50 rounded-xl sm:rounded-2xl md:rounded-[2rem] px-3 sm:px-4 md:px-6 py-1 sm:py-2 md:py-4 border-4 sm:border-8 border-rose-200 shadow-inner inline-flex items-center justify-center w-full h-full pb-2 md:pb-6 leading-none cursor-default">?</span>
                    ) : (
                        <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className="text-emerald-500 rounded-xl sm:rounded-2xl md:rounded-[2rem] px-3 sm:px-4 md:px-6 py-1 sm:py-2 md:py-4 bg-emerald-50 border-4 sm:border-8 border-emerald-200 shadow-inner inline-flex items-center justify-center w-full h-full pb-2 md:pb-6 leading-none cursor-default"
                        >
                            {selectedAnswer}
                        </motion.span>
                    )}
                </div>
            </motion.div>

            <motion.div animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.3 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 relative z-10 w-full max-w-4xl px-2 sm:px-0">
                {question.options.map((opt, i) => (
                    <motion.button
                        layout
                        whileHover={selectedAnswer === null ? { scale: 1.03, y: -2 } : {}}
                        whileTap={selectedAnswer === null ? { scale: 0.97, y: 2 } : {}}
                        key={`${question.a}-${question.b}-${i}`}
                        onClick={() => handleAnswer(opt)}
                        disabled={showLevelUp || selectedAnswer !== null}
                        animate={{
                            opacity: selectedAnswer !== null && selectedAnswer !== opt ? 0.3 : 1,
                            scale: selectedAnswer === opt ? 0.8 : 1
                        }}
                        transition={{ duration: 0.2 }}
                        className="bg-blue-500 text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black rounded-2xl sm:rounded-[2rem] w-full py-4 sm:py-6 md:py-8 shadow-[0_6px_0_#1e3a8a] md:shadow-[0_8px_0_#1e3a8a] border-4 border-blue-400 hover:brightness-110 flex items-center justify-center active:shadow-none active:translate-y-[6px] md:active:translate-y-[8px] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer leading-none"
                    >
                        <span className="pb-1 md:pb-2 leading-none">{opt}</span>
                    </motion.button>
                ))}
            </motion.div>

            <div className="h-16 sm:h-24 mt-6 sm:mt-8 flex items-center justify-center">
                <AnimatePresence>
                    {resultMsg && !showLevelUp && (
                        <motion.div
                            initial={{ scale: 0.8, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.8, opacity: 0, y: -10 }}
                            className={`text-lg sm:text-2xl md:text-3xl font-black px-6 sm:px-10 py-3 sm:py-5 rounded-xl sm:rounded-2xl shadow-lg border-4 ${resultMsg.includes("Xato") ? "bg-rose-50 text-rose-600 border-rose-300" : "bg-emerald-50 text-emerald-600 border-emerald-300"}`}
                        >
                            {resultMsg}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );

    return (
        <div className="w-full bg-slate-50 p-4 sm:p-6 md:p-14 rounded-3xl sm:rounded-[2.5rem] md:rounded-[4rem] shadow-2xl border-4 sm:border-8 md:border-[12px] border-white min-h-[500px] md:min-h-[700px] flex items-center justify-center relative overflow-hidden"
            style={{ backgroundImage: 'radial-gradient(#e2e8f0 2px, transparent 2px)', backgroundSize: '32px 32px' }}>
            {step === 'SELECT_DIGIT' && renderStep1()}
            {step === 'SELECT_OP' && renderStep2()}
            {step === 'PLAYING' && renderPlaying()}
        </div>
    );
}

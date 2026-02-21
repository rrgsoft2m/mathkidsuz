"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

type GameType = 'tug' | 'climb' | 'sack';

export default function TwoPlayerArena({ type, onBack }: { type: GameType, onBack: () => void }) {
    const [step, setStep] = useState<'SELECT_DIGIT' | 'SELECT_OP' | 'COUNTDOWN' | 'PLAYING' | 'RESULT'>('SELECT_DIGIT');
    const [digits, setDigits] = useState(1);
    const [operator, setOperator] = useState('+');

    const [p1Score, setP1Score] = useState(0);
    const [p2Score, setP2Score] = useState(0);
    const [p1Input, setP1Input] = useState('');
    const [p2Input, setP2Input] = useState('');
    const [question, setQuestion] = useState({ a: 0, b: 0, op: '+', ans: '0' });
    const [winner, setWinner] = useState<1 | 2 | null>(null);
    const [countdown, setCountdown] = useState<number | string>(3);

    const getMultiplier = (d: number) => {
        if (d === 1) return { min: 1, max: 9 };
        if (d === 2) return { min: 10, max: 99 };
        return { min: 100, max: 999 };
    };

    const generateQ = (dig: number, op: string) => {
        const limitsA = getMultiplier(dig);
        let a = 0, b = 0, ans = 0;
        if (op === '/') {
            const limitsB = getMultiplier(dig);
            let maxAns = dig === 1 ? 10 : dig === 2 ? 30 : 50;
            b = Math.floor(Math.random() * (limitsB.max - limitsB.min + 1)) + limitsB.min;
            ans = Math.floor(Math.random() * maxAns) + 1;
            a = b * ans;
        } else if (op === '*') {
            a = Math.floor(Math.random() * (limitsA.max - limitsA.min + 1)) + limitsA.min;
            let maxB = dig === 1 ? 10 : 50;
            b = Math.floor(Math.random() * maxB) + 1;
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
        return { a, b, op, ans: ans.toString() };
    };

    const playSound = (soundType: 'win' | 'lose' | 'point') => {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            if (soundType === 'point') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
                osc.start(); osc.stop(ctx.currentTime + 0.2);
            } else if (soundType === 'lose') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.start(); osc.stop(ctx.currentTime + 0.3);
            } else {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(400, ctx.currentTime);
                osc.frequency.setValueAtTime(600, ctx.currentTime + 0.2);
                osc.frequency.setValueAtTime(800, ctx.currentTime + 0.4);
                gain.gain.setValueAtTime(0.4, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 1);
                osc.start(); osc.stop(ctx.currentTime + 1);
            }
        } catch { }
    };

    useEffect(() => {
        if (step === 'COUNTDOWN') {
            let c = 3;
            setCountdown(c);
            const int = setInterval(() => {
                c--;
                if (c === 0) setCountdown("Boshladik!");
                else if (c < 0) {
                    clearInterval(int);
                    setQuestion(generateQ(digits, operator));
                    setStep('PLAYING');
                } else {
                    setCountdown(c);
                }
            }, 1000);
            return () => clearInterval(int);
        }
    }, [step, digits, operator]);

    const handleGo = (player: 1 | 2) => {
        const input = player === 1 ? p1Input : p2Input;
        if (input === question.ans) {
            playSound('point');
            setP1Input('');
            setP2Input('');

            const newScore = (player === 1 ? p1Score : p2Score) + 1;
            if (player === 1) setP1Score(newScore); else setP2Score(newScore);

            if (newScore >= 7) {
                setWinner(player);
                setStep('RESULT');
                playSound('win');
                if (player === 1) {
                    const u = localStorage.getItem('mathkids_user');
                    if (u) {
                        let parsed = JSON.parse(u);
                        parsed.score = (parsed.score || 0) + 20;
                        localStorage.setItem('mathkids_user', JSON.stringify(parsed));
                        window.dispatchEvent(new Event('auth_change'));
                    }
                }
            } else {
                setQuestion(generateQ(digits, operator));
            }
        } else {
            playSound('lose');
            if (player === 1) setP1Input(''); else setP2Input('');
        }
    };

    const renderDigitSelect = () => (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center w-full h-full">
            <h2 className="text-3xl md:text-5xl font-extrabold text-blue-900 mb-6 md:mb-10 border-b-8 border-blue-300 pb-4 text-center">Darajani tanlang (1v1)</h2>
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-4xl justify-center">
                {[1, 2, 3].map(d => (
                    <button key={d} onClick={() => { setDigits(d); setStep('SELECT_OP'); }}
                        className={`flex-1 p-6 md:p-8 rounded-[2rem] border-b-8 shadow-xl border-4 text-2xl md:text-3xl font-black transition-transform hover:scale-105
            ${d === 1 ? 'bg-green-100 border-green-500 text-green-900' : d === 2 ? 'bg-yellow-100 border-yellow-500 text-yellow-900' : 'bg-red-100 border-red-500 text-red-900'}`}>
                        {d} Xonali
                    </button>
                ))}
            </div>
            <button onClick={onBack} className="mt-12 text-2xl font-bold bg-white px-8 py-4 rounded-3xl border-4 border-gray-200 text-gray-600 shadow-sm flex items-center gap-2 hover:bg-gray-50">
                <ArrowLeft /> Orqaga
            </button>
        </motion.div>
    );

    const renderOpSelect = () => (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center w-full h-full">
            <h2 className="text-3xl md:text-5xl font-extrabold text-blue-900 mb-6 md:mb-10 border-b-8 border-blue-300 pb-4 text-center">Amalni tanlang</h2>
            <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-2xl">
                {[
                    { op: '+', label: "Qo'shish", icon: "➕", color: "bg-blue-100 border-blue-500 text-blue-900" },
                    { op: '-', label: "Ayirish", icon: "➖", color: "bg-orange-100 border-orange-500 text-orange-900" },
                    { op: '*', label: "Ko'paytirish", icon: "✖️", color: "bg-emerald-100 border-emerald-500 text-emerald-900" },
                    { op: '/', label: "Bo'lish", icon: "➗", color: "bg-rose-100 border-rose-500 text-rose-900" },
                ].map(btn => (
                    <button key={btn.op} onClick={() => { setOperator(btn.op); setStep('COUNTDOWN'); setP1Score(0); setP2Score(0); setP1Input(''); setP2Input(''); }}
                        className={`p-6 md:p-10 rounded-[2rem] border-b-8 border-4 shadow-xl flex flex-col items-center hover:brightness-95 transition-all ${btn.color}`}>
                        <span className="text-[3rem] md:text-[5rem] mb-2 md:mb-4 drop-shadow-md">{btn.icon}</span>
                        <span className="text-xl md:text-3xl font-extrabold">{btn.label}</span>
                    </button>
                ))}
            </div>
            <button onClick={() => setStep('SELECT_DIGIT')} className="mt-10 text-2xl bg-white px-8 py-4 border-4 border-gray-200 rounded-3xl text-gray-500 font-bold flex items-center gap-2 hover:bg-gray-50">
                <ArrowLeft /> Ortga
            </button>
        </motion.div>
    );

    const renderArena = () => {
        if (type === 'tug') {
            const diff = p1Score - p2Score;
            const rope = 50 - diff * 6;
            return (
                <div className="w-full h-48 bg-amber-50 rounded-[3rem] border-[8px] border-amber-200 relative overflow-hidden flex items-center shadow-inner mt-4">
                    <div className="absolute w-full h-6 bg-amber-800 top-1/2 -mt-3 shadow-md opacity-80"></div>
                    <motion.div animate={{ left: `${rope}%` }} className="absolute text-5xl z-10 -ml-6 -mt-[4rem]">🚩</motion.div>
                    <motion.div animate={{ left: `${rope - 20}%` }} className="absolute z-20 text-[5rem] -ml-12 drop-shadow-xl" transition={{ type: 'spring' }}>🤠</motion.div>
                    <motion.div animate={{ left: `${rope + 20}%` }} className="absolute z-20 text-[5rem] -ml-12 drop-shadow-xl" transition={{ type: 'spring' }}>🤖</motion.div>
                    <div className="absolute left-4 top-4 font-black text-2xl text-blue-600 bg-white/50 px-4 py-1 rounded-xl">1-Jamoa: {p1Score}</div>
                    <div className="absolute right-4 top-4 font-black text-2xl text-red-600 bg-white/50 px-4 py-1 rounded-xl">2-Jamoa: {p2Score}</div>
                </div>
            );
        }
        if (type === 'climb') {
            return (
                <div className="w-full h-56 bg-sky-100 rounded-[3rem] border-[8px] border-sky-300 relative overflow-hidden flex items-end justify-center shadow-inner mt-4">
                    <div className="absolute w-[120%] h-[300px] bg-slate-400 rounded-t-[100%] bottom-[-50px] shadow-sm border-t-[8px] border-slate-300">
                        <div className="absolute top-0 left-1/2 -ml-[30px] -mt-[30px] text-[4rem] animate-pulse">🇺🇿</div>
                    </div>

                    <motion.div animate={{ bottom: `${10 + p1Score * 10}%`, left: `${15 + p1Score * 4}%` }} className="absolute z-10 text-[5rem] drop-shadow-lg" transition={{ type: 'spring' }}>🧗‍♂️</motion.div>
                    <motion.div animate={{ bottom: `${10 + p2Score * 10}%`, right: `${15 + p2Score * 4}%` }} className="absolute z-10 text-[5rem] drop-shadow-lg" style={{ transform: 'scaleX(-1)' }} transition={{ type: 'spring' }}>🧗‍♀️</motion.div>

                    <div className="absolute left-4 top-4 font-black text-2xl text-blue-600 bg-white/80 px-4 py-1 rounded-xl">1-Jamoa: {p1Score}</div>
                    <div className="absolute right-4 top-4 font-black text-2xl text-red-600 bg-white/80 px-4 py-1 rounded-xl">2-Jamoa: {p2Score}</div>
                </div>
            );
        }
        if (type === 'sack') {
            return (
                <div className="w-full h-56 bg-green-100 rounded-[3rem] border-[8px] border-green-300 relative overflow-hidden flex flex-col justify-around shadow-inner mt-4">
                    <div className="absolute right-[10%] top-0 bottom-0 w-8 border-l-[12px] border-dashed border-red-500 opacity-80 z-0"></div>

                    <div className="w-full h-1/2 border-b-4 border-white/50 relative flex items-center pr-[10%]">
                        <motion.div animate={{ left: `${5 + (p1Score / 7) * 80}%` }} className="absolute z-10 text-[5rem] drop-shadow-md" transition={{ type: 'spring', bounce: 0.8 }}>📦👦🏻</motion.div>
                        <div className="absolute left-4 top-2 font-black text-xl text-blue-600 bg-white/80 px-3 py-1 rounded-xl">1-Jamoa: {p1Score}/7</div>
                    </div>

                    <div className="w-full h-1/2 relative flex items-center pr-[10%]">
                        <motion.div animate={{ left: `${5 + (p2Score / 7) * 80}%` }} className="absolute z-10 text-[5rem] drop-shadow-md" transition={{ type: 'spring', bounce: 0.8 }}>📦🤖</motion.div>
                        <div className="absolute left-4 bottom-2 font-black text-xl text-red-600 bg-white/80 px-3 py-1 rounded-xl">2-Jamoa: {p2Score}/7</div>
                    </div>
                </div>
            );
        }
    };

    const Numpad = ({ value, onChange, onSubmit, colorPrimary, colorBg }: any) => {
        return (
            <div className={`p-3 md:p-4 rounded-[2rem] md:rounded-[2.5rem] border-[6px] md:border-8 shadow-xl w-full max-w-[280px] md:max-w-[320px] ${colorPrimary}`}>
                <div className={`w-full h-16 md:h-20 bg-white rounded-2xl mb-3 md:mb-4 border-4 shadow-inner flex items-center justify-end px-4 md:px-6 text-4xl md:text-5xl font-black ${colorBg}`}>
                    {value || '_'}
                </div>
                <div className="grid grid-cols-3 gap-2 md:gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                        <button key={n} onClick={() => onChange(value.length < 4 ? value + n : value)}
                            className="bg-white text-2xl md:text-3xl font-black py-3 md:py-4 rounded-xl shadow-[0_4px_0_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none transition-all touch-manipulation">
                            {n}
                        </button>
                    ))}
                    <button onClick={() => onChange('')} className="bg-red-400 text-white text-2xl md:text-3xl font-black py-3 md:py-4 rounded-xl shadow-[0_4px_0_#b91c1c] active:translate-y-1 active:shadow-none transition-all touch-manipulation">C</button>
                    <button onClick={() => onChange(value.length < 4 ? value + '0' : value)} className="bg-white text-2xl md:text-3xl font-black py-3 md:py-4 rounded-xl shadow-[0_4px_0_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none transition-all touch-manipulation">0</button>
                    <button onClick={onSubmit} className="bg-green-500 text-white text-2xl md:text-3xl font-black py-3 md:py-4 rounded-xl shadow-[0_4px_0_#15803d] active:translate-y-1 active:shadow-none transition-all touch-manipulation">GO</button>
                </div>
            </div>
        );
    };

    const renderPlaying = () => (
        <div className="w-full flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-4 md:mb-6">
                <button onClick={onBack} className="bg-white p-2 md:p-3 rounded-2xl shadow-sm border-4 border-gray-200">
                    <ArrowLeft size={24} />
                </button>
                <div className="bg-yellow-100 text-yellow-800 font-extrabold px-3 py-2 md:px-6 md:py-2 rounded-2xl border-4 border-yellow-300 shadow-sm text-sm md:text-xl flex items-center gap-2">
                    Poyga Boshlandi! 🏆
                </div>
            </div>

            <div className="w-full overflow-hidden mb-4 md:mb-0">
                {renderArena()}
            </div>

            <div className="w-full flex flex-col items-center mt-2 md:mt-8 z-20">
                <div className="bg-white px-6 py-4 md:px-10 md:py-6 rounded-[2rem] md:rounded-[3rem] shadow-xl md:shadow-2xl border-[6px] md:border-8 border-gray-100 text-[3rem] md:text-[5rem] font-black text-blue-900 tracking-wider flex items-center gap-2 md:gap-4 md:-mt-[4rem] drop-shadow-md">
                    {question.a} <span className="text-gray-400 text-[2rem] md:text-[4rem]">{question.op === '/' ? '÷' : question.op === '*' ? '×' : question.op}</span> {question.b} = <span className="text-red-500 animate-pulse">?</span>
                </div>
            </div>

            <div className="w-full flex flex-col md:flex-row justify-around gap-6 md:gap-8 mt-6 md:mt-8">
                <div className="flex-1 flex flex-col items-center">
                    <div className="text-xl md:text-3xl font-black text-blue-600 mb-2 md:mb-4 bg-white px-4 py-2 md:px-6 md:py-2 rounded-2xl shadow-sm border-2 border-blue-100">1-Jamoa 🤠</div>
                    <Numpad value={p1Input} onChange={setP1Input} onSubmit={() => handleGo(1)} colorPrimary="bg-blue-100 border-blue-400" colorBg="text-blue-900 border-blue-200" />
                </div>
                <div className="w-2 rounded-full bg-gray-200 opacity-50 hidden md:block"></div>
                <div className="flex-1 flex flex-col items-center">
                    <div className="text-xl md:text-3xl font-black text-red-600 mb-2 md:mb-4 bg-white px-4 py-2 md:px-6 md:py-2 rounded-2xl shadow-sm border-2 border-red-100">2-Jamoa 🤖</div>
                    <Numpad value={p2Input} onChange={setP2Input} onSubmit={() => handleGo(2)} colorPrimary="bg-red-100 border-red-400" colorBg="text-red-900 border-red-200" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full bg-white p-4 md:p-10 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl border-[8px] md:border-[12px] border-white/50 min-h-[700px] flex items-center justify-center relative overscroll-none overflow-hidden"
            style={{ background: 'linear-gradient(to bottom right, #f0fdf4, #e0e7ff)' }}>
            {step === 'SELECT_DIGIT' && renderDigitSelect()}
            {step === 'SELECT_OP' && renderOpSelect()}
            {step === 'COUNTDOWN' && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[10rem] font-black text-purple-600 drop-shadow-2xl">
                    {countdown}
                </motion.div>
            )}
            {step === 'PLAYING' && renderPlaying()}
            {step === 'RESULT' && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-blue-900/90 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="flex flex-col items-center text-center p-12 bg-white rounded-[4rem] shadow-2xl border-[12px] border-yellow-400 z-10 w-full max-w-2xl">
                        <div className="text-[8rem] mb-4">🏆</div>
                        <h1 className="text-6xl font-black text-green-500 drop-shadow-md uppercase mb-4">G'ALABA!</h1>
                        <p className="text-4xl font-extrabold text-blue-900 mt-4 leading-tight">
                            {winner}-Jamoa {type === 'tug' ? "arqonni tortib ketdi!" : type === 'climb' ? "cho'qqiga birinchi chiqdi!" : "marraga birinchi yetib keldi!"} 🎉
                        </p>
                        <div className="flex gap-6 mt-12 w-full">
                            <button onClick={() => { setStep('SELECT_OP'); setP1Score(0); setP2Score(0); }} className="flex-1 bg-blue-500 text-white text-3xl font-black py-6 rounded-[2rem] shadow-[0_8px_0_#1e3a8a] active:translate-y-2 active:shadow-none transition-all">Qayta o&apos;ynash</button>
                            <button onClick={onBack} className="flex-1 bg-gray-200 text-gray-700 text-3xl font-black py-6 rounded-[2rem] shadow-[0_8px_0_#9ca3af] active:translate-y-2 active:shadow-none transition-all">Ortga</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

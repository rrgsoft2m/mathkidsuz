"use client";
import React, { useState } from 'react';
import MathEngine from '@/components/games/MathEngine';
import TwoPlayerArena from '@/components/games/TwoPlayerArena';
import Link from 'next/link';
import { ArrowLeft, Gamepad2, Users, Rocket, Mountain, MoveHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GamesPage() {
    const [activeGame, setActiveGame] = useState<string | null>(null);

    const renderMenu = () => (
        <div className="w-full flex justify-center mt-4 md:mt-8 px-2 md:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full max-w-5xl">

                <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveGame('math')}
                    className="kid-button bg-blue-100 border-[6px] md:border-[8px] border-blue-400 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl flex flex-col items-center hover:bg-blue-200 transition-colors w-full"
                >
                    <div className="bg-white p-3 md:p-4 rounded-full mb-4 md:mb-6 shadow-inner border-4 border-blue-200">
                        <Rocket className="w-12 h-12 md:w-16 md:h-16 text-blue-500" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-900 mb-1 md:mb-2 text-center">Tezkor Hisob</h2>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-700 opacity-80 text-center">(Yakka tartibda)</p>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveGame('tgtug')}
                    className="kid-button bg-amber-100 border-[6px] md:border-[8px] border-amber-400 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl flex flex-col items-center hover:bg-amber-200 transition-colors w-full"
                >
                    <div className="bg-white p-3 md:p-4 rounded-full mb-4 md:mb-6 shadow-inner border-4 border-amber-200">
                        <Users className="w-12 h-12 md:w-16 md:h-16 text-amber-500" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-900 mb-1 md:mb-2 text-center">Arqon Tortish</h2>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-amber-700 opacity-80 text-center">(1 vs 1 Do&apos;stlar bilan)</p>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveGame('tgclimb')}
                    className="kid-button bg-sky-100 border-[6px] md:border-[8px] border-sky-400 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl flex flex-col items-center hover:bg-sky-200 transition-colors w-full"
                >
                    <div className="bg-white p-3 md:p-4 rounded-full mb-4 md:mb-6 shadow-inner border-4 border-sky-200">
                        <Mountain className="w-12 h-12 md:w-16 md:h-16 text-sky-500" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-sky-900 mb-1 md:mb-2 text-center">Cho&apos;qqiga Chiqish</h2>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-sky-700 opacity-80 text-center">(1 vs 1 Do&apos;stlar bilan)</p>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveGame('tgsack')}
                    className="kid-button bg-green-100 border-[6px] md:border-[8px] border-green-400 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl flex flex-col items-center hover:bg-green-200 transition-colors w-full"
                >
                    <div className="bg-white p-3 md:p-4 rounded-full mb-4 md:mb-6 shadow-inner border-4 border-green-200">
                        <MoveHorizontal className="w-12 h-12 md:w-16 md:h-16 text-green-500" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-900 mb-1 md:mb-2 text-center">Qopchada Yugurish</h2>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-700 opacity-80 text-center">(1 vs 1 Do&apos;stlar bilan)</p>
                </motion.button>

            </div>
        </div>
    );

    return (
        <div className="flex flex-col items-center min-h-[90vh] py-4 md:py-8 w-full max-w-7xl mx-auto">

            {!activeGame && (
                <div className="w-full flex flex-col md:flex-row justify-between items-center mb-6 md:mb-10 px-2 md:px-4 gap-4">
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-blue-900 shadow-sm px-4 md:px-8 py-3 md:py-5 border-b-[6px] md:border-b-[10px] border-blue-500 rounded-[2rem] md:rounded-[3rem] bg-blue-100 tracking-wide flex flex-col sm:flex-row items-center gap-3 md:gap-6 text-center mx-auto md:mx-0 w-full md:w-auto">
                        <Gamepad2 className="w-10 h-10 md:w-14 md:h-14 text-blue-600 drop-shadow-sm shrink-0" />
                        <span>O&apos;yinlar Markazi</span>
                    </h1>
                    <Link href="/" className="bg-white text-blue-800 font-extrabold px-6 md:px-8 py-3 md:py-5 rounded-[1.5rem] md:rounded-[2rem] shadow-[0_4px_0_#1e3a8a] md:shadow-[0_6px_0_#1e3a8a] border-[4px] md:border-[6px] border-blue-600 hover:translate-y-1 md:hover:translate-y-2 flex items-center justify-center gap-2 md:gap-3 transition-all text-xl md:text-2xl hover:shadow-[0_2px_0_#1e3a8a] md:hover:shadow-none active:shadow-none w-full sm:w-auto">
                        <ArrowLeft className="w-6 h-6 md:w-9 md:h-9 shrink-0" strokeWidth={3} />
                        <span>Bosh sahifa</span>
                    </Link>
                </div>
            )}

            {activeGame === null && renderMenu()}

            <div className="w-full relative px-2 md:px-4">
                {activeGame === 'math' && (
                    <div className="w-full flex flex-col">
                        <div className="w-full flex justify-end mb-4 md:mb-6">
                            <button onClick={() => setActiveGame(null)} className="bg-red-500 text-white font-black text-lg md:text-xl px-4 md:px-6 py-3 md:py-4 rounded-[1rem] md:rounded-3xl shadow-[0_4px_0_#991b1b] md:shadow-[0_6px_0_#991b1b] border-4 border-red-700 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
                                <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" /> Menyuga Qaytish
                            </button>
                        </div>
                        <MathEngine />
                    </div>
                )}
                {activeGame === 'tgtug' && <TwoPlayerArena type="tug" onBack={() => setActiveGame(null)} />}
                {activeGame === 'tgclimb' && <TwoPlayerArena type="climb" onBack={() => setActiveGame(null)} />}
                {activeGame === 'tgsack' && <TwoPlayerArena type="sack" onBack={() => setActiveGame(null)} />}
            </div>
        </div>
    );
}

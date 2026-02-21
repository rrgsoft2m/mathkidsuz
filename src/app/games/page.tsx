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
        <div className="w-full flex justify-center mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">

                <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveGame('math')}
                    className="kid-button bg-blue-100 border-[8px] border-blue-400 p-10 rounded-[3rem] shadow-xl flex flex-col items-center hover:bg-blue-200 transition-colors"
                >
                    <div className="bg-white p-4 rounded-full mb-6 shadow-inner border-4 border-blue-200">
                        <Rocket size={64} className="text-blue-500" />
                    </div>
                    <h2 className="text-4xl font-extrabold text-blue-900 mb-2">Tezkor Hisob</h2>
                    <p className="text-2xl font-bold text-blue-700 opacity-80">(Yakka tartibda)</p>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveGame('tgtug')}
                    className="kid-button bg-amber-100 border-[8px] border-amber-400 p-10 rounded-[3rem] shadow-xl flex flex-col items-center hover:bg-amber-200 transition-colors"
                >
                    <div className="bg-white p-4 rounded-full mb-6 shadow-inner border-4 border-amber-200">
                        <Users size={64} className="text-amber-500" />
                    </div>
                    <h2 className="text-4xl font-extrabold text-amber-900 mb-2">Arqon Tortish</h2>
                    <p className="text-2xl font-bold text-amber-700 opacity-80">(1 vs 1 Do'stlar bilan)</p>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveGame('tgclimb')}
                    className="kid-button bg-sky-100 border-[8px] border-sky-400 p-10 rounded-[3rem] shadow-xl flex flex-col items-center hover:bg-sky-200 transition-colors"
                >
                    <div className="bg-white p-4 rounded-full mb-6 shadow-inner border-4 border-sky-200">
                        <Mountain size={64} className="text-sky-500" />
                    </div>
                    <h2 className="text-4xl font-extrabold text-sky-900 mb-2">Cho'qqiga Chiqish</h2>
                    <p className="text-2xl font-bold text-sky-700 opacity-80">(1 vs 1 Do'stlar bilan)</p>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveGame('tgsack')}
                    className="kid-button bg-green-100 border-[8px] border-green-400 p-10 rounded-[3rem] shadow-xl flex flex-col items-center hover:bg-green-200 transition-colors"
                >
                    <div className="bg-white p-4 rounded-full mb-6 shadow-inner border-4 border-green-200">
                        <MoveHorizontal size={64} className="text-green-500" />
                    </div>
                    <h2 className="text-4xl font-extrabold text-green-900 mb-2">Qopchada Yugurish</h2>
                    <p className="text-2xl font-bold text-green-700 opacity-80">(1 vs 1 Do'stlar bilan)</p>
                </motion.button>

            </div>
        </div>
    );

    return (
        <div className="flex flex-col items-center min-h-[90vh] py-8 w-full max-w-7xl mx-auto">

            {!activeGame && (
                <div className="w-full flex justify-between items-center mb-10 px-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-blue-900 shadow-sm px-8 py-5 border-b-[10px] border-blue-500 rounded-[3rem] bg-blue-100 tracking-wide flex items-center gap-6">
                        <Gamepad2 size={56} className="text-blue-600 drop-shadow-sm" /> O&apos;yinlar Markazi
                    </h1>
                    <Link href="/" className="bg-white text-blue-800 font-extrabold px-8 py-5 rounded-[2rem] shadow-[0_6px_0_#1e3a8a] border-[6px] border-blue-600 hover:translate-y-2 flex items-center gap-3 transition-all text-2xl hover:shadow-none active:shadow-none">
                        <ArrowLeft size={36} strokeWidth={3} /> Bosh sahifa
                    </Link>
                </div>
            )}

            {activeGame === null && renderMenu()}

            <div className="w-full relative">
                {activeGame === 'math' && (
                    <div className="w-full flex flex-col">
                        <div className="w-full flex justify-end mb-6">
                            <button onClick={() => setActiveGame(null)} className="bg-red-500 text-white font-black text-xl px-6 py-4 rounded-3xl shadow-[0_6px_0_#991b1b] border-4 border-red-700 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2">
                                <ArrowLeft /> Menyuga Qaytish
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

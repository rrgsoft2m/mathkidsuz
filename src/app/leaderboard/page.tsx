"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, Star, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const defaultUsers = [
    { id: '1', rank: 1, name: "Azizbek", points: 1250, avatar: "👦🏻", color: "bg-yellow-100 border-yellow-500 text-yellow-900" },
    { id: '2', rank: 2, name: "Madina", points: 1100, avatar: "👧🏽", color: "bg-gray-100 border-gray-400 text-gray-800" },
    { id: '3', rank: 3, name: "Jasur", points: 950, avatar: "👦🏽", color: "bg-orange-100 border-orange-500 text-orange-900" },
    { id: '4', rank: 4, name: "Zuhra", points: 800, avatar: "👧🏻", color: "bg-purple-50 border-purple-300 text-purple-900" },
    { id: '5', rank: 5, name: "Timur", points: 750, avatar: "👦🏼", color: "bg-blue-50 border-blue-300 text-blue-900" },
];

export default function LeaderboardPage() {
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const u = localStorage.getItem('mathkids_user');
        if (u) {
            setCurrentUser(JSON.parse(u));
        }
    }, []);

    return (
        <div className="flex flex-col items-center min-h-[80vh] w-full max-w-4xl mx-auto py-4 md:py-8">
            <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 mb-6 md:mb-10 px-2 md:px-4">
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-purple-900 shadow-sm px-4 md:px-8 py-3 md:py-4 border-b-[6px] md:border-b-8 border-purple-500 rounded-[2rem] md:rounded-[2.5rem] bg-purple-200 flex flex-col sm:flex-row justify-center items-center gap-2 md:gap-4 w-full md:w-auto text-center mx-auto md:mx-0">
                    <Trophy className="w-10 h-10 md:w-14 md:h-14 text-yellow-600 drop-shadow-md shrink-0" />
                    <span>Haftalik Reyting</span>
                </h1>
                <Link href="/" className="bg-white text-purple-800 font-bold px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-[0_4px_0_#4c1d95] hover:translate-y-1 hover:shadow-[0_2px_0_#4c1d95] active:shadow-none active:translate-y-2 border-[3px] md:border-4 border-purple-600 flex items-center justify-center gap-2 transition-all text-lg md:text-xl w-full sm:w-auto">
                    <ArrowLeft className="w-5 h-5 md:w-7 md:h-7 shrink-0" />
                    <span>Bosh sahifa</span>
                </Link>
            </div>

            <div className="w-full bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl border-[6px] md:border-8 border-purple-100 overflow-hidden relative">

                <div className="p-4 md:p-10 flex flex-col gap-4 md:gap-6">

                    {/* Current user floating bar if logged in */}
                    {currentUser && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex flex-col sm:flex-row items-center justify-between p-4 sm:p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border-[6px] md:border-8 bg-green-50 border-green-500 shadow-lg relative z-10 mb-4 md:mb-4 gap-4 sm:gap-0 mt-6 sm:mt-0`}
                        >
                            <div className="absolute -top-4 sm:-top-5 left-1/2 sm:left-8 -translate-x-1/2 sm:translate-x-0 bg-green-600 text-white font-black px-4 sm:px-6 py-1 sm:py-2 rounded-xl sm:rounded-2xl shadow-md border-[3px] sm:border-4 border-green-800 text-sm sm:text-base whitespace-nowrap">Sening O&apos;rning (Yangi)</div>
                            <div className="flex items-center gap-3 md:gap-8 mt-2 md:mt-4">
                                <div className="text-3xl md:text-5xl font-black w-8 md:w-12 text-center drop-shadow-sm text-green-700">
                                    6
                                </div>
                                <div className="text-4xl md:text-6xl drop-shadow-md bg-white rounded-full p-2 border-4 border-green-300 w-16 h-16 md:w-24 md:h-24 flex items-center justify-center shrink-0">{currentUser.avatar || '👦🏻'}</div>
                                <div className="text-xl sm:text-2xl md:text-4xl font-black text-green-900 tracking-wide truncate max-w-[120px] sm:max-w-[200px] md:max-w-[300px] text-center sm:text-left">{currentUser.name} (Sen)</div>
                            </div>
                            <div className="flex items-center justify-center gap-1 sm:gap-2 text-xl sm:text-2xl md:text-4xl font-black bg-white/60 px-4 md:px-6 py-2 md:py-3 border-[3px] md:border-4 border-green-300 rounded-[1.5rem] sm:rounded-3xl text-green-800 w-full sm:w-auto">
                                {currentUser.score || 0} <Star className="text-yellow-500 fill-yellow-500 drop-shadow-sm shrink-0 w-6 h-6 md:w-9 md:h-9" />
                            </div>
                        </motion.div>
                    )}

                    {defaultUsers.map((user, index) => (
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                            key={user.id}
                            className={`flex flex-col sm:flex-row items-center justify-between p-4 md:p-6 rounded-[1.5rem] md:rounded-3xl border-4 ${user.color} shadow-sm hover:scale-[1.01] transition-transform gap-4 sm:gap-0`}
                        >
                            <div className="flex items-center gap-3 md:gap-8 w-full sm:w-auto justify-start">
                                <div className="text-3xl sm:text-4xl md:text-5xl font-black w-10 sm:w-12 text-center drop-shadow-sm opacity-90 shrink-0">
                                    {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : `#${user.rank}`}
                                </div>
                                <div className="text-4xl sm:text-5xl md:text-6xl drop-shadow-md bg-white/50 rounded-full p-2 md:p-2 border-2 text-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center shrink-0">{user.avatar}</div>
                                <div className="text-xl sm:text-2xl md:text-4xl font-extrabold tracking-wide text-gray-800 truncate max-w-[150px] sm:max-w-[200px] md:max-w-none">{user.name}</div>
                            </div>
                            <div className="flex items-center justify-center gap-1 sm:gap-2 text-xl sm:text-2xl md:text-4xl font-black bg-white/60 px-4 md:px-6 py-2 md:py-3 border-[3px] md:border-4 border-white rounded-[1.5rem] sm:rounded-3xl opacity-90 drop-shadow-sm text-gray-800 w-full sm:w-auto">
                                {user.points} <Star className="text-yellow-500 fill-yellow-500 drop-shadow-sm shrink-0 w-6 h-6 md:w-9 md:h-9" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

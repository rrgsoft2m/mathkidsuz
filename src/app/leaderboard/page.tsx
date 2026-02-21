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
        <div className="flex flex-col items-center min-h-[80vh] w-full max-w-4xl mx-auto py-8">
            <div className="w-full flex justify-between items-center mb-10 px-4">
                <h1 className="text-3xl md:text-5xl font-extrabold text-purple-900 shadow-sm px-8 py-4 border-b-8 border-purple-500 rounded-[2.5rem] bg-purple-200 flex items-center gap-4">
                    <Trophy size={56} className="text-yellow-600 drop-shadow-md" /> Haftalik Reyting
                </h1>
                <Link href="/" className="bg-white text-purple-800 font-bold px-6 py-4 rounded-2xl shadow-[0_4px_0_#4c1d95] hover:translate-y-1 hover:shadow-none border-4 border-purple-600 flex items-center gap-2 transition-all text-xl">
                    <ArrowLeft size={28} /> Bosh sahifa
                </Link>
            </div>

            <div className="w-full bg-white rounded-[3rem] shadow-2xl border-8 border-purple-100 overflow-hidden relative">

                <div className="p-6 md:p-10 flex flex-col gap-6">

                    {/* Current user floating bar if logged in */}
                    {currentUser && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex items-center justify-between p-4 md:p-6 rounded-[2.5rem] border-8 bg-green-50 border-green-500 shadow-lg relative z-10 mb-4`}
                        >
                            <div className="absolute -top-5 left-8 bg-green-600 text-white font-black px-6 py-2 rounded-2xl shadow-md border-4 border-green-800">Sening O&apos;rning (Yangi)</div>
                            <div className="flex items-center gap-4 md:gap-8 mt-4">
                                <div className="text-4xl md:text-5xl font-black w-12 text-center drop-shadow-sm text-green-700">
                                    6
                                </div>
                                <div className="text-5xl md:text-6xl drop-shadow-md bg-white rounded-full p-2 border-4 border-green-300">{currentUser.avatar || '👦🏻'}</div>
                                <div className="text-2xl md:text-4xl font-black text-green-900 tracking-wide">{currentUser.name} (Sen)</div>
                            </div>
                            <div className="flex items-center gap-2 text-2xl md:text-4xl font-black bg-white/60 px-6 py-3 border-4 border-green-300 rounded-3xl text-green-800">
                                {currentUser.score || 0} <Star className="text-yellow-500 fill-yellow-500 drop-shadow-sm" size={36} />
                            </div>
                        </motion.div>
                    )}

                    {defaultUsers.map((user, index) => (
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                            key={user.id}
                            className={`flex items-center justify-between p-4 md:p-6 rounded-3xl border-4 ${user.color} shadow-sm hover:scale-[1.01] transition-transform`}
                        >
                            <div className="flex items-center gap-4 md:gap-8">
                                <div className="text-4xl md:text-5xl font-black w-12 text-center drop-shadow-sm opacity-90">
                                    {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : `#${user.rank}`}
                                </div>
                                <div className="text-5xl md:text-6xl drop-shadow-md bg-white/50 rounded-full p-2 border-2 text-center">{user.avatar}</div>
                                <div className="text-2xl md:text-4xl font-extrabold tracking-wide text-gray-800">{user.name}</div>
                            </div>
                            <div className="flex items-center gap-2 text-2xl md:text-4xl font-black bg-white/60 px-6 py-3 border-4 border-white rounded-3xl opacity-90 drop-shadow-sm text-gray-800">
                                {user.points} <Star className="text-yellow-500 fill-yellow-500 drop-shadow-sm" size={36} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

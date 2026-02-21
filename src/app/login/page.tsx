"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Lock, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(false);
    const [name, setName] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const router = useRouter();

    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (!isLogin && name.length < 3) {
            setErrorMsg('Ismingiz kamida 3 ta harfdan iborat bo\'lishi kerak!');
            return;
        }

        const userName = isLogin ? "O'yinchi" : name;

        // Save to local storage for demo usage
        localStorage.setItem('mathkids_user', JSON.stringify({
            name: userName,
            score: 120, // Give them 120 points to start
            avatar: ['👦🏻', '👧🏽', '👦🏽', '👧🏻'][Math.floor(Math.random() * 4)]
        }));

        window.dispatchEvent(new Event('auth_change')); // trigger Navbar update
        router.push('/'); // Redirect home
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[75vh] w-full max-w-lg mx-auto py-8">

            <div className="w-full mb-8 flex justify-start">
                <Link href="/" className="bg-white text-blue-800 font-bold px-6 py-3 rounded-2xl shadow-[0_4px_0_#1e3a8a] border-4 border-blue-600 hover:translate-y-1 hover:shadow-none flex items-center gap-2 transition-all">
                    <ArrowLeft size={24} /> Bosh sahifaga qaytish
                </Link>
            </div>

            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="bg-white w-full rounded-[3rem] shadow-2xl border-8 border-blue-200 overflow-hidden"
            >
                <div className="bg-gradient-to-r from-blue-400 to-indigo-500 p-10 flex flex-col items-center">
                    <div className="bg-white p-5 rounded-full mb-6 shadow-xl border-4 border-blue-200 transform hover:rotate-12 transition-transform">
                        <Rocket size={56} className="text-orange-500" />
                    </div>
                    <h2 className="text-4xl font-extrabold text-white text-center drop-shadow-md">
                        {isLogin ? "Sarguzashtga Qaytish!" : "Yangi Qahramon!"}
                    </h2>
                    <p className="text-blue-100 font-medium text-lg mt-2 text-center max-w-xs">{isLogin ? "O'z hisobingizga kiring va yana yutqizib qo'ymang!" : "Matematik o'yinlar olamiga ro'yxatdan o'ting"}</p>
                </div>

                <div className="p-8 md:p-10">
                    <div className="flex gap-4 mb-8 bg-blue-50 p-2 rounded-2xl shadow-inner border-2 border-blue-100">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-4 rounded-xl font-extrabold text-xl transition-all ${isLogin ? 'bg-blue-500 text-white shadow-md scale-105' : 'text-blue-600 hover:bg-blue-100'}`}
                        >
                            Kirish
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-4 rounded-xl font-extrabold text-xl transition-all ${!isLogin ? 'bg-green-500 text-white shadow-md scale-105' : 'text-green-600 hover:bg-green-100'}`}
                        >
                            A&apos;zo bo&apos;lish
                        </button>
                    </div>

                    <form className="flex flex-col gap-6" onSubmit={handleAuth}>
                        {!isLogin && (
                            <div>
                                <label className="block text-gray-500 font-bold mb-2 ml-4 text-lg">Qahramon Ismi</label>
                                <div className="relative">
                                    <User className="absolute left-5 top-4 text-gray-400" size={28} />
                                    <input
                                        type="text"
                                        placeholder="Masalan: Sardor, Malika"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-gray-50 border-4 border-gray-200 rounded-2xl py-4 pl-16 pr-4 text-xl font-bold focus:outline-none focus:border-blue-400 focus:bg-white transition-colors placeholder-gray-300"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-gray-500 font-bold mb-2 ml-4 text-lg">Login</label>
                            <div className="relative">
                                <User className="absolute left-5 top-4 text-gray-400" size={28} />
                                <input type="text" placeholder="Ism yoki Elektron pochta" className="w-full bg-gray-50 border-4 border-gray-200 rounded-2xl py-4 pl-16 pr-4 text-xl font-bold focus:outline-none focus:border-blue-400 focus:bg-white transition-colors placeholder-gray-300" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-500 font-bold mb-2 ml-4 text-lg">Parol</label>
                            <div className="relative">
                                <Lock className="absolute left-5 top-4 text-gray-400" size={28} />
                                <input type="password" placeholder="Maxfiy so'z" className="w-full bg-gray-50 border-4 border-gray-200 rounded-2xl py-4 pl-16 pr-4 text-xl font-bold focus:outline-none focus:border-blue-400 focus:bg-white transition-colors placeholder-gray-300" />
                            </div>
                        </div>

                        {errorMsg && (
                            <div className="bg-red-50 text-red-600 font-bold p-4 rounded-2xl text-center border-2 border-red-200">
                                {errorMsg}
                            </div>
                        )}

                        <button type="submit" className={`kid-button w-full text-white text-2xl font-black py-5 rounded-[2rem] mt-4 shadow-[0_6px_0_rgba(0,0,0,0.2)] hover:shadow-[0_4px_0_rgba(0,0,0,0.2)] hover:translate-y-[2px] active:translate-y-[6px] active:shadow-none border-4 transition-all ${isLogin ? 'bg-blue-500 border-blue-600' : 'bg-green-500 border-green-600'}`}>
                            {isLogin ? "Qani Boshladik! 🚀" : "O'yinchi Yaratish! ✨"}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}

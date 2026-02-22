"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, LogOut, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const checkUser = () => {
            const u = localStorage.getItem('mathkids_user');
            if (u) setUser(JSON.parse(u));
            else setUser(null);
        };

        checkUser();

        window.addEventListener('auth_change', checkUser);
        window.addEventListener('storage', checkUser); // for multi-tab

        return () => {
            window.removeEventListener('auth_change', checkUser);
            window.removeEventListener('storage', checkUser);
        };
    }, []);

    const logout = () => {
        localStorage.removeItem('mathkids_user');
        setUser(null);
        window.dispatchEvent(new Event('auth_change'));
        router.push('/');
    };

    if (!user) return (
        <div className="w-full max-w-7xl mx-auto px-4 py-4 md:py-6 flex justify-center sm:justify-between items-center mb-2">
            <Link href="/" className="text-3xl md:text-4xl font-black text-blue-600 drop-shadow-sm tracking-tight">MathKids.uz</Link>
        </div>
    );

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-4 md:py-6 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-2">
            <Link href="/" className="text-3xl md:text-4xl font-black text-blue-600 drop-shadow-sm tracking-tight text-center sm:text-left">MathKids.uz</Link>

            <div className="flex gap-2 sm:gap-4 items-center bg-white px-3 sm:px-4 md:px-6 py-2 rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_4px_0_#d1d5db] border-[3px] sm:border-4 border-gray-100 hover:border-gray-200 transition-colors w-full sm:w-auto justify-center sm:justify-start">
                <div className="flex items-center gap-2 sm:gap-3 font-extrabold text-gray-700 text-base md:text-lg">
                    <div className="bg-yellow-100 text-xl md:text-2xl w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border-2 border-yellow-300 shadow-sm shrink-0">
                        {user.avatar || '👦🏻'}
                    </div>
                    <span className="hidden md:block truncate max-w-[150px]">{user.name}</span>
                </div>
                <div className="w-1 h-6 md:h-8 bg-gray-200 rounded-full mx-0 sm:mx-1 shrink-0"></div>
                <div className="flex items-center gap-1 sm:gap-2 font-black text-green-600 md:bg-green-50 md:px-3 md:py-1 rounded-xl text-lg md:text-xl shrink-0">
                    {user.score || 0} <Star className="w-5 h-5 md:w-6 md:h-6 fill-green-500" />
                </div>
                <div className="w-1 h-6 md:h-8 bg-gray-200 rounded-full mx-0 sm:mx-1 shrink-0"></div>
                <button onClick={logout} className="text-red-500 hover:bg-red-100 p-1.5 md:p-2 rounded-full transition-colors shrink-0" title="Chiqish">
                    <LogOut className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
                </button>
            </div>
        </div>
    );
}

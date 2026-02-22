import Link from 'next/link';
import { Gamepad2, Trophy, BookOpen, User } from 'lucide-react';

export default function Home() {
    return (
        <main className="flex min-h-[80vh] flex-col items-center justify-center py-10 md:py-0 md:-mt-8">
            {/* Hero Section */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-blue-600 drop-shadow-md mb-4 md:mb-6 text-center mt-4 md:mt-0 px-2">
                MathKids.uz
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-10 md:mb-12 text-center max-w-2xl font-medium px-4">
                Matematikani o&apos;yin orqali o&apos;rganamiz! Qiziqarli boshqotirmalar,
                do&apos;stlar bilan musobaqalar va ajoyib sovg&apos;alar seni kutmoqda.
            </p>

            {/* Main Menu Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 w-full max-w-4xl px-4 md:px-0">

                <Link href="/games" className="group block">
                    <div className="kid-button bg-yellow-400 rounded-[2rem] md:rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center shadow-[0_6px_0_#b45309] border-4 border-yellow-500 hover:bg-yellow-300 transition-all text-center">
                        <Gamepad2 size={56} className="md:w-16 md:h-16 text-orange-600 mb-3 md:mb-4 group-hover:animate-bounce" />
                        <h2 className="text-2xl md:text-3xl font-bold text-orange-900">O&apos;yinlar</h2>
                        <p className="text-orange-800 text-sm md:text-base mt-2">Tezkor hisoblash va mantiqiy o&apos;yinlar</p>
                    </div>
                </Link>

                <Link href="/lessons" className="group block">
                    <div className="kid-button bg-green-400 rounded-[2rem] md:rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center shadow-[0_6px_0_#166534] border-4 border-green-500 hover:bg-green-300 transition-all text-center">
                        <BookOpen size={56} className="md:w-16 md:h-16 text-green-800 mb-3 md:mb-4 group-hover:animate-bounce" />
                        <h2 className="text-2xl md:text-3xl font-bold text-green-900">Darslar</h2>
                        <p className="text-green-800 text-sm md:text-base mt-2">Mavzulashtirilgan o&apos;quv materiallari</p>
                    </div>
                </Link>

                <Link href="/leaderboard" className="group block">
                    <div className="kid-button bg-purple-400 rounded-[2rem] md:rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center shadow-[0_6px_0_#4c1d95] border-4 border-purple-500 hover:bg-purple-300 transition-all text-center">
                        <Trophy size={56} className="md:w-16 md:h-16 text-purple-800 mb-3 md:mb-4 group-hover:animate-bounce" />
                        <h2 className="text-2xl md:text-3xl font-bold text-purple-900">Reyting</h2>
                        <p className="text-purple-800 text-sm md:text-base mt-2">Eng kuchli matematiklar doskasi</p>
                    </div>
                </Link>

                <Link href="/login" className="group block">
                    <div className="kid-button bg-blue-400 rounded-[2rem] md:rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center shadow-[0_6px_0_#1e3a8a] border-4 border-blue-500 hover:bg-blue-300 transition-all text-center">
                        <User size={56} className="md:w-16 md:h-16 text-blue-800 mb-3 md:mb-4 group-hover:animate-bounce" />
                        <h2 className="text-2xl md:text-3xl font-bold text-blue-900">Kirish</h2>
                        <p className="text-blue-800 text-sm md:text-base mt-2">Shaxsiy kabinetga ulanish</p>
                    </div>
                </Link>

            </div>
        </main>
    );
}

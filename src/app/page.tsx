import Link from 'next/link';
import { Gamepad2, Trophy, BookOpen, User } from 'lucide-react';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center -mt-8">
            {/* Hero Section */}
            <h1 className="text-6xl font-extrabold text-blue-600 drop-shadow-md mb-4 text-center">
                MathKids.uz
            </h1>
            <p className="text-xl text-gray-700 mb-12 text-center max-w-2xl font-medium">
                Matematikani o&apos;yin arqali o&apos;rganamiz! Qiziqarli boshqotirmalar,
                do&apos;stlar bilan musobaqalar va ajoyib sovg&apos;alar seni kutmoqda.
            </p>

            {/* Main Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">

                <Link href="/games" className="group block">
                    <div className="kid-button bg-yellow-400 rounded-3xl p-8 flex flex-col items-center justify-center shadow-[0_8px_0_#b45309] border-4 border-yellow-500 hover:bg-yellow-300">
                        <Gamepad2 size={64} className="text-orange-600 mb-4 group-hover:animate-bounce" />
                        <h2 className="text-3xl font-bold text-orange-900">O&apos;yinlar</h2>
                        <p className="text-orange-800 text-center mt-2">Tezkor hisoblash va mantiqiy o&apos;yinlar</p>
                    </div>
                </Link>

                <Link href="/lessons" className="group block">
                    <div className="kid-button bg-green-400 rounded-3xl p-8 flex flex-col items-center justify-center shadow-[0_8px_0_#166534] border-4 border-green-500 hover:bg-green-300">
                        <BookOpen size={64} className="text-green-800 mb-4 group-hover:animate-bounce" />
                        <h2 className="text-3xl font-bold text-green-900">Darslar</h2>
                        <p className="text-green-800 text-center mt-2">Mavzulashtirilgan o&apos;quv materiallari</p>
                    </div>
                </Link>

                <Link href="/leaderboard" className="group block">
                    <div className="kid-button bg-purple-400 rounded-3xl p-8 flex flex-col items-center justify-center shadow-[0_8px_0_#4c1d95] border-4 border-purple-500 hover:bg-purple-300">
                        <Trophy size={64} className="text-purple-800 mb-4 group-hover:animate-bounce" />
                        <h2 className="text-3xl font-bold text-purple-900">Reyting</h2>
                        <p className="text-purple-800 text-center mt-2">Eng kuchli matematiklar doskasi</p>
                    </div>
                </Link>

                <Link href="/login" className="group block">
                    <div className="kid-button bg-blue-400 rounded-3xl p-8 flex flex-col items-center justify-center shadow-[0_8px_0_#1e3a8a] border-4 border-blue-500 hover:bg-blue-300">
                        <User size={64} className="text-blue-800 mb-4 group-hover:animate-bounce" />
                        <h2 className="text-3xl font-bold text-blue-900">Kirish</h2>
                        <p className="text-blue-800 text-center mt-2">Shaxsiy kabinetga ulanish</p>
                    </div>
                </Link>

            </div>
        </main>
    );
}

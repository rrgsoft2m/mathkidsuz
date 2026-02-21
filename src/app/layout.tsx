import type { Metadata } from 'next';
import { Baloo_2 } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const baloo = Baloo_2({
    subsets: ['latin'],
    variable: '--font-baloo',
    weight: ['400', '500', '600', '700', '800']
});

export const metadata: Metadata = {
    title: 'MathKids.uz - Interaktiv Matematika',
    description: 'Bolalar uchun qiziqarli va o\'yinli matematika platformasi',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="uz">
            <body className={`${baloo.variable} font-sans min-h-screen bg-green-50 overflow-x-hidden flex flex-col`}>
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-grow w-full">
                    {children}
                </div>

                <footer className="w-full py-8 mt-12 border-t-[6px] border-green-200/50 bg-green-100/30">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <p className="text-lg md:text-xl font-bold text-green-800/70">
                            © 2026 <span className="text-green-700">RRGSOFT</span> tomonidan ishlab chiqarilgan
                        </p>
                        <a
                            href="https://t.me/rrgfcoder"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-2 text-blue-500 hover:text-blue-700 font-extrabold text-lg md:text-xl underline underline-offset-4 decoration-4 decoration-blue-200 hover:decoration-blue-500 transition-all"
                        >
                            Telegram orqali bog'lanish
                        </a>
                    </div>
                </footer>
            </body>
        </html>
    );
}

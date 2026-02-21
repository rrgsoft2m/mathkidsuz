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
            <body className={`${baloo.variable} font-sans min-h-screen bg-green-50 overflow-x-hidden`}>
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    {children}
                </div>
            </body>
        </html>
    );
}

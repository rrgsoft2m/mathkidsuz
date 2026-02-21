"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Star, Video, ArrowLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const lessons = [
    { id: 1, title: "Qo'shish Darsi", operation: "+", desc: "Bolalar uchun sodda qo'shish qoidalari", color: "bg-green-100 border-green-500 text-green-900", icon: "➕", videoId: "SnkRFP-YQi4" },
    { id: 2, title: "Ayirish Darsi", operation: "-", desc: "Ayirish qanday ishlaydi?", color: "bg-yellow-100 border-yellow-500 text-yellow-900", icon: "➖", videoId: "21ykvQd7fYg" },
    { id: 3, title: "Karra Jadvali", operation: "*", desc: "Tez ko'paytirish usullari", color: "bg-blue-100 border-blue-500 text-blue-900", icon: "✖️", videoId: "5EgCQX2D4Zo" },
    { id: 4, title: "Bo'lish sirlari", operation: "/", desc: "Qanday qilib to'g'ri bo'lish kerak", color: "bg-purple-100 border-purple-500 text-purple-900", icon: "➗", videoId: "uZ_dMH_A9mQ" },
    { id: 5, title: "Kasrlar va pitsa", operation: "fraction", desc: "Pitsa bo'laklari orqali kasrlar", color: "bg-pink-100 border-pink-500 text-pink-900", icon: "🍕", videoId: "Ctnb1ClvEy4" },
    { id: 6, title: "Shakllarni top", operation: "logic", desc: "Mantiqiy ketma-ketliklar", color: "bg-orange-100 border-orange-500 text-orange-900", icon: "🧠", videoId: "wBlWy0qweIs" },
];

export default function LessonsPage() {
    const [videoModalOpen, setVideoModalOpen] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState<any>(null);

    const handleVideoClick = (lesson: any) => {
        setSelectedLesson(lesson);
        setVideoModalOpen(true);
    };

    return (
        <div className="flex flex-col items-center min-h-[80vh] w-full max-w-7xl mx-auto py-8">

            {/* Video Modal Placeholder with Iframe */}
            <AnimatePresence>
                {videoModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                            className={`w-full max-w-[1000px] w-[95%] rounded-[3rem] p-6 md:p-10 border-[12px] shadow-2xl relative ${selectedLesson?.color.replace('border-', 'border-') || 'bg-white'} overflow-hidden`}
                        >
                            <button
                                onClick={() => setVideoModalOpen(false)}
                                className="absolute top-6 right-6 bg-white p-3 rounded-full shadow-lg text-red-500 hover:bg-red-50 hover:scale-110 transition-transform border-4 border-gray-200 z-50"
                            >
                                <X size={40} strokeWidth={3} />
                            </button>

                            <div className="flex items-center gap-6 mb-8 border-b-8 border-black/10 pb-6 pr-16 text-left">
                                <div className="text-[6rem] drop-shadow-md bg-white/50 w-32 h-32 rounded-full flex items-center justify-center border-4 border-white/50">{selectedLesson?.icon}</div>
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-black mb-2 tracking-tight text-gray-900">
                                        {selectedLesson?.title}
                                    </h2>
                                    <p className="text-2xl font-bold opacity-80 text-gray-800">
                                        O&apos;qituvchi bilan qiziqarli darsni tomosha qiling!
                                    </p>
                                </div>
                            </div>

                            <div className="w-full aspect-video bg-gray-900 rounded-[2.5rem] flex items-center justify-center border-[10px] border-gray-800 shadow-2xl relative overflow-hidden">

                                {/* Real Youtube Video Embed Mock - a good educational placeholder video  */}
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${selectedLesson?.videoId || 'IGnqG192FhU'}`}
                                    title={selectedLesson?.title || "Math for Kids"}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className="absolute inset-0 z-10"
                                ></iframe>

                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="w-full flex justify-between items-center mb-12 px-6">
                <h1 className="text-4xl md:text-6xl font-extrabold text-green-900 shadow-sm px-8 py-5 border-b-[10px] border-green-500 rounded-[3rem] bg-green-200 flex items-center gap-6 tracking-wide text-left mx-auto md:mx-0 drop-shadow-sm">
                    <BookOpen size={64} className="text-green-700" /> Darslar Xonasi!
                </h1>
                <Link href="/" className="hidden md:flex bg-white text-green-800 font-black px-8 py-5 rounded-[2rem] shadow-[0_6px_0_#166534] hover:translate-y-1 hover:shadow-none border-4 border-green-600 items-center gap-4 transition-all text-2xl">
                    <ArrowLeft size={36} strokeWidth={3} /> Bosh sahifa
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 w-full px-4">
                {lessons.map((lesson, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, type: "spring" }}
                        key={lesson.id}
                        className={`rounded-[3rem] p-10 border-[6px] border-b-[12px] flex flex-col items-center text-center shadow-md transition-transform hover:-translate-y-4 hover:brightness-[1.03] ${lesson.color}`}
                    >
                        <div className="text-[6rem] mb-6 bg-white/60 w-36 h-36 rounded-full flex items-center justify-center shadow-inner border-[6px] border-white/40 drop-shadow-md pb-2">
                            {lesson.icon}
                        </div>

                        <h2 className="text-4xl font-black mb-4 drop-shadow-sm tracking-tight">{lesson.title}</h2>
                        <div className="font-extrabold mb-10 text-xl opacity-80 h-16 w-[90%] mx-auto leading-snug">
                            {lesson.desc}
                        </div>

                        <div className="flex flex-col xl:flex-row gap-4 w-full mt-auto">
                            <button
                                onClick={() => handleVideoClick(lesson)}
                                className="kid-button flex-1 bg-white rounded-3xl py-4 flex justify-center items-center gap-3 font-black text-2xl hover:bg-red-50 transition-colors shadow-[0_6px_0_rgba(0,0,0,0.1)] border-4 border-gray-200 text-gray-800"
                            >
                                <Video size={28} className="text-red-500 fill-red-500" /> Video
                            </button>

                            <Link
                                href="/games"
                                className="kid-button flex-1 bg-gradient-to-br from-white to-blue-50 rounded-3xl py-4 flex justify-center items-center gap-3 font-black text-2xl hover:bg-blue-100 transition-colors shadow-[0_6px_0_#93c5fd] border-4 border-blue-200 text-blue-800"
                            >
                                <div className="bg-yellow-100 p-2 rounded-full border-2 border-yellow-300">
                                    <Star size={24} className="fill-yellow-500 text-yellow-600" />
                                </div>
                                Mashq
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

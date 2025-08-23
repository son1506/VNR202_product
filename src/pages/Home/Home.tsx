// Home.tsx — Vietnam 1954–1964: Dữ kiện & Tranh luận
import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const controls = useAnimation();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });



    const pageVariants = {
        initial: { opacity: 0, scale: 0.96, y: 30 },
        in: { opacity: 1, scale: 1, y: 0 },
        out: { opacity: 0, scale: 1.04, y: -30 },
    };

    const pageTransition = { type: 'tween', ease: 'anticipate', duration: 0.6 };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { delayChildren: 0.2, staggerChildren: 0.12 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 },
        },
    };

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="relative min-h-screen overflow-hidden"
        >
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                {/* Background image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('https://cdnmedia.baotintuc.vn/Upload/pTMF1jgWpbjY1m8G1xWUsg/files/2020/04/doiquantocdai/doiquantocdai-1704h3.jpg')",
                        zIndex: 0,
                        filter: 'brightness(0.55)'
                    }}
                />
                {/* Overlay gradient and effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900  opacity-80" style={{ zIndex: 1 }} />
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white rounded-full opacity-30"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            zIndex: 2
                        }}
                        animate={{ y: [0, -30, 0], opacity: [0.3, 0.9, 0.3] }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
                {/* mouse glow */}
                <motion.div
                    className="absolute w-96 h-96 rounded-full opacity-10 pointer-events-none"
                    style={{
                        background:
                            'radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)',
                        left: mousePosition.x - 192,
                        top: mousePosition.y - 192,
                        zIndex: 3
                    }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>

            {/* Content */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-white"
            >
                <motion.div variants={itemVariants} className="text-center mb-8">
                    <motion.h1
                        className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-500 bg-clip-text text-transparent"
                        whileHover={{ scale: 1.03 }}
                    >
                        Việt Nam 1954–1964
                    </motion.h1>
                    <motion.h2 className="text-2xl md:text-3xl font-semibold text-blue-200">
                        Dữ kiện & Tranh luận về nhận định “nội chiến”
                    </motion.h2>
                </motion.div>

                {/* <motion.p
                    variants={itemVariants}
                    className="text-lg md:text-xl mb-12 text-center max-w-3xl leading-relaxed text-gray-200"
                >
                    Khám phá dòng thời gian, bản đồ diễn biến, tác nhân chính và mô-đun
                    tranh luận tương tác. Tất cả tập trung vào giai đoạn 1954–1964.
                </motion.p> */}

                <motion.div variants={itemVariants} className="flex gap-6 flex-wrap">
                    <motion.button
                        onClick={() => navigate('/history')}
                        className="group relative px-7 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-lg overflow-hidden shadow-2xl"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Khám phá dòng thời gian
                        </span>
                    </motion.button>
                    <motion.button
                        onClick={() => navigate('/history#conclusion')}
                        className="group relative px-7 py-4 bg-gradient-to-r from-slate-700 to-slate-800 rounded-2xl font-bold text-lg overflow-hidden shadow-2xl border border-slate-600"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Tranh luận: Có phải nội chiến?
                        </span>
                    </motion.button>
                    <motion.button
                        onClick={() => navigate('/map')}
                        className="group relative px-7 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl font-bold text-lg overflow-hidden shadow-2xl"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                    >
                        <span className="relative z-10 flex items-center gap-2"> Bản đồ diễn biến</span>
                    </motion.button>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Home;

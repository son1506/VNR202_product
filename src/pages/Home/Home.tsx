// Home.jsx - Enhanced with beautiful animations and modern design
import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router';

const Home = () => {
    const navigate = useNavigate();
    const controls = useAnimation();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const updateMousePosition = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', updateMousePosition);
        return () => window.removeEventListener('mousemove', updateMousePosition);
    }, []);

    const pageVariants = {
        initial: {
            opacity: 0,
            scale: 0.8,
            y: 50
        },
        in: {
            opacity: 1,
            scale: 1,
            y: 0
        },
        out: {
            opacity: 0,
            scale: 1.2,
            y: -50
        }
    };

    const pageTransition = {
        type: "tween",
        ease: "anticipate",
        duration: 0.8
    };

    const containerVariants = {
        hidden: {
            opacity: 0
        },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: {
            y: 20,
            opacity: 0
        },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    const floatingAnimation = {
        y: [0, -10, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }
    };

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="home-page relative min-h-screen overflow-hidden"
        >
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
                
                {/* Floating particles */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white rounded-full opacity-30"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.3, 0.8, 0.3],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}

                {/* Mouse follower gradient */}
                <motion.div
                    className="absolute w-96 h-96 rounded-full opacity-10 pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%)',
                        left: mousePosition.x - 192,
                        top: mousePosition.y - 192,
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* Content */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-white"
            >
                <motion.div
                    variants={itemVariants}
                    animate={floatingAnimation}
                    className="text-center mb-8"
                >
                    <motion.h1 
                        className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        Diễn Biến Phủ
                    </motion.h1>
                    <motion.h2 
                        className="text-3xl md:text-4xl font-bold mb-6 text-blue-200"
                        whileHover={{ scale: 1.02 }}
                    >
                        Trên Không
                    </motion.h2>
                </motion.div>

                <motion.p 
                    variants={itemVariants}
                    className="text-xl md:text-2xl mb-12 text-center max-w-4xl leading-relaxed text-gray-200"
                >
                    12 ngày đêm không kích cuối năm 1972 đã để lại dấu ấn lịch sử không thể nào quên. 
                    Khám phá câu chuyện hùng tráng của dân tộc Việt Nam.
                </motion.p>

                <motion.div 
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-6"
                >
                    <motion.button
                        onClick={() => navigate('/history')}
                        className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-lg overflow-hidden shadow-2xl"
                        whileHover={{ 
                            scale: 1.05,
                            boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 200 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10 flex items-center gap-2">
                            🚀 Khám phá dòng thời gian
                        </span>
                    </motion.button>

                    <motion.button
                        className="group relative px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl font-bold text-lg overflow-hidden shadow-2xl border border-gray-600"
                        whileHover={{ 
                            scale: 1.05,
                            boxShadow: "0 20px 40px rgba(107, 114, 128, 0.4)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 200 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10 flex items-center gap-2">
                            ⚡ Sự kiện khác
                        </span>
                    </motion.button>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                    animate={{
                        y: [0, 10, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                        <motion.div
                            className="w-1 h-3 bg-white rounded-full mt-2"
                            animate={{
                                opacity: [1, 0, 1],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                            }}
                        />
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Home;
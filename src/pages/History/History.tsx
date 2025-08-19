import React, { useState, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import axios from '../../app/modules/axios';

const History = () => {
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeEvent, setActiveEvent] = useState(null);
    
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    const handleSubmit = async () => {
        if (!question.trim()) return;
        setLoading(true);
        try {
            const res = await axios.post('/api/analyze-history', { question });
            setResponse(res.data.answer);
        } catch (error) {
            setResponse('Đã xảy ra lỗi khi phân tích. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const timelineEvents = [
        { 
            year: 1954, 
            title: 'Hiệp định Genève',
            description: 'Hiệp định Genève được ký kết, chia đôi Việt Nam.',
            icon: '📜',
            color: 'from-red-500 to-orange-500'
        },
        { 
            year: 1959, 
            title: 'Phong trào Đồng Khởi',
            description: 'Phong trào Đồng Khởi bắt đầu ở miền Nam.',
            icon: '🔥',
            color: 'from-yellow-500 to-red-500'
        },
        { 
            year: 1963, 
            title: 'Cuộc đảo chính',
            description: 'Cuộc đảo chính lật đổ Ngô Đình Diệm.',
            icon: '⚔️',
            color: 'from-purple-500 to-pink-500'
        },
        { 
            year: 1964, 
            title: 'Can thiệp quân sự',
            description: 'Mỹ bắt đầu can thiệp quân sự vào Việt Nam.',
            icon: '✈️',
            color: 'from-blue-500 to-cyan-500'
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    };

    return (
        <motion.div
            ref={containerRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="history-page relative min-h-screen overflow-hidden"
        >
            {/* Dynamic Background */}
            <div className="fixed inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"></div>
                
                {/* Animated geometric shapes */}
                <motion.div
                    className="absolute top-20 left-20 w-32 h-32 bg-blue-500 rounded-full opacity-10"
                    animate={{
                        scale: [1, 1.5, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                <motion.div
                    className="absolute bottom-20 right-20 w-24 h-24 bg-purple-500 rounded-lg opacity-10"
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -180, -360],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </div>

            {/* Header Section */}
            <motion.div
                style={{ y, opacity }}
                className="relative z-10 pt-20 pb-10 text-center text-white"
            >
                <motion.h1 
                    className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                        type: "spring", 
                        stiffness: 200,
                        delay: 0.2 
                    }}
                >
                    Phân tích lịch sử
                </motion.h1>
                <motion.p 
                    className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto px-4"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    Giai đoạn 1954 - 1964: Khám phá những dấu mốc quan trọng trong lịch sử Việt Nam
                </motion.p>
            </motion.div>

            {/* AI Question Section */}
            <motion.div 
                className="relative z-10 max-w-2xl mx-auto px-4 mb-16"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
            >
                <motion.div 
                    className="backdrop-blur-lg bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">🤖 Hỏi AI Lịch Sử</h2>
                    
                    <div className="relative">
                        <motion.input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Nhập câu hỏi về lịch sử..."
                            className="w-full p-4 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                            whileFocus={{ scale: 1.02 }}
                        />
                        
                        <motion.button
                            onClick={handleSubmit}
                            className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={loading}
                        >
                            {loading ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                />
                            ) : '✨'}
                        </motion.button>
                    </div>
                </motion.div>

                {/* AI Response */}
                {response && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="mt-8 backdrop-blur-lg bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl"
                    >
                        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            🧠 Kết quả phân tích:
                        </h3>
                        <p className="text-lg text-gray-200 leading-relaxed">{response}</p>
                    </motion.div>
                )}
            </motion.div>

            {/* Timeline Section */}
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="relative z-10 max-w-6xl mx-auto px-4 pb-20"
            >
                <motion.h2 
                    className="text-4xl font-bold text-white text-center mb-16"
                    variants={itemVariants}
                >
                    ⏰ Dòng thời gian lịch sử
                </motion.h2>

                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>

                    {timelineEvents.map((event, index) => (
                        <TimelineEvent 
                            key={index}
                            event={event}
                            index={index}
                            isActive={activeEvent === index}
                            onHover={() => setActiveEvent(index)}
                            onLeave={() => setActiveEvent(null)}
                        />
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

// Timeline Event Component
const TimelineEvent = ({ event, index, isActive, onHover, onLeave }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const isLeft = index % 2 === 0;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className={`relative mb-16 flex ${isLeft ? 'justify-end' : 'justify-start'} items-center`}
            onHoverStart={onHover}
            onHoverEnd={onLeave}
        >
            {/* Event Card */}
            <motion.div 
                className={`w-full max-w-md ${isLeft ? 'mr-8' : 'ml-8'}`}
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                <div className={`backdrop-blur-lg bg-gradient-to-br ${event.color} p-6 rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden`}>
                    {/* Glow effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl opacity-0"
                        animate={{ opacity: isActive ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                    />
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">{event.icon}</span>
                            <h3 className="text-2xl font-bold text-white">{event.year}</h3>
                        </div>
                        <h4 className="text-xl font-semibold text-white mb-3">{event.title}</h4>
                        <p className="text-white/90 leading-relaxed">{event.description}</p>
                    </div>

                    {/* Floating particles */}
                    {isActive && (
                        <>
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 bg-white rounded-full"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                    }}
                                    animate={{
                                        y: [0, -20, 0],
                                        opacity: [0, 1, 0],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                    }}
                                />
                            ))}
                        </>
                    )}
                </div>
            </motion.div>

            {/* Timeline dot */}
            <motion.div
                className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white rounded-full border-4 border-purple-500 shadow-lg z-20"
                animate={{
                    scale: isActive ? 1.5 : 1,
                    boxShadow: isActive 
                        ? "0 0 20px rgba(147, 51, 234, 0.8)" 
                        : "0 0 0px rgba(147, 51, 234, 0)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
            />
        </motion.div>
    );
};

export default History;
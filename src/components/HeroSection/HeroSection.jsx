import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './heroSection.css';
import specialtyCoffeeImage from '../../assets/bg.jpg';

const HeroSection = () => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth) * 30 - 15;
            const y = (clientY / window.innerHeight) * 30 - 15;
            setMousePosition({ x, y });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const img = new Image();
        img.src = specialtyCoffeeImage;
        img.onload = () => setImageLoaded(true);
    }, []);

    const parallaxX = mousePosition.x * 0.3;
    const parallaxY = mousePosition.y * 0.3 + scrollY * 0.5;

    return (
        <section className="relative w-full h-screen overflow-hidden -mt-[228px] mb-1">
            {/* Overlay de carga */}
            <motion.div
                className="absolute inset-0 bg-black z-10"
                initial={{ opacity: 1 }}
                animate={{ opacity: imageLoaded ? 0 : 1 }}
                transition={{ duration: 0.8 }}
            />

            {/* Imagen de fondo con parallax mejorado */}
            <motion.div
                className="absolute inset-0"
                style={{
                    x: parallaxX,
                    y: parallaxY,
                    scale: 1 + (scrollY / 2000)
                }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
                <motion.img
                    src={specialtyCoffeeImage}
                    alt="Café de especialidad"
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{
                        scale: imageLoaded ? 1 : 1.1,
                        opacity: imageLoaded ? 1 : 0
                    }}
                    transition={{
                        duration: 1.2,
                        ease: [0.22, 1, 0.36, 1]
                    }}
                />
            </motion.div>

            {/* Overlays y efectos visuales */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />

            {/* Overlay sutil de color */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    background: 'linear-gradient(135deg, rgba(159, 159, 161, 0.3) 0%, rgba(16, 185, 129, 0.1) 100%)'
                }}
            />

            {/* Elementos decorativos flotantes */}
            <motion.div
                className="absolute top-20 right-20 w-96 h-96 rounded-full opacity-10"
                style={{
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
                    filter: 'blur(60px)'
                }}
                animate={{
                    x: [0, 40, 0],
                    y: [0, -30, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Contenido principal */}
            <motion.div
                className="relative z-20 h-full flex flex-col items-center justify-center text-white px-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: imageLoaded ? 1 : 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.8,
                        delay: 0.7,
                        ease: [0.22, 1, 0.36, 1]
                    }}
                    className="text-center max-w-4xl mx-auto"
                >
                    {/* Título principal con efecto de brillo */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mt-20 mb-6 tracking-tight">
                        <span className="relative">
                            <span className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-emerald-400/10 to-emerald-600/20 blur-xl"></span>
                            <span className="relative bg-gradient-to-r from-white via-emerald-100 to-emerald-200 bg-clip-text text-transparent">
                                Descubrí el Arte
                            </span>
                        </span>
                        <br />
                        <span className="text-5xl md:text-7xl lg:text-8xl font-extrabold mt-2 block">
                            del Café
                        </span>
                    </h1>

                    {/* Línea decorativa */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "150px" }}
                        transition={{ delay: 1, duration: 1.2 }}
                        className="h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent mx-auto mb-8"
                    />

                    {/* Descripción */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1, duration: 0.6 }}
                        className="text-lg md:text-xl mb-10 text-emerald-50/90 leading-relaxed max-w-2xl mx-auto"
                    >
                        Sumergite en una experiencia única con granos seleccionados y preparaciones artesanales que despertarán todos tus sentidos.
                    </motion.p>
                </motion.div>

                {/* Botones mejorados */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3, duration: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 items-center mt-4"
                >
                    <motion.a
                        href="#menu"
                        className="group relative px-8 py-3 rounded-full overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-800"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative flex items-center space-x-2 text-white font-semibold text-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v9a2 2 0 002 2h2v2a2 2 0 002 2h8a2 2 0 002-2v-2h2a2 2 0 002-2V4a2 2 0 00-2-2H4zm9 11v4H7v-4h6zm-6-2V4h12v7H7z" clipRule="evenodd" />
                            </svg>
                            <span>Explorá Nuestro Menú</span>
                        </span>
                    </motion.a>

                    <motion.a
                        href="#about"
                        className="group px-8 py-3 rounded-full border border-emerald-300/50 hover:border-emerald-300 hover:bg-emerald-900/20 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="text-white font-semibold text-lg flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <span>Conocé Nuestra Historia</span>
                        </span>
                    </motion.a>
                </motion.div>
            </motion.div>

            {/* Scroll indicator mejorado */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.5 }}
            >
                <div className="flex flex-col items-center">
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="flex flex-col items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
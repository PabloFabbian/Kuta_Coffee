import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './heroSection.css';
import specialtyCoffeeImage from '../../assets/specialty-coffee.webp';

const HeroSection = () => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const img = new Image();
        img.src = specialtyCoffeeImage;
        img.onload = () => setImageLoaded(true);
    }, []);

    const opacity = 1 - (scrollY / 300);
    const scale = 1 + (scrollY / 1000);

    return (
        <section className="relative w-full h-screen overflow-hidden -top-[229px]">
            <motion.div
                className="absolute inset-0 bg-black"
                initial={{ opacity: 1 }}
                animate={{ opacity: imageLoaded ? 0 : 1 }}
                transition={{ duration: 0.5 }}
            />
            <motion.img
                src={specialtyCoffeeImage}
                alt="Café de especialidad"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                    opacity: opacity > 0 ? opacity : 0,
                    transform: `scale(${scale})`
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: imageLoaded ? 1 : 0 }}
                transition={{ duration: 0.5 }}
            />
            <div className="absolute inset-0 bg-black opacity-30" />
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-6">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.75, delay: 0.5 }}
                    className="text-center"
                >
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 to-emerald-500">
                            Descubrí el Arte del Café
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                        Sumergite en una experiencia de café única, con granos seleccionados y preparaciones artesanales que despertarán todos tus sentidos.
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="flex space-x-4"
                >
                    <a
                        href="#menu"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 flex items-center space-x-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v9a2 2 0 002 2h2v2a2 2 0 002 2h8a2 2 0 002-2v-2h2a2 2 0 002-2V4a2 2 0 00-2-2H4zm9 11v4H7v-4h6zm-6-2V4h12v7H7z" clipRule="evenodd" />
                        </svg>
                        <span>Explora Nuestro Menú</span>
                    </a>
                    <a
                        href="#about"
                        className="bg-transparent hover:bg-white/10 text-white font-semibold py-3 px-6 border border-white rounded-full transition-colors duration-300"
                    >
                        Nuestra Historia
                    </a>
                </motion.div>
            </div>
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.5, repeat: Infinity, repeatType: 'reverse' }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </motion.div>
        </section>
    );
};

export default HeroSection;
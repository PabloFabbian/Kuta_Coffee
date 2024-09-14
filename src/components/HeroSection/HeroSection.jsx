import React from 'react';
import { motion } from 'framer-motion';
import './heroSection.css';
import backgroundImage from '../../assets/kuta5.jpg';

const HeroSection = () => {
    return (
        <section className="relative w-full h-screen flex items-center justify-center overflow-hidden -top-[229px]">
            <img 
                src={backgroundImage} 
                alt="Background" 
                className="absolute inset-0 w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-black opacity-50"></div> {/* Filtro oscuro para el fondo */}
            <div className="relative z-10 text-center text-white px-6 md:px-12 mt-32">
                <motion.h1
                    className="text-4xl md:text-6xl font-extrabold mb-2 bg-gradient-to-br from-[#B9DAB2] to-[#6D8B74] bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.75, delay: 0.75 }}
                >
                    Descubrí el Arte del Café
                </motion.h1>
                <motion.p
                    className="text-lg md:text-2xl mb-6 opacity-90"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.25 }}
                >
                    Sumergite en una experiencia de café única, granos seleccionados, preparaciones artesanales, vamos a despiertar todos tus sentidos.
                </motion.p>
                <motion.a
                    href="#menu"
                    className="inline-block bg-[#588157] text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-[#3A5A40] transition-colors"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.75 }}
                >
                    Explora Nuestro Menú
                </motion.a>
            </div>
        </section>
    );
};

export default HeroSection;
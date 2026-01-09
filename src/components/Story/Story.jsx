import React from 'react';
import { motion } from 'framer-motion';
import './Story.css';

const Story = () => {
    return (
        <section className="story-section" id="about">
            <div className="story-container">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="story-content"
                >
                    {/* Título con decoración */}
                    <div className="title-container">
                        <motion.h2
                            className="story-title"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <span className="title-line"></span>
                            Nuestra Historia
                            <span className="title-line"></span>
                        </motion.h2>
                        <p className="story-subtitle">
                            Más de una década sirviendo pasión en cada taza
                        </p>
                    </div>

                    {/* Contenido en dos columnas para pantallas grandes */}
                    <div className="story-grid">
                        <motion.div
                            className="story-text-container"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                        >
                            <div className="story-text">
                                <motion.p
                                    className="highlight-paragraph"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                >
                                    En <span className="brand-name">Kuta</span>, venimos sirviendo café de alta calidad y satisfaciendo
                                    las papilas gustativas de nuestros clientes desde hace más de una
                                    década. Nuestra historia comenzó en una pequeña cafetería de barrio
                                    y ha crecido hasta convertirse en un destino favorito para los
                                    amantes del café en toda la ciudad.
                                </motion.p>

                                <motion.div
                                    className="decoration-divider"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "100px" }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                />

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.7 }}
                                >
                                    Seleccionamos los granos de café más finos de cosechas sostenibles,
                                    los tostamos artesanalmente y preparamos cada bebida con dedicación
                                    y precisión. Cada taza que servimos lleva nuestra pasión
                                    por el café de especialidad y nuestro compromiso con la excelencia.
                                </motion.p>
                            </div>
                        </motion.div>

                        {/* Estadísticas o cifras destacadas */}
                        <motion.div
                            className="story-stats"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.5 }}
                        >
                            <div className="stat-item">
                                <motion.div
                                    className="stat-number"
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ type: "spring", delay: 0.8 }}
                                >
                                    10+
                                </motion.div>
                                <div className="stat-label">Años de Experiencia</div>
                            </div>
                            <div className="stat-item">
                                <motion.div
                                    className="stat-number"
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ type: "spring", delay: 1 }}
                                >
                                    5000+
                                </motion.div>
                                <div className="stat-label">Clientes Felices</div>
                            </div>
                            <div className="stat-item">
                                <motion.div
                                    className="stat-number"
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ type: "spring", delay: 1.2 }}
                                >
                                    100%
                                </motion.div>
                                <div className="stat-label">Café de Especialidad</div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Story;
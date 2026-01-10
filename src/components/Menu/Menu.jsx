import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ItemListContainer from '../ItemListContainer/ItemListContainer';
import './Menu.css';

const Menu = () => {
    const [activeCategory, setActiveCategory] = useState('all');

    const categories = [
        { id: 'all', label: 'Todo' },
        { id: 'cafeteria', label: 'Cafetería' },
        { id: 'licuados', label: 'Licuados' },
        { id: 'jugos', label: 'Jugos' },
        { id: 'delicias', label: 'Delicias' },
    ];

    return (
        <section className="menu-wrapper" id="menu">
            <div className="menu-container">
                {/* Header minimalista */}
                <motion.div
                    className="menu-header"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="menu-title">Menú Kuta</h2>
                    <p className="menu-subtitle">
                        Seleccioná tu categoría y hacé tu pedido
                    </p>
                </motion.div>

                {/* Filtros minimalistas */}
                <div className="filters-container">
                    <div className="filters-scroll">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`filter-btn ${activeCategory === category.id ? 'active' : ''}`}
                            >
                                <span className="filter-btn-text">{category.label}</span>
                            </button>
                        ))}
                        {/* Espacio adicional para mejor scroll en mobile */}
                        <div className="scroll-spacer"></div>
                    </div>
                </div>

                {/* Productos */}
                <ItemListContainer categoryFilter={activeCategory} />
            </div>
        </section>
    );
};

export default Menu;
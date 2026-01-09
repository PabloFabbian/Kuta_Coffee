import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ItemListContainer from '../ItemListContainer/ItemListContainer';
import './Menu.css';

const Menu = () => {
    const [activeCategory, setActiveCategory] = useState('all');

    const categories = [
        { id: 'all', label: 'Todo', icon: '☕' },
        { id: 'cafeteria', label: 'Cafetería', icon: '☕' },
        { id: 'licuados', label: 'Licuados', icon: '🥤' },
        { id: 'jugos', label: 'Jugos', icon: '🧃' },
        { id: 'delicias', label: 'Delicias', icon: '🍰' },
    ];

    return (
        <section className="menu-wrapper" id="menu">
            <div className="menu-container">
                {/* Header del menú */}
                <motion.div
                    className="menu-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="menu-title">Nuestro Menú</h2>
                    <p className="menu-description">
                        Explorá nuestros productos, seleccioná lo que te guste y hacé tu pedido
                        directo desde tu celular
                    </p>
                </motion.div>

                {/* Filtros */}
                <motion.div
                    className="filters-container"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="filters-scroll">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`filter-btn ${activeCategory === category.id ? 'active' : ''}`}
                            >
                                <span className="filter-icon">{category.icon}</span>
                                <span className="filter-label">{category.label}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* ItemListContainer con categoría filtrada */}
                <ItemListContainer categoryFilter={activeCategory} />
            </div>
        </section>
    );
};

export default Menu;
import React from 'react';
import { motion } from 'framer-motion';
import './Header.css';

function Header() {
    return (
        <header>
            <motion.div
                className='HeaderContainer'
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                "Explora el arte del café: un sorbo, un mundo." | Kuta, Café de Especialidad ~
            </motion.div>
        </header>
    );
}

export default Header;
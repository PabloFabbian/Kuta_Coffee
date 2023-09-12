import React from 'react'
import './Footer.css'

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-logo">
                    <img src="/Kuta.ico" alt="Logo de la Cafetería" />
                </div>
                <div className="footer-contact">
                    <h2>Contacto</h2>
                    <p>📍 Dirección: José Manuel Estrada 2591 - Olivos</p>
                    <p>🕔 Horario: Lunes a viernes 8:30 a 19 hs - Sabados 9 a 14hs</p>
                    <p>📩 Email: kuta.cafeteria@gmail.com</p>
                </div>
                <div className="footer-social">
                    <h2>Síguenos en Redes Sociales</h2>
                    <div className="social-icons">
                        <a href="/#">
                            <i className="fab fa-facebook"></i>
                        </a>
                        <a href="https://www.instagram.com/kuta_cafe/" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="/#" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-twitter"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Kuta | ☕️ Café de especialidad</p>
            </div>
        </footer>
    )
}

export default Footer
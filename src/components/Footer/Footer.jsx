import React from 'react';
import './Footer.css';

function Footer() {
    return (
        <footer className="bg-[#212529] text-[#DAD7CD] py-8 relative z-10 backdrop-blur-md">
            <div className="flex flex-col items-center">
                <div className="mb-2">
                    <img src="/Kuta.ico" alt="Logo de la Cafetería" className="w-20 h-auto" />
                </div>
                <div className="text-center mb-4">
                    <h2 className="text-[#A3B18A] text-2xl mb-2">Contacto</h2>
                    <p>📍 Dirección: José Manuel Estrada 2591 - Olivos</p>
                    <p>🕔 Horario: Lunes a viernes 8:30 a 19 hs - Sabados 9 a 14hs</p>
                    <p>📩 Email: kuta.cafeteria@gmail.com</p>
                </div>
                <div className="text-center mb-1">
                    <h2 className="text-[#A3B18A] text-2xl mb-3">Síguenos en Redes Sociales</h2>
                    <div className="flex space-x-8 justify-center mt-3">
                        <a href="/#" className="text-[#A3B18A] transition-transform transform hover:scale-125 hover:text-[#588157]">
                            <i className="fab fa-facebook fa-2x"></i>
                        </a>
                        <a href="https://www.instagram.com/kuta_cafe/" target="_blank" rel="noopener noreferrer" className="text-[#A3B18A] transition-transform transform hover:scale-125 hover:text-[#588157]">
                            <i className="fab fa-instagram fa-2x"></i>
                        </a>
                        <a href="/#" target="_blank" rel="noopener noreferrer" className="text-[#A3B18A] transition-transform transform hover:scale-125 hover:text-[#588157]">
                            <i className="fab fa-twitter fa-2x"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div className="bg-[#344E41] py-2 mt-4 brightness-90">
                <p className="text-center text-sm">&copy; {new Date().getFullYear()} Kuta | ☕️ Café de especialidad</p>
            </div>
        </footer>
    );
}

export default Footer;
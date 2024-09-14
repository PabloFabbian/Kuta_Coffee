import React from 'react';
import './MoreDetails.css';

const MoreDetails = () => {
    return (
        <div className="flex justify-center items-center bg-[#FEFAF0] mt-12">
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                {/* Sección de la Imagen */}
                <div className="relative">
                    <img 
                        src="/maquina.jpg" 
                        alt="Máquina de café" 
                        className="w-full h-full object-cover rounded-lg shadow-lg"
                    />
                    {/* Título superpuesto */}
                    <h2 className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/6 text-white text-6xl font-bold px-5 py-2">
                        Programa de Lealtad y Ofertas
                    </h2>
                </div>

                {/* Sección de Contenido con Bento Grid */}
                <div className="p-6 bento-grid">
                    <div className="offering-card bg-[#588157] text-white p-6 rounded-lg transition-transform duration-300 hover:bg-[#3A5A40] hover:scale-105">
                        <h3 className="text-xl font-semibold">Oferta Especial</h3>
                        <p>¡Únete a nuestro programa de lealtad y obtén descuentos exclusivos en tu café favorito!</p>
                    </div>
                    <div className="offering-card bg-[#588157] text-white p-6 rounded-lg transition-transform duration-300 hover:bg-[#3A5A40] hover:scale-105">
                        <h3 className="text-xl font-semibold">Oferta del Día</h3>
                        <p>¡No te pierdas nuestra oferta del día en deliciosos pasteles y bocadillos!</p>
                    </div>
                    <div className="sustainability-container bg-[#588157] text-white p-6 rounded-lg transition-transform duration-300 hover:bg-[#3A5A40] hover:scale-105">
                        <h3 className="text-xl font-semibold text-[#A3B18A]">Información sobre Sostenibilidad</h3>
                        <p>Nos preocupamos por el medio ambiente y utilizamos granos de café de comercio justo. Descubre más sobre nuestras iniciativas sostenibles.</p>
                    </div>
                    <div className="private-events-container bg-[#588157] text-white p-6 rounded-lg transition-transform duration-300 hover:bg-[#3A5A40] hover:scale-105">
                        <h3 className="text-xl font-semibold text-[#A3B18A]">Reservas para Eventos Privados</h3>
                        <p>¿Planeas un evento especial? ¡Reserva nuestro espacio para eventos privados y haz que sea inolvidable!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MoreDetails;
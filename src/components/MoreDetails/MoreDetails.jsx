import React from 'react';

const OfferingCard = ({ title, description, className }) => (
    <div className={`bg-[#3A5A40] text-white p-6 rounded-lg transition-all duration-300 hover:bg-[#344E41] hover:shadow-xl ${className}`}>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-[#DAD7CD]">{description}</p>
    </div>
);

const MoreDetails = () => {
    return (
        <div className="bg-[#588157] py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    {/* Sección de la Imagen */}
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                        <img
                            src="/maquina.jpg"
                            alt="Máquina de café"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
                            <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold text-left px-4 drop-shadow-lg">
                                Programa de Lealtad y Ofertas
                            </h2>
                        </div>
                    </div>

                    {/* Sección de Contenido con Bento Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <OfferingCard
                            title="Oferta Especial"
                            description="¡Únete a nuestro programa de lealtad y obtén descuentos exclusivos en tu café favorito!"
                            className="sm:col-span-2"
                        />
                        <OfferingCard
                            title="Oferta del Día"
                            description="¡No te pierdas nuestra oferta del día en deliciosos pasteles y bocadillos!"
                        />
                        <OfferingCard
                            title="Sostenibilidad"
                            description="Descubre nuestras iniciativas de café de comercio justo y prácticas sostenibles."
                        />
                        <OfferingCard
                            title="Eventos Privados"
                            description="Reserva nuestro espacio para eventos privados y haz que sea inolvidable."
                            className="sm:col-span-2"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MoreDetails;
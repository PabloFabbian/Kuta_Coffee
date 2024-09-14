import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase/firebaseConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Carousel from 'react-bootstrap/Carousel';

// Íconos
const CoffeeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
        <line x1="6" y1="1" x2="6" y2="4"></line>
        <line x1="10" y1="1" x2="10" y2="4"></line>
        <line x1="14" y1="1" x2="14" y2="4"></line>
    </svg>
);
const LeafIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"></path>
        <path d="M12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"></path>
        <path d="M12 8v2"></path>
        <path d="M12 14v2"></path>
        <path d="M16 12h-2"></path>
        <path d="M10 12H8"></path>
    </svg>
);
const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
);
const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
);
const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
);

const AboutUs = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    const ToastError = () => {
        toast.error('🦄 Error al obtener el documento "local":', {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    };

    const ToastError2 = () => {
        toast.error('🦄 El documento "local" no existe en la colección "cafeteria"', {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    };

    useEffect(() => {
        const docRef = doc(db, 'cafeteria', 'local');

        getDoc(docRef)
            .then((docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    const imageUrls = [data.capuccino, data.dentro, data.fuera, data.servicio];
                    setImages(imageUrls);
                } else {
                    ToastError2();
                }
            })
            .catch((error) => {
                ToastError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const teamMembers = [
        {
            name: "Carmen Romero",
            position: "Barista Principal",
            description: "Con una habilidad excepcional para preparar bebidas exquisitas, eleva cada taza de café a una experiencia memorable.",
            image: "./CarmenRomero.png"
        },
        {
            name: "Joshua Palmer",
            position: "Gerente de Café",
            description: "Se asegura de que cada taza de café cumpla con los más altos estándares de calidad.",
            image: "./JoshuaPalmer.png"
        },
        {
            name: "Nelson Rose",
            position: "Asistente de Gerente",
            description: "Con una habilidad excepcional para preparar bebidas exquisitas, él eleva cada taza de café a una experiencia memorable.",
            image: "./NelsonRose.png"
        }
    ];

    const values = [
        { icon: <CoffeeIcon />, text: "Calidad: Seleccionamos los granos de café más finos y los preparamos con dedicación." },
        { icon: <LeafIcon />, text: "Sostenibilidad: Nos preocupamos por el medio ambiente y apoyamos a los agricultores locales." },
        { icon: <HeartIcon />, text: "Pasión: Amamos el café y nos esforzamos por brindar la mejor experiencia a nuestros clientes." }
    ];

    return (
        <div className="px-10 py-8 bg-[#588157] text-white text-center">
            <div className="relative w-[94vw] h-[40vh] overflow-hidden mx-auto mb-8 rounded-2xl">
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="-mb-12 text-center">
                        <h1 className="text-6xl font-bold mb-2 text-white drop-shadow-lg">¿Quiénes Somos?</h1>
                        <p className="text-2xl mb-8 text-slate-250 drop-shadow-lg">Descubrí nuestra historia y pasión por el café de especialidad.</p>
                    </div>
                </div>

                <div className="w-full h-full">
                    {loading ? (
                        <p className="text-center">Cargando imágenes...</p>
                    ) : (
                        <Carousel fade interval={5000} indicators={false} pause={false}>
                            {images.map((imageUrl, index) => (
                                <Carousel.Item key={index}>
                                    <img
                                        src={imageUrl}
                                        alt={`Imagen ${index}`}
                                        className="w-full h-full object-cover"
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8 text-white">
                <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4">Nuestra Historia</h2>
                    <p className="text-base leading-relaxed">
                        En Kuta, venimos sirviendo café de alta calidad y satisfaciendo las papilas gustativas de nuestros clientes desde hace más de una década. Nuestra historia comenzó en una pequeña cafetería de barrio y ha crecido hasta convertirse en un destino favorito para los amantes del café en toda la ciudad.
                    </p>
                </div>
                <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4">Nuestros Valores</h2>
                    <ul className="space-y-4 text-center">
                        {values.map((value, index) => (
                            <motion.li
                                key={index}
                                className="flex items-center justify-center space-x-2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                            >
                                <span className="text-xl">{value.icon}</span>
                                <span>{value.text}</span>
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-center">
                {teamMembers.map((member, index) => (
                    <div key={index} className="bg-white bg-opacity-10 p-6 rounded-lg flex flex-col items-center">
                        <img
                            src={member.image}
                            alt={member.name}
                            className="w-24 h-24 rounded-full mb-4 object-cover"
                        />
                        <h3 className="text-xl font-semibold">{member.name}</h3>
                        <p className="text-base text-slate-300 mb-3">{member.position}</p>
                        <p>{member.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AboutUs;
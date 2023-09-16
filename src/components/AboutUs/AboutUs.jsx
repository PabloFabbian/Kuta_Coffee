import React, { useEffect, useState } from 'react'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../../services/firebase/firebaseConfig'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AboutUs.css'

import Carousel from 'react-bootstrap/Carousel';

const AboutUs = () => {
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(true)

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
            })
    }

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
            })
    }

    useEffect(() => {
        const docRef = doc(db, 'cafeteria', 'local')

        getDoc(docRef)
            .then((docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data()
                    const imageUrls = [data.capuccino , data.dentro, data.fuera, data.servicio]
                    setImages(imageUrls)
                    setLoading(false)
                } else {
                    ToastError2()
                    setLoading(false)
                }
            })
            .catch((error) => {
                ToastError(error)
                setLoading(false)
            })
    }, [])

    return (
        <div className="about-us" id='about-us'>
            <header className="about-us-header">
                <h1>¿Quiénes Somos?</h1>
                <p>Descubre nuestra historia y pasión por el café de especialidad.</p>
            </header>
            <section className="about-us-content">
                <div className="about-us-text">
                    <h2>Nuestra Historia</h2>
                    <p>
                        En Tu Cafetería de Especialidad, hemos estado sirviendo café de alta calidad y satisfaciendo las papilas gustativas de nuestros clientes durante más de una década.
                        Nuestra historia comenzó en una pequeña cafetería de barrio y ha crecido hasta convertirse en un destino favorito para los amantes del café en toda la ciudad.
                    </p>
                </div>
                <div className="about-us-image">
                    {loading
                        ? (<p>Cargando imágenes...</p>)
                        : (<Carousel fade interval={5000} indicators={false} pause={false}>
                            {images.map((imageUrl, index) => (
                                <Carousel.Item key={index}>
                                    <img
                                        src={imageUrl}
                                        alt={`Imagen ${index}`}
                                        style={{ width: '100%', height: 'auto' }}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    )}
                </div>
            </section>
            <section className="about-us-values">
                <h2>Nuestros Valores</h2>
                <ul>
                    <li>Calidad: Seleccionamos los granos de café más finos y los preparamos con dedicación.</li>
                    <li>Sostenibilidad: Nos preocupamos por el medio ambiente y apoyamos a los agricultores locales.</li>
                    <li>Pasión: Amamos el café y nos esforzamos por brindar la mejor experiencia a nuestros clientes.</li>
                </ul>
            </section>
            <section className="about-us-team">
                <h2>Nuestro Equipo</h2>
                <p>Nuestro equipo está formado por apasionados expertos en café que están aquí para brindarte una experiencia excepcional en cada taza.</p>
                {/* Imágenes y nombres del Staff */}
            </section>
        </div>
    );
}

export default AboutUs;
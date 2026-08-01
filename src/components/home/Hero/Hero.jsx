import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { LOCALES } from '../../../data/locales';
import poster from '../../../assets/bg.jpg';
import './Hero.css';

/**
 * La tesis de la home: Kuta es un café que se lleva puesto y existe en tres
 * puntos concretos. Por eso el hero no vende "experiencia sensorial": dice
 * dónde estamos y hasta qué hora, como un cartel de andén.
 */
const Hero = () => {
  const video = useRef(null);

  // Si el sistema pide menos movimiento, se congela en el poster. El atributo
  // autoPlay no respeta esa preferencia por sí solo.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches && video.current) video.current.pause();
  }, []);

  return (
    <section className="hero">
      <video
        ref={video}
        className="hero__bg"
        src={`${process.env.PUBLIC_URL}/bg-video.mp4`}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
      />
      <div className="hero__veil" aria-hidden="true" />

      <div className="hero__inner k-shell">
        <p className="k-label hero__eyebrow">Café de especialidad · Zona Norte y CABA</p>

        <h1 className="k-signal hero__title">
          Café para
          <br />
          llevar puesto
        </h1>

        <p className="hero__lead">
          Tostado de especialidad, servido rápido y bien. Pasás, pedís y seguís.
        </p>

        <div className="hero__cta">
          <Link to="/menu" className="k-btn">
            Ver el menú
          </Link>
          <Link to="/locales" className="k-btn k-btn--ghost hero__cta-ghost">
            Cómo llegar
          </Link>
        </div>
      </div>

      {/* Tablero de paradas: el elemento firma del sitio. */}
      <div className="hero__board">
        <ul className="hero__stops k-shell">
          {LOCALES.map((l) => (
            <li key={l.id} className="hero__stop">
              <span className="hero__node" aria-hidden="true" />
              <Link to="/locales" className="hero__stop-link">
                <span className="hero__stop-name">{l.nombre}</span>
                <span className="k-data hero__stop-meta">{l.calle}</span>
                <span className="k-data hero__stop-meta">{l.horarios[0].horas}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Hero;
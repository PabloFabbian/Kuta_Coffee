import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getMenu } from '../../services/firestore';
import { SITE, precio } from '../../data/site';
import './MenuPage.css';

/**
 * La carta, sólo lectura.
 *
 * No hay carrito, ni contador, ni stock: el café se pide en el mostrador.
 * Este componente NO importa CartContext, y esa es la regla que mantiene
 * separados los dos mundos del sitio (menú informativo vs. merch vendible).
 *
 * Una sola lectura a Firestore trae la carta entera; filtrar por categoría
 * es local. Con ~40 ítems, pedir por categoría sería una lectura por click.
 */
const MenuPage = () => {
  const { categoriaId } = useParams();
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const seccionesRef = useRef({});

  useEffect(() => {
    let vivo = true;
    getMenu()
      .then((data) => vivo && setItems(data))
      .catch(() => {
        if (!vivo) return;
        setError(true);
        toast.error('No pudimos cargar la carta. Probá recargar la página.');
      })
      .finally(() => vivo && setCargando(false));
    return () => {
      vivo = false;
    };
  }, []);

  // Sólo mostramos categorías que efectivamente tienen ítems cargados.
  const categorias = useMemo(
    () => SITE.categoriasMenu.filter((c) => items.some((i) => i.categoria === c.id)),
    [items]
  );

  useEffect(() => {
    if (!categoriaId || cargando) return;
    seccionesRef.current[categoriaId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [categoriaId, cargando]);

  const irA = (id) =>
    seccionesRef.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <main className="menu">
      <header className="menu__head k-shell">
        <p className="k-label">La carta</p>
        <h1 className="k-signal menu__title">Menú</h1>
        <p className="menu__nota">
          Los precios se actualizan seguido. Se pide y se paga en el local.
        </p>
      </header>

      {!cargando && !error && categorias.length > 0 && (
        <nav className="menu__tabs" aria-label="Categorías del menú">
          <div className="menu__tabs-scroll k-shell">
            {categorias.map((c) => (
              <button key={c.id} className="menu__tab" onClick={() => irA(c.id)}>
                {c.label}
              </button>
            ))}
          </div>
        </nav>
      )}

      <div className="k-shell">
        {cargando && <p className="menu__estado k-data">Cargando la carta…</p>}

        {error && !cargando && (
          <p className="menu__estado k-data">
            La carta no está disponible en este momento.
          </p>
        )}

        {!cargando && !error && items.length === 0 && (
          <p className="menu__estado k-data">Todavía no hay productos cargados.</p>
        )}

        {categorias.map((c) => {
          const deCategoria = items.filter((i) => i.categoria === c.id);
          return (
            <section
              key={c.id}
              id={c.id}
              className="menu__seccion"
              ref={(el) => (seccionesRef.current[c.id] = el)}
            >
              <h2 className="k-signal menu__seccion-title">{c.label}</h2>

              <ul className="menu__lista">
                {deCategoria.map((item) => (
                  <li key={item.id} className="menu__row">
                    {item.imagen && (
                      <img
                        className="menu__thumb"
                        src={item.imagen}
                        alt=""
                        loading="lazy"
                        aria-hidden="true"
                      />
                    )}
                    <div className="menu__row-body">
                      <h3 className="menu__row-name">{item.nombre}</h3>
                      {item.descripcion && (
                        <p className="menu__row-desc">{item.descripcion}</p>
                      )}
                    </div>
                    <span className="k-data menu__row-price">{precio(item.precio)}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
};

export default MenuPage;

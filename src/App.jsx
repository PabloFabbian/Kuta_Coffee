import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CartProvider } from './context/CartContext';
import NavBar from './components/layout/NavBar/NavBar';
import Footer from './components/layout/Footer/Footer';
import Hero from './components/home/Hero/Hero';
import Manifiesto from './components/home/Manifiesto/Manifiesto';
import MenuPage from './components/menu/MenuPage';
import MerchPage from './components/merch/MerchPage/MerchPage';
import MerchDetail from './components/merch/MerchDetail/MerchDetail';
import Cart from './components/merch/Cart/Cart';
import CartDrawer from './components/merch/CartDrawer/CartDrawer';
import Checkout from './components/merch/Checkout/Checkout';
import Locales from './components/locales/Locales';
import Mayorista from './components/mayorista/Mayorista';
import Eventos from './components/eventos/Eventos';
import Reconocimiento from './components/home/Reconocimiento/Reconocimiento';

/** Cada navegación arranca arriba. Sin esto se hereda el scroll de la ruta previa. */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Home = () => (
  <>
    <Hero />
    <Reconocimiento />
    <Manifiesto />
    <Locales compacto />
  </>
);

const NotFound = () => (
  <main className="k-shell k-section" style={{ textAlign: 'center' }}>
    <p className="k-label">Error 404</p>
    <h1 className="k-signal" style={{ fontSize: 'clamp(3rem, 12vw, 7rem)', margin: '1rem 0' }}>
      Esta página no existe
    </h1>
    <p style={{ marginBottom: '2rem', color: 'var(--humo)' }}>
      El link puede estar viejo o mal escrito.
    </p>
    <Link to="/" className="k-btn">
      Volver al inicio
    </Link>
  </main>
);

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ScrollToTop />
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/menu/:categoriaId" element={<MenuPage />} />
          <Route path="/merch" element={<MerchPage />} />
          <Route path="/merch/:id" element={<MerchDetail />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/locales" element={<Locales />} />
          <Route path="/mayorista" element={<Mayorista />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CartDrawer />
        <Footer />
        <ToastContainer position="bottom-center" autoClose={2500} theme="dark" />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;

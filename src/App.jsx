import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import NavBar from "./components/NavBar/NavBar";
import Header from "./components/Header/Header";
import HeroSection from './components/HeroSection/HeroSection';
import Story from './components/Story/Story';
import Menu from './components/Menu/Menu';
import ItemListContainer from './components/ItemListContainer/ItemListContainer';
import ItemDetailContainer from './components/ItemDetailContainer/ItemDetailContainer';
import { CartProvider } from './context/CartContext';
import Footer from './components/Footer/Footer';
import AboutUs from './components/AboutUs/AboutUs';
import Cart from './components/Cart/Cart';
import Checkout from './components/Checkout/Checkout';
import MoreDetails from './components/MoreDetails/MoreDetails';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <CartProvider>
          <NavBar />
          <HeaderConditional />
          <Routes>
            {/* Home con nuevo flujo QR */}
            <Route path='/' element={
              <>
                <HeroSection />
                <Story />
                <Menu />
              </>
            } />

            {/* Rutas de categorías - ahora manejan filtros via URL */}
            <Route path='/category/:categoryId' element={
              <ItemListContainer />
            } />

            {/* Otras rutas */}
            <Route path='/about-us' element={<AboutUs />} />
            <Route path='/item/:itemId' element={<ItemDetailContainer />} />
            <Route path='/more-details' element={<MoreDetails />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/cart-container' element={<Cart />} />
            <Route path='/checkout' element={<Checkout />} />
            <Route path='*' element={<h1>404 NOT FOUND</h1>} />
          </Routes>
          <Footer />
        </CartProvider>
      </BrowserRouter>
    </div>
  );
}

// Componente que renderiza Header solo en rutas específicas
function HeaderConditional() {
  const location = useLocation();
  const showHeader = location.pathname === '/' || location.pathname.startsWith('/category/');

  return showHeader ? <Header /> : null;
}

export default App;
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import NavBar from "./components/NavBar/NavBar";
import Header from "./components/Header/Header";
import HeroSection from './components/HeroSection/HeroSection';
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
            <Route path='/' element={
              <>
                <HeroSection />
                <ItemListContainer style={{ padding: '2rem 0' }} />
              </>
            } />
            <Route path='/about-us' element={<AboutUs />} />
            <Route path='/cart-container' element={<Cart />} />
            <Route path='/category/:categoryId' element={<ItemListContainer />} />
            <Route path='/item/:itemId' element={<ItemDetailContainer />} />
            <Route path='/more-details' element={<MoreDetails />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/checkout' element={<Checkout />} />
            <Route path='*' element={<h1>404 NOT FOUND</h1>} />
          </Routes>
          <Footer />
        </CartProvider>
      </BrowserRouter>
    </div>
  );
}

// Componente que usa el hook useLocation para renderizar Header basado en la ruta
function HeaderConditional() {
  const location = useLocation();
  const showHeader = location.pathname === '/' || location.pathname.startsWith('/category/');
  
  return showHeader ? <Header /> : null;
}

export default App;
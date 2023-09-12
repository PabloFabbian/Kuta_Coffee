import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from "./components/NavBar/NavBar";
import Header from "./components/Header/Header";
import ItemListContainer from './components/ItemListContainer/ItemListContainer';
import ItemDetailContainer from './components/ItemDetailContainer/ItemDetailContainer';
import { CartProvider } from './context/CartContext';
import Footer from './components/Footer/Footer';
import AboutUs from './components/AboutUs/AboutUs';
import Cart from './components/Cart/Cart'
import Checkout from './components/Checkout/Checkout';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <CartProvider>
          <NavBar />
          <Header greeting={'Explora el arte del café: un sorbo, un mundo. | Kuta, Café de Especialidad'}/>
          <Routes>
            <Route path='/' element={<ItemListContainer />}/>
            <Route path='/about-us' element={<AboutUs />}/>
            <Route path='/cart-container' element={<Cart />}/>
            <Route path='/category/:categoryId' element={<ItemListContainer />} />
            <Route path='/item/:itemId' element={<ItemDetailContainer />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/checkout' element={<Checkout />} />
            <Route path='*' element={<h1>404 NOT FOUND</h1>} />
          </Routes>
        </CartProvider>
      </BrowserRouter>
      <Footer />
    </div>
  )
}

export default App;
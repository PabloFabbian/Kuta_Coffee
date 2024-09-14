import './Cart.css';
import { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import CartItem from '../CartItem/CartItem';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cart, clearCart, totalQuantity } = useContext(CartContext);

    const total = cart.reduce((acc, product) => {
        return acc + product.price * product.quantity;
    }, 0);

    if (totalQuantity === 0) {
        return (
            <div className="bg-gradient-to-tr from-[#3A5A40] to-slate-900 flex flex-col items-center justify-center min-h-[50vh] bg-[#4a7c4a] p-6 pt-32 shadow-xl -mt-28">
                <h1 className="text-4xl font-extrabold text-white mb-6 text-center">
                    No hay Items en el Carrito
                </h1>
                <p className="text-lg text-white mb-6 text-center">
                    ¡Parece que tu carrito está vacío! Encuentra nuestros productos más deliciosos y regresa con algo especial.
                </p>
                <Link 
                    to="/" 
                    className="bg-[#F4A261] text-[#2F4F4F] py-3 px-6 rounded-lg shadow-lg hover:bg-[#E08D6D] transition-colors duration-300 text-xl font-semibold"
                >
                    Explorar Productos
                </Link>
            </div>
        );
    }

    return (
        <div className='cart-container'>
        {cart.map(p => <CartItem key={p.id} {...p} />)}
            <div className='cart-content'>
                <h3>Total: ${total.toFixed(2)}</h3>
                <button onClick={() => clearCart()} className='Button'>Limpiar Carrito</button>
                <Link to='/checkout' className='Button'>Checkout</Link>
            </div>
        </div>
    );
}

export default Cart;
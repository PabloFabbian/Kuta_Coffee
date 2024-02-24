import './CheckoutForm.css'
import { useState } from 'react'

const CheckoutForm = ({ onConfirm }) => {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')

    const handleConfirm = (event) => {
        event.preventDefault()

        const userData = {
            name, phone, email
        };

        onConfirm(userData);
    };

    return (
        <div className='Container'>
            <form onSubmit={handleConfirm} className='Form'>
                <div className='mb-3'>
                    <label htmlFor='name' className='Label'>
                        Nombre
                        <input
                            required
                            id='name'
                            className='Input form-control'
                            type='text'
                            value={name}
                            onChange={({ target }) => setName(target.value)}
                        />
                    </label>
                </div>
                <div className='mb-3'>
                    <label htmlFor='phone' className='Label'>
                        Telefono
                        <input
                            required
                            id='phone'
                            className='Input form-control'
                            type='text'
                            value={phone}
                            onChange={({ target }) => setPhone(target.value)}
                        />
                    </label>
                </div>
                <div className='mb-3'>
                    <label htmlFor='email' className='Label'>
                        Email
                        <input
                            required
                            id='email'
                            className='Input form-control'
                            type='text'
                            value={email}
                            onChange={({ target }) => setEmail(target.value)}
                        />
                    </label>
                </div>
                <div className='Label mb-3'>
                    <button type='submit' className='Button btn btn-primary'>Crear Orden</button>
                </div>
            </form>
        </div>
    );
};

export default CheckoutForm;
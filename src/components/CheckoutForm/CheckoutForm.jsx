import './CheckoutForm.css';
import { useState } from 'react';

const CheckoutForm = ({ onConfirm }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const handleConfirm = (event) => {
        event.preventDefault();

        const userData = { name, phone, email };

        onConfirm(userData);
    };

    const handlePhoneChange = (event) => {
        // Eliminar caracteres no numéricos
        let value = event.target.value.replace(/\D/g, "");

        // Formatear el número según el formato "11 6852-9993"
        if (value.length <= 2) {
            value = value.replace(/(\d{2})/, "$1");
        } else if (value.length <= 6) {
            value = value.replace(/(\d{2})(\d{4})/, "$1 $2");
        } else {
            value = value.replace(/(\d{2})(\d{4})(\d{4})/, "$1 $2-$3");
        }

        setPhone(value);
    };

    return (
        <div className='form-container'>
            <form onSubmit={handleConfirm} className='form'>
                <h2 className="form-title">¡Casi Listo para tu Café!</h2>
                <div className='input-group'>
                    <label htmlFor='name' className='label'>
                        Nombre
                        <input
                            required
                            id='name'
                            className='input'
                            type='text'
                            value={name}
                            onChange={({ target }) => setName(target.value)}
                        />
                    </label>
                </div>
                <div className='input-group'>
                    <label htmlFor='phone' className='label'>
                        Teléfono
                        <input
                            required
                            id='phone'
                            className='input'
                            type='text'
                            value={phone}
                            onChange={handlePhoneChange} // Usar el manejador con el formato
                            maxLength="15" // Limitar la longitud del campo a 15 caracteres
                        />
                    </label>
                </div>
                <div className='input-group'>
                    <label htmlFor='email' className='label'>
                        Email
                        <input
                            required
                            id='email'
                            className='input'
                            type='email'
                            value={email}
                            onChange={({ target }) => setEmail(target.value)}
                        />
                    </label>
                </div>
                <div className='submit-btn'>
                    <button type='submit' className='btn-submit'>Crear Orden</button>
                </div>
            </form>
        </div>
    );
};

export default CheckoutForm;
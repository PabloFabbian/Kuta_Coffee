const products = [
    {
        id: '1',
        name: 'Doppio',
        price: 1000,
        category: 'celular',
        img: '../Doppio.png',
        stock: 25,
        description: 'Descripción de Doppio'
    },
    {id: '2', name: 'Macchiato', price: 800, category: 'celular', img: '../Macchiato.png', stock: 15, description: 'Descripción de Macchiato'},
    {id: '3', name: 'Cappuccino', price: 1260, category: 'tablet', img: '../Cappuccino.jpeg', stock: 8, description: 'Descripción de Cappuccino'},
    {id: '3', name: 'Flat White', price: 1350, category: 'tablet', img: '../Flat White.jpeg', stock: 8, description: 'Descripción de Flat White'}
]

export const getProducts = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve (products)
        }, 500)
    })
}   
const products = [
    {id: '1', name: 'Espresso', price: 932.40, category: 'cafeteria', img: '../Espresso.jpeg', stock: 23, description: '"Poder concentrado, destilado en una gota intensa."'},
    {id: '2', name: 'Doppio', price: 1170.60, category: 'cafeteria', img: '../Doppio.png', stock: 15, description: '"Doble esencia de espresso, puro y potente."'},
    {id: '3', name: 'Americano', price: 1094.40, category: 'cafeteria', img: '../Americano.jpeg', stock: 8, description: '"Espresso liberado en un torrente de agua."'},
    {id: '4', name: 'Macchiato', price: 1168.40, category: 'cafeteria', img: '../Macchiato.png', stock: 14, description: '"Toque de espresso coronado con sutileza de leche."'},
    {id: '5', name: 'Magic', price: 1372.80, category: 'cafeteria', img: '../Magic.jpeg', stock: 19, description: '"Espresso doble encantado con leche cremosa."'},
    {id: '6', name: 'Flat White', price: 1410.80, category: 'cafeteria', img: '../Flat White.jpeg', stock: 18, description: '"Espresso suave abrazado por leche aterciopelada."'},
    {id: '7', name: 'Cappuccino', price: 1170, category: 'cafeteria', img: '../Cappuccino.jpeg', stock: 9, description: '"Armonía de espresso, leche y espuma en capas."'},
    {id: '8', name: 'Latte', price: 1344.80, category: 'cafeteria', img: '../Latte.jpeg', stock: 12, description: '"Elegante baile de espresso y leche sedosa."'},
    {id: '9', name: 'Iced Coffee', price: 1094.40, category: 'cafeteria', img: '../Iced Coffee.jpeg', stock: 20, description: '"Café frío que despierta con un abrazo helado."'},
    {id: '10', name: 'Coffee Tonic', price: 1170, category: 'cafeteria', img: '../Coffee Tonic.png', stock: 17, description: '"Efervescente danza de café y tónica refrescante."'},
    {id: '11', name: 'Affogato', price: 845, category: 'cafeteria', img: '../Affogato.jpeg', stock: 2, description: '"Gelato abrazado por un espresso indulgente."'},

    {id: '12', name: 'Licuado de Banana', price: 468, category: 'licuados', img: '../Banana.jpeg', stock: 12, description: '"Banana batida, energía en un vaso cremoso."'},
    {id: '14', name: 'Licuado de Frutilla', price: 507, category: 'licuados', img: '../Frutilla.jpeg', stock: 15, description: '"Dulzura fresca de frutillas, un deleite rosado."'},
    {id: '13', name: 'Licuado de Frutos', price: 585, category: 'licuados', img: '../Frutas de Estación.jpeg', stock: 13, description: '"La pasión de los frutos rojos en un sorbo suave."'},

    {id: '15', name: 'Exprimido de Naranja', price: 312, category: 'jugos', img: '../Naranja.jpeg', stock: 17, description: '"La naranja despierta en cada gota vibrante."'},
    {id: '16', name: 'Limonada de Menta', price: 468, category: 'jugos', img: '../Limonada.jpeg', stock: 13, description: '"Frescor cítrico con toques de menta y jengibre."'},

    {id: '17', name: 'Croissant', price: 546, category: 'delicias', img: '../Croissants.jpeg', stock: 19, description: '"Crujiente y suave, un clásico deleite francés."'},
    {id: '18', name: 'Pain au Chocolat', price: 663, category: 'delicias', img: '../Pain Au Chocolat.png', stock: 20, description: '"Elegante masa con un corazón de chocolate fundido."'},
    {id: '19', name: 'Carrot Cake', price: 780, category: 'delicias', img: '../Carrot Cake.jpeg', stock: 21, description: '"Sabores de especias y zanahoria en un bocado reconfortante."'},
    {id: '20', name: 'Budin de Banana', price: 702, category: 'delicias', img: '../Budin de Banana.jpeg', stock: 7, description: '"Bananas maduras en un tierno abrazo horneado."'},
    {id: '21', name: 'Roll de Canela', price: 468, category: 'delicias', img: '../Roll de Canela.jpeg', stock: 28, description: '"Esencia de canela en un remolino de placer."'},
    {id: '22', name: 'Alfajor de Nuez DDL', price: 390, category: 'delicias', img: '../Nuez.jpeg', stock: 25, description: '"Dulce abrazo de nuez y dulce de leche."'},
    {id: '23', name: 'Scon de Queso x2', price: 585, category: 'delicias', img: '../Chipa.jpeg', stock: 13, description: '"Esponjoso scon con queso, un abrazo cálido."'}
]

export const getProducts = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve (products)
        }, 500)
    })
}

export const getProductById = (productId) => {
    return new Promise ((resolve) => {
        setTimeout(() => {
            resolve(products.find(prod => prod.id === productId))
        }, 500)
    })
}

export const getProductsByCategory = (category) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(products.filter(prod => prod.category === category))
        }, 500)
    })
}
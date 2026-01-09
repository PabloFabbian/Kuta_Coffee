import ItemList from '../ItemList/ItemList'
import './ItemListContainer.css'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getDocs, collection, query, where } from 'firebase/firestore'
import { db } from '../../services/firebase/firebaseConfig'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ItemListContainer = ({ greeting, categoryFilter }) => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    const { categoryId } = useParams()

    const ToastError = () => {
        toast.error('🦄 ¡Ocurrió un error inesperado!', {
            position: 'bottom-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark',
        })
    }

    useEffect(() => {
        setLoading(true)

        // Prioridad: categoryId de URL > categoryFilter de prop
        const effectiveCategory = categoryId || categoryFilter

        console.log('🔍 Categoría efectiva:', effectiveCategory); // DEBUG

        const collectionRef = effectiveCategory && effectiveCategory !== 'all'
            ? query(collection(db, 'products'), where('category', '==', effectiveCategory))
            : collection(db, 'products')

        getDocs(collectionRef)
            .then(response => {
                const productsAdapted = response.docs.map(doc => {
                    const data = doc.data()
                    return { id: doc.id, ...data }
                })
                console.log('📦 Productos obtenidos:', productsAdapted.length); // DEBUG
                setProducts(productsAdapted)
            })
            .catch(ToastError)
            .finally(() => {
                setLoading(false)
            })
    }, [categoryId, categoryFilter])

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="text-center text-white">
                    <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-t-4 border-white rounded-full mb-4" role="status">
                        <span className="sr-only">Cargando...</span>
                    </div>
                    <p className="text-lg mt-4">Cargando productos...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="item-list-wrapper">
            {greeting && (
                <>
                    <h1 className="menu-greeting-title">{greeting}</h1>
                    <p className="menu-greeting-text">
                        Bienvenido a nuestra carta virtual. Aquí puedes explorar todos nuestros productos,
                        ver sus detalles, seleccionar la cantidad que deseas para tu mesa, y realizar tu
                        pedido directamente desde tu dispositivo.
                    </p>
                </>
            )}

            <ItemList products={products} />
        </div>
    )
}

export default ItemListContainer
import ItemList from '../ItemList/ItemList'
import './ItemListContainer.css'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getDocs, collection, query, where } from 'firebase/firestore'
import { db } from '../../services/firebase/firebaseConfig'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ItemListContainer = ({ greeting }) => {
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

        const collectionRef = categoryId
            ? query(collection(db, 'products'), where('category', '==', categoryId))
            : collection(db, 'products')

        getDocs(collectionRef)
            .then(response => {
                const productsAdapted = response.docs.map(doc => {
                    const data = doc.data()
                    return { id: doc.id, ...data }
                })
                setProducts(productsAdapted)
            })
            .catch(ToastError)
            .finally(() => {
                setLoading(false)
            })
    }, [categoryId])

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#3A5A40] to-[#2c2f3d] -mt-[229px]">
                <div className="text-center text-white">
                    <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-t-4 border-white rounded-full mb-4" role="status">
                        <span className="sr-only">Cargando...</span>
                    </div>
                </div>
            </div>
        )
    }


    return (
        <div className="bg-gradient-to-br from-[#3A5A40] via-[#3A5A40] to-slate-900 -mt-[229px] p-6" id="menu">
            <h1 className="text-6xl font-extrabold text-white mb-4 mt-10 text-center">Nuestro Menú</h1>
            <p className="text-lg text-gray-300 mb-8 text-center max-2xl mb-12 mx-auto">
                Bienvenido a nuestra carta virtual. Aquí puedes explorar todos nuestros productos, ver sus detalles, seleccionar la cantidad que deseas para tu mesa, y realizar tu pedido directamente desde tu dispositivo. Una vez que completes tu orden, se enviará automáticamente a nuestra cafetería para su preparación. Podrás disfrutar de tu pedido sin necesidad de llamar a un mesero para pedir la cuenta, y también puedes dejar una propina virtual que será distribuida equitativamente entre todo el equipo. ¡Gracias por visitarnos!
            </p>

            <ItemList products={products} />
        </div>
    )
}

export default ItemListContainer
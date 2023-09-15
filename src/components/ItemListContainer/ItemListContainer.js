import ItemList from '../ItemList/ItemList'
import './ItemListContainer.css'

import { useState, useEffect } from 'react'

import { useParams } from 'react-router-dom'

import {getDocs, collection, query, where} from 'firebase/firestore'
import { db } from '../../services/firebase/firebaseConfig'

const ItemListContainer = ({ greeting }) => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    const { categoryId } = useParams()

    useEffect(() => {
        setLoading(true)

        const collectionRef = categoryId
            ? query(collection(db, 'products'), where('category', '==', categoryId))
            : collection(db, 'products')

        getDocs (collectionRef)
            .then(response => {
                const productsAdapted = response.docs.map(doc => {
                    const data = doc.data()
                    return { id: doc.id, ...data }
                })
                setProducts(productsAdapted)
            })
            .catch(
                toast.error('🦄 ¡Ocurrió un error inesperado!', {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    }))
            .finally(() => {
                setLoading(false)
            })
        }, [categoryId])

    if(loading) {
        return <div>Cargando...</div>
    }

    return(
        <div>
            <h1>{greeting}</h1>
            <ItemList products={products}/>
        </div>
    )
}

export default ItemListContainer
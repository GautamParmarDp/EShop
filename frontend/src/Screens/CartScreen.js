import React,{useEffect} from 'react'
import {Link ,useParams ,useLocation} from 'react-router-dom'
import {useDispatch,useSelector} from 'react-redux'
import {Row,Col,ListGroup,Button,Card,Image,Form} from 'react-bootstrap'
import Message from '../components/Message'
import {addToCart} from '../actions/cartActions'

function CartScreen() {
    let productId = useParams()
    // console.log("productId:", productId.id)
    productId = productId.id
    let location =useLocation()
    // const qty = location.search
    // console.log("qty:", qty) 
    // Output=>   qty: ?qty=4

    const qty=location.search ? Number(location.search.split('=')[1]) : 1

    const dispatch = useDispatch()

    const cart = useSelector(state=>state.cart)
    const{cartItems}=cart
    console.log('cartItems:',cartItems)

    useEffect(()=>{
        if(productId){
            dispatch(addToCart(productId,qty))
        }
    },[dispatch,productId,qty])


    return (
        <div>
            CartScreen is here
        </div>
    )
}

export default CartScreen

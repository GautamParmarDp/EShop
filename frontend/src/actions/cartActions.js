import axios from 'axios'
import {
    CARD_ADD_ITEM , 
    CARD_REMOVE_ITEM , 
    
    CART_SAVE_SHIPPING_ADDRESS,

    CART_SAVE_PAYMENT_METHOD,
    
} from '../constants/cartConstants'

export const addToCart = (id,qty) => async (dispatch,getState) => {

    try{
    const {data} = await axios.get(`/api/products/${id}`)

    dispatch({
        type:CARD_ADD_ITEM,
        payload:{
            product:data._id,
            name:data.name,
            image:data.image,
            price:data.price,
            countInStock:data.countInStock,
            qty
        }
    })

    localStorage.setItem('cartItems', JSON.stringify( getState().cart.cartItems ) )
    }
    catch(error){
        dispatch( { 
            type:CARD_ADD_ITEM , 
            payload:error.response && error.response.data.message 
            ?error.response.data.message
            :error.message,
        })
    }
}

export const reomveFromCart = (id) => (dispatch,getState) => {
    
    dispatch({
        type:CARD_REMOVE_ITEM,
        payload:id,
    })

    localStorage.setItem('cartItems', JSON.stringify( getState().cart.cartItems ) )
}

export const saveShippingAddress = (data) => (dispatch) => {
    
    dispatch({
        type:CART_SAVE_SHIPPING_ADDRESS,
        payload:data,
    })

    localStorage.setItem('shippingAddress', JSON.stringify(data) )
}

export const savePaymentMethod = (data) => (dispatch) => {
    
    dispatch({
        type:CART_SAVE_PAYMENT_METHOD,
        payload:data,
    })

    localStorage.setItem('paymentMethod', JSON.stringify(data) )
}
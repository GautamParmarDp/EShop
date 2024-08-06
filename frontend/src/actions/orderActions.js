import axios from 'axios'
import {
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL,

    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    
    ORDER_PAY_REQUEST,
    ORDER_PAY_SUCCESS,
    ORDER_PAY_FAIL,
    ORDER_PAY_RESET,

    ORDER_LIST_MY_REQUEST,
    ORDER_LIST_MY_SUCCESS,
    ORDER_LIST_MY_FAIL,
    ORDER_LIST_MY_RESET,

    ORDER_LIST_REQUEST,
    ORDER_LIST_SUCCESS,
    ORDER_LIST_FAIL,
} from '../constants/orderConstants'

import {CART_CLEAR_ITEM} from '../constants/cartConstants'

export const createOrder = (order) => async(dispatch,getState) => {
    try{
        dispatch({ type:ORDER_CREATE_REQUEST })

        const{ userLogin:{userInfo} } = getState() //user should be authenticated(loggedIn) to place the order to the path /api/orders/add/ so we are fetching token of loggedIn user and sending it in headers
        const config = {
            headers:{ 
                'Content-type':'application/json' ,
                Authorization :`Bearer ${userInfo.token}`
            }
        }
        const {data} = await axios.post(`/api/orders/add/`, order ,config )
        dispatch({ type:ORDER_CREATE_SUCCESS, payload: data }) 

        dispatch({ type:CART_CLEAR_ITEM, payload: data }) //clear cart state after order is placed successfully  
        localStorage.removeItem('cartItems') ////clear cartItems from localStorage after order is placed successfully
    }
    catch(error){
        dispatch( { 
            type:ORDER_CREATE_FAIL , 
            payload:error.response && error.response.data.detail 
            ?error.response.data.detail
            :error.message,
        })
    }
}

export const getOrderDetails = (id) => async(dispatch,getState) => {
    try{
        dispatch({ type:ORDER_DETAILS_REQUEST })

        const{ userLogin:{userInfo} } = getState() //user should be authenticated(loggedIn) to get the order from the path /api/orders/<id>/ so we are fetching token of loggedIn user and sending it in headers
        const config = {
            headers:{ 
                'Content-type':'application/json' ,
                Authorization :`Bearer ${userInfo.token}`
            }
        }
        const {data} = await axios.get(`/api/orders/${id}/` ,config )
        dispatch({ type:ORDER_DETAILS_SUCCESS, payload: data }) 
    }
    catch(error){
        dispatch( { 
            type:ORDER_DETAILS_FAIL , 
            payload:error.response && error.response.data.detail 
            ?error.response.data.detail
            :error.message,
        })
    }
}

//paymentResult will be from PayPal when we integrate that
export const payOrder = (id,paymentResult) => async(dispatch,getState) => {
    try{
        console.log('Inside payOrder try') 
        dispatch({ type:ORDER_PAY_REQUEST })
        console.log('ORDER_PAY_REQUEST') 

        const{ userLogin:{userInfo} } = getState() //user should be authenticated(loggedIn) to do the payment for order from the path /api/orders/<id>/pay so we are fetching token of loggedIn user and sending it in headers
        const config = {
            headers:{ 
                'Content-type':'application/json' ,
                Authorization :`Bearer ${userInfo.token}`
            }
        }
        const {data} = await axios.put(`/api/orders/${id}/pay/`, paymentResult ,config )
        console.log('put data:', data) 

        dispatch({ type:ORDER_PAY_SUCCESS, payload: data }) 
        console.log('ORDER_PAY_SUCCESS') 

    }
    catch(error){
        console.log('Inside payOrder catch')

        dispatch( { 
            type:ORDER_PAY_FAIL , 
            payload:error.response && error.response.data.detail 
            ?error.response.data.detail
            :error.message,
        })
    }
}

export const listMyOrders = () => async(dispatch,getState) => {
    try{
        dispatch({ type:ORDER_LIST_MY_REQUEST })

        const{ userLogin:{userInfo} } = getState() //user should be authenticated(loggedIn) to get the order from the path /api/orders/<id>/ so we are fetching token of loggedIn user and sending it in headers
        const config = {
            headers:{ 
                'Content-type':'application/json' ,
                Authorization :`Bearer ${userInfo.token}`
            }
        }
        const {data} = await axios.get(`/api/orders/myorders/` ,config )
        dispatch({ type:ORDER_LIST_MY_SUCCESS, payload: data }) 
    }
    catch(error){
        dispatch( { 
            type:ORDER_LIST_MY_FAIL , 
            payload:error.response && error.response.data.detail 
            ?error.response.data.detail
            :error.message,
        })
    }
}

export const listOrders = () => async(dispatch,getState) => {
    try{
        dispatch({ type:ORDER_LIST_REQUEST })

        const{ userLogin:{userInfo} } = getState() //user should be authenticated(loggedIn as admin) to get the order from the path /api/orders/ so we are fetching token of loggedIn admin and sending it in headers
        const config = {
            headers:{ 
                'Content-type':'application/json' ,
                Authorization :`Bearer ${userInfo.token}`
            }
        }
        const {data} = await axios.get(`/api/orders/` ,config )
        dispatch({ type:ORDER_LIST_SUCCESS, payload: data }) 
    }
    catch(error){
        dispatch( { 
            type:ORDER_LIST_FAIL , 
            payload:error.response && error.response.data.detail 
            ?error.response.data.detail
            :error.message,
        })
    }
}

import axios from 'axios'
import {
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL

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

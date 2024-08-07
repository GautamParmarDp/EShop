import {combineReducers,applyMiddleware} from 'redux'
import { configureStore} from '@reduxjs/toolkit'
import {thunk} from 'redux-thunk'
import {composeWithDevTools} from '@redux-devtools/extension'
import {productListReducers,productDetailsReducers, productDeleteReducers,productCreateReducers,productUpdateReducers, productReviewCreateReducers, productTopRatedReducers} from './reducers/productReducers'
import {cartReducer} from './reducers/cartReducers'
import {orderCreateReducer, orderDetailsReducer , orderPayReducer ,orderListMyReducer, orderListReducer,orderDeliverReducer} from './reducers/orderReducers'
import { userLoginReducer , userRegisterReducer , userDetailsReducer ,userUpdateProfileReducer, 
    userListReducer,userDeleteReducer, userUpdateReducer} from './reducers/userReducers'


const reducers = combineReducers({
    productList:productListReducers,
    productDetails:productDetailsReducers,
    productDelete:productDeleteReducers,
    productCreate:productCreateReducers,
    productUpdate:productUpdateReducers,
    productReviewCreate:productReviewCreateReducers,
    productTopRated:productTopRatedReducers,
    cart:cartReducer,
    userLogin:userLoginReducer,
    userRegister:userRegisterReducer,
    userDetails:userDetailsReducer,
    userUpdateProfile : userUpdateProfileReducer,
    orderCreate:orderCreateReducer,
    orderDetails:orderDetailsReducer,
    orderPay:orderPayReducer,
    orderDeliver:orderDeliverReducer,
    orderListMy:orderListMyReducer,
    orderList:orderListReducer,
    userList:userListReducer,
    userDelete:userDeleteReducer,
    userUpdate:userUpdateReducer,
})

const cartItemsFromStorage= localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
const userInfoFromStorage= localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
const shippingAddressFromStorage= localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {}


const initialState = {
    cart:{ cartItems : cartItemsFromStorage , shippingAddress :shippingAddressFromStorage } , 
    userLogin:{ userInfo : userInfoFromStorage }
}

const middleware = [thunk]

const store = configureStore({reducer:reducers},initialState,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store

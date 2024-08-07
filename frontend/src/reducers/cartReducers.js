import { saveShippingAddress } from '../actions/cartActions'
import {
    CARD_ADD_ITEM,
    CARD_REMOVE_ITEM,

    CART_SAVE_SHIPPING_ADDRESS,

    CART_SAVE_PAYMENT_METHOD,

    CART_CLEAR_ITEM,

} from '../constants/cartConstants'
var Items = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
var shippingAddress = localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : []

export const cartReducer = (state = { cartItems: Items, shippingAddress: shippingAddress }, action) => {

    switch (action.type) {
        case CARD_ADD_ITEM:
            const item = action.payload
            const existItem = state.cartItems.find(x => x.product === item.product)
            if (existItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(x =>
                        x.product === existItem.product ? item : x)
                }
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item]
                }
            }

        case CARD_REMOVE_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter(x => x.product != action.payload)
            }
        case CART_SAVE_SHIPPING_ADDRESS:
            return {
                ...state,
                shippingAddress: action.payload
            }
        case CART_SAVE_PAYMENT_METHOD:
            return {
                ...state,
                paymentMethod: action.payload
            }
        
        case CART_CLEAR_ITEM:
            return{
                ...state,
                cartItems:[]
            }
        default:
            return state
    }
}
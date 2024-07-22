import {CARD_ADD_ITEM} from '../constants/cartConstants'
var Items= localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
export const cartReducer = (state={cartItems:Items},action)=>{

    switch(action.type){
        case CARD_ADD_ITEM:
            const item=action.payload
            const existItem=state.cartItems.find( x =>  x.product === item.product)
            if(existItem){
                return{ 
                    ...state,
                    cartItems: state.cartItems.map( x=>
                        x.product === existItem.product ? item : x)
                }
            }else{
                return{
                    ...state,
                    cartItems:[...state.cartItems,item] 
                }
            }
        default:
            return state
    }
}
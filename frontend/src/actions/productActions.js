import axios from 'axios'
import {useParams} from 'react-router-dom'
import {
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,

    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,

    PRODUCT_DELETE_REQUEST,
    PRODUCT_DELETE_SUCCESS,
    PRODUCT_DELETE_FAIL,

    PRODUCT_CREATE_REQUEST,
    PRODUCT_CREATE_SUCCESS,
    PRODUCT_CREATE_FAIL,

    PRODUCT_UPDATE_REQUEST,
    PRODUCT_UPDATE_SUCCESS,
    PRODUCT_UPDATE_FAIL,
} from '../constants/productConstants'

export const listProducts = ()=> async (dispatch) => {
    try{
        dispatch( { type:PRODUCT_LIST_REQUEST })
        
        const { data } = await axios.get('/api/products/')

        dispatch( { type:PRODUCT_LIST_SUCCESS , payload:data })
    }
    catch(error){
        dispatch( { 
            type:PRODUCT_LIST_FAIL , 
            payload:error.response && error.response.data.detail 
            ?error.response.data.detail
            :error.message,
        })
    }

}

export const listProductDetails = (id)=> async (dispatch) => {
    try{
        dispatch( { type:PRODUCT_DETAILS_REQUEST })
        
        // const { id } = useParams()
        const { data } = await axios.get(`/api/products/${id}`)

        dispatch( { type:PRODUCT_DETAILS_SUCCESS , payload:data })
    }
    catch(error){
        dispatch( { 
            type:PRODUCT_DETAILS_FAIL , 
            payload:error.response && error.response.data.detail 
            ?error.response.data.detail
            :error.message,
        })
    }

}

export const deleteProduct = (id) => async(dispatch,getState) => {
    try{
        dispatch({ type:PRODUCT_DELETE_REQUEST })

        const{ userLogin:{userInfo} } = getState() //user should be authenticated(loggedIn as Admin) to delete the product from the path /api/products/delete/${id}/ so we are fetching token of loggedIn admin and sending it in headers
        const config = {
            headers:{ 
                'Content-type':'application/json' ,
                Authorization :`Bearer ${userInfo.token}`
            }
        }
        const {data} = await axios.delete(`/api/products/delete/${id}` ,config )
        dispatch({ type:PRODUCT_DELETE_SUCCESS }) 
    }
    catch(error){
        dispatch( { 
            type:PRODUCT_DELETE_FAIL , 
            payload:error.response && error.response.data.detail 
            ?error.response.data.detail
            :error.message,
        })
    }
}

export const createProduct = () => async(dispatch,getState) => {
    try{
        dispatch({ type:PRODUCT_CREATE_REQUEST })

        const{ userLogin:{userInfo} } = getState() //user should be authenticated(loggedIn as Admin) to craete the product from the path /api/products/create/ so we are fetching token of loggedIn admin and sending it in headers
        const config = {
            headers:{ 
                'Content-type':'application/json' ,
                Authorization :`Bearer ${userInfo.token}`
            }
        }
        const {data} = await axios.post(`/api/products/create/` , {} ,config ) //since we are not sending formdata and template of product is creating in backend view directly and going to edit product page, we put {} empty object bcz of post request
        dispatch({ type:PRODUCT_CREATE_SUCCESS , payload:data }) 
    }
    catch(error){
        dispatch( { 
            type:PRODUCT_CREATE_FAIL , 
            payload:error.response && error.response.data.detail 
            ?error.response.data.detail
            :error.message,
        })
    }
}

export const updateProduct = (product) => async(dispatch,getState) => {
    try{
        dispatch({ type:PRODUCT_UPDATE_REQUEST })

        const{ userLogin:{userInfo} } = getState() //user should be authenticated(loggedIn as Admin) to update the product from the path /api/products/update/${product._id} so we are fetching token of loggedIn admin and sending it in headers
        const config = {
            headers:{ 
                'Content-type':'application/json' ,
                Authorization :`Bearer ${userInfo.token}`
            }
        }
        const {data} = await axios.put(`/api/products/update/${product._id}` , product ,config )
        dispatch({ type:PRODUCT_UPDATE_SUCCESS , payload:data }) 

        dispatch({ type:PRODUCT_DETAILS_SUCCESS , payload:data}) //we load in updated product in deatil
    }
    catch(error){
        dispatch( { 
            type:PRODUCT_UPDATE_FAIL , 
            payload:error.response && error.response.data.detail 
            ?error.response.data.detail
            :error.message,
        })
    }
}
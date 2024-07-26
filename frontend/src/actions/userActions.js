import axios from 'axios'
import {
    USER_LOGIN_REQUEST , 
    USER_LOGIN_SUCCESS , 
    USER_LOGIN_FAIL , 

    USER_LOGOUT,
    
    USER_REGISTER_REQUEST ,
    USER_REGISTER_SUCCESS ,
    USER_REGISTER_FAIL ,

    USER_DETAILS_REQUEST ,
    USER_DETAILS_SUCCESS ,
    USER_DETAILS_FAIL ,

    USER_UPDATE_PROFILE_REQUEST ,
    USER_UPDATE_PROFILE_SUCCESS ,
    USER_UPDATE_PROFILE_FAIL ,
    USER_UPDATE_PROFILE_RESET ,

} from '../constants/userConstants'
import { json } from 'react-router-dom'

export const login = (email,password) => async(dispatch) => {
    try{
        dispatch({ type:USER_LOGIN_REQUEST })

        const config = {
            headers:{ 'Content-type':'application/json'}
        }
        const {data} = await axios.post('/api/users/login/',{'username':email,'password':password},config )

        dispatch({ type:USER_LOGIN_SUCCESS, payload: data })

        localStorage.setItem('userInfo',JSON.stringify(data))
    }
    catch(error){
        dispatch( { 
            type:USER_LOGIN_FAIL , 
            payload:error.response && error.response.data.detail 
            ?error.response.data.detail
            :error.message,
        })
    }
}

export const logout = () => (dispatch) => {
    
    localStorage.removeItem('userInfo')
    dispatch({ type : USER_LOGOUT})
}

export const register = (name,email,password) => async(dispatch) => {
    try{
        dispatch({ type:USER_REGISTER_REQUEST })

        const config = {
            headers:{ 'Content-type':'application/json'}
        }
        const {data} = await axios.post('/api/users/register/', {'name':name,'email':email,'password':password}, config )
        dispatch({ type:USER_REGISTER_SUCCESS, payload: data }) 
        dispatch({ type:USER_LOGIN_SUCCESS, payload: data }) //After we Register user successfully we want user to be logged in

        localStorage.setItem('userInfo',JSON.stringify(data))
    }
    catch(error){
        dispatch( { 
            type:USER_REGISTER_FAIL , 
            payload:error.response && error.response.data.detail 
            ?error.response.data.detail
            :error.message,
        })
    }
}


export const getUserDetails = (id) => async(dispatch,getState) => {
    try{
        dispatch({ type:USER_DETAILS_REQUEST })

        const{ userLogin:{userInfo} } = getState() //user should be authenticated to access the path /api/users/profile/ so we are fetching token of loggedIn user and sending it in headers

        const config = {
            headers:{ 
                'Content-type':'application/json' ,
                Authorization :`Bearer ${userInfo.token}`
            }
        }
        const {data} = await axios.get(`/api/users/${id}`, config )
        dispatch({ type:USER_DETAILS_SUCCESS, payload: data }) 
    }
    catch(error){
        dispatch( { 
            type:USER_DETAILS_FAIL , 
            payload:error.response && error.response.data.detail 
            ?error.response.data.detail
            :error.message,
        })
    }
}

export const updateUserProfile = (user) => async(dispatch,getState) => {
    try{
        dispatch({ type:USER_UPDATE_PROFILE_REQUEST })

        const{ userLogin:{userInfo} } = getState() //user should be authenticated to update the details to the path /api/users/profile/update/ so we are fetching token of loggedIn user and sending it in headers

        const config = {
            headers:{ 
                'Content-type':'application/json' ,
                Authorization :`Bearer ${userInfo.token}`
            }
        }
        const {data} = await axios.put(`/api/users/profile/update/`, user ,config )
        dispatch({ type:USER_UPDATE_PROFILE_SUCCESS, payload: data }) 

        //once user update successfull we want to logIn the user with new updated user details so we trigger USER_LOGIN_SUCCESS again for state data and also update our local storage as well
        dispatch({ type:USER_LOGIN_SUCCESS , payload: data })

        localStorage.setItem('userInfo',JSON.stringify(data))

    }
    catch(error){
        dispatch( { 
            type:USER_UPDATE_PROFILE_FAIL , 
            payload:error.response && error.response.data.detail 
            ?error.response.data.detail
            :error.message,
        })
    }
}

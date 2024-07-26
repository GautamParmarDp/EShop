import React, { useState, useEffect } from 'react'
import { Link, redirect, useLocation } from 'react-router-dom'
import { Form, Row, Col, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { getUserDetails , updateUserProfile } from '../actions/userActions'
import { useNavigate } from 'react-router-dom'
import {USER_UPDATE_PROFILE_RESET} from '../constants/userConstants'

function ProfileScreen() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    const dispatch = useDispatch()

    let location = useLocation()

    const userDetails = useSelector(state => state.userDetails)
    const { loading, error, user } = userDetails

    const userLogin = useSelector(state => state.userLogin) //user should be logged in to get to this screen 
    const { userInfo } = userLogin

    const history = useNavigate();

    //userEffect should know about updateUserProfile updating the userUpdateProfile state 
    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    const { success } = userUpdateProfile

    useEffect(() => {
        if (!userInfo) {
            // history.push(redirect)
            // history.go(redirect)
            history('/login') //if user not logged in then we redirect him to this page
        }
        else {
            if ( !user || !user.name || success) {
                dispatch({ type: USER_UPDATE_PROFILE_RESET}) //if success is true means user updated then we reset the user state and..
                dispatch(getUserDetails('profile')) //..fetch current_user/updated_user details 
            }
            else {
                setName(user.name)
                setEmail(user.email)
            }
        }
    }, [dispatch, history, userInfo, user , success]) //we gonna listen to all this dependancy and see if this part of state changes 



    const submitHandler = (e) => {
        e.preventDefault()
        // console.log('Submitted')
        if (password !== confirmPassword) {
            setMessage('Passwords do not match.')
        }
        else {
            // console.log('Updating profile')
            dispatch(updateUserProfile({
                'id' : user._id ,
                'name': name ,
                'email' : email ,
                'password' : password
            }))
            setMessage('')
        }
    }

    return (
        <Row>
            <Col md={3}>
                <h2>User Profile</h2>
                {message && <Message variant='danger'> {message} </Message>}
                {error && <Message variant='danger'> {error} </Message>}
                {loading && <Loader />}

                <Form onSubmit={submitHandler}>

                    <Form.Group controlId='name'>
                        <Form.Label> Name </Form.Label>
                        <Form.Control
                            required
                            type='name'
                            placeholder='Enter name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='email'>
                        <Form.Label> Email Address </Form.Label>
                        <Form.Control
                            required
                            type='email'
                            placeholder='Enter Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='password'>
                        <Form.Label> Password </Form.Label>
                        <Form.Control
                            
                            type='password'
                            placeholder='Enter Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='passwordConfirm'>
                        <Form.Label> Confirm Password </Form.Label>
                        <Form.Control
                            
                            type='password'
                            placeholder='Confirm Password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Button type='submit' variant='primary'>
                        Update
                    </Button>

                </Form>

            </Col>
            <Col md={9}>
                <h2>My Orders</h2>
            </Col>

        </Row>
    )
}

export default ProfileScreen

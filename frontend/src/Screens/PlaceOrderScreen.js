import React, { useState, useEffect } from 'react'
import { Button, Row, Col, ListGroup, Image, Card, ListGroupItem } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import { Link, useNavigate } from 'react-router-dom'
import {createOrder} from '../actions/orderActions'
import {ORDER_CREATE_RESET} from '../constants/orderConstants'


function PlaceOrderScreen() {

    const orderCreate = useSelector(state => state.orderCreate)
    const { order,error,success} = orderCreate

    const dispatch = useDispatch()
    const history = useNavigate();

    const cart = useSelector(state => state.cart)
    // const {shippingAddress} = cart

    cart.itemPrice = cart.cartItems.reduce( (acc,item) => acc + (item.price * item.qty) , 0).toFixed(2)
    //if total price is >100 then shippPrice is $0 else $10
    cart.shippingPrice = (cart.itemPrice > 100 ? 0 : 10).toFixed(2)
    //let's keep tax rate 18% 
    cart.taxPrice = (0.18 * cart.itemPrice).toFixed(2)

    cart.totalPrice = (Number(cart.itemPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2)

    useEffect( () => {
        if(!cart.paymentMethod){
            history('/payment')
        }
    
        if(success){
            history(`/order/${order._id}`)
            dispatch({type:ORDER_CREATE_RESET})
        }
    },[success,history])  //added dependancies means it will change when success or history changes

    const placeOrder = () => {
        // console.log("place order")
        dispatch(createOrder(
            {
                orderItems:cart.cartItems,
                paymentMethod:cart.paymentMethod,
                taxPrice:cart.taxPrice,
                shippingPrice:cart.shippingPrice,
                totalPrice:cart.totalPrice,
                shippingAddress:cart.shippingAddress,

                itemPrice:cart.itemPrice,
            }
        ))
    }
    return (
        <div>
            <CheckoutSteps step1 step2 step3 step4 />

            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Shipping:  </strong>
                                {cart.shippingAddress.address},
                                {cart.shippingAddress.city}, {' '} ,
                                {cart.shippingAddress.postalCode}, {' '} ,
                                {cart.shippingAddress.country}
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method:  </strong>
                                {cart.paymentMethod}
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {
                                cart.cartItems.length === 0
                                    ? <Message variant='info'>Your cart is empty</Message>
                                    : (
                                        <ListGroup variant='flush'>
                                            {cart.cartItems.map((item, index) =>
                                                <ListGroup.Item key={index}>
                                                    <Row>
                                                        <Col md={1}>
                                                            <Image src={item.image} alt={item.name} fluid rounded />
                                                        </Col>
                                                        <Col>
                                                            <Link to={`/product/${item.product}`}> {item.name} </Link>
                                                        </Col>
                                                        <Col md={4}>
                                                            {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                                        </Col>

                                                    </Row>
                                                </ListGroup.Item>
                                            )}
                                        </ListGroup>
                                    )
                            }

                        </ListGroup.Item>


                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items:</Col>
                                    <Col>${cart.itemPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col>${cart.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax:</Col>
                                    <Col>${cart.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>${cart.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item> 
                                {error && 
                                    <Message variant='danger'> {error} </Message>
                                } 
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Button 
                                    type='button' 
                                    className='btn-block'
                                    disabled={cart.cartItems === 0}
                                    onClick={placeOrder}
                                    >
                                    Place Order
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>

                </Col>
            </Row>

        </div>
    )
}

export default PlaceOrderScreen

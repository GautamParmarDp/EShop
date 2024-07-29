import React, { useState, useEffect } from 'react'
import { Button, Row, Col, ListGroup, Image, Card, ListGroupItem } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getOrderDetails, payOrder } from '../actions/orderActions'
import {PayPalButton} from 'react-paypal-button-v2'
import {ORDER_PAY_RESET} from '../constants/orderConstants'

function OrderScreen() {

    const { id } = useParams()
    const orderId = id

    const orderDetails = useSelector(state => state.orderDetails)
    const { loading, order, error } = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay //loadingPay cousom name given bcz loading already exist for above

    const dispatch = useDispatch()
    const history = useNavigate();

    if (!loading && !error) {//when ORDER_DETAILS_SUCCESS then only calculate
        order.itemPrice = order.orderItems.reduce((acc, item) => acc + (item.price * item.qty), 0).toFixed(2)
    }

    const [sdkReady, setSdkReady] = useState(false)
    //default val is false means that our software dev kit is not ready for paypal.
    // Once we load script addPayPalScript() then we are ready for paypal
    // put clientId in .env file later
    const addPayPalScript = () => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = 'https://www.paypal.com/sdk/js?client-id=AftWJqvC2ENh_NDI4TGKXkK8IJLmqi_feJ5i8xGLlrQvf1a8pWHEC2td-ovnWBiAQDiDwpIsaHBFyj9g'
        script.async = true
        script.onload = () => {
            setSdkReady(true)
        }
        document.body.appendChild(script) //appending the script once its ready
    }

    useEffect(() => {
        if (!order || successPay || order._id !== Number(orderId)) { //if we dont have order or order with that id than we dispatch it
            dispatch({type:ORDER_PAY_RESET})
            console.log('ORDER_PAY_RESET ')
            
            dispatch(getOrderDetails(orderId))
            console.log('getOrderDetails ')


        }
        else if (!order.isPaid) {
            if (!window.paypal) {
                addPayPalScript()
                console.log('addPayPalScript ')

            }
            else {
                setSdkReady(true)
                console.log('setSdkReady true')

            }
        }
    }, [dispatch, order, orderId, successPay])  //added dependancies means it will change when order or orderId changes

    const successPaymentHandler = (paymentResult) => {
        console.log('inside successPaymentHandler')
        console.log('paymentResult: ', paymentResult)
        console.log('orderId: ', orderId)
        
        dispatch(payOrder(orderId,paymentResult))
        // dispatch(payOrder(orderId, paymentResult))
        console.log('payOrder')

    }

    return loading ? (
        <Loader />
    ) : error ? (
        <Message variant='danger'>{error}</Message>
    ) : (
        <div>
            <h1>Order: {order._id} </h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p><strong>Name: </strong>{order.user.name}</p>
                            <p><strong>Email: </strong><a href={`mailTo:${order.user.email}`}>{order.user.email}</a></p>
                            <p>
                                <strong>Shipping:  </strong>
                                {order.shippingAddress.address},
                                {order.shippingAddress.city}, {' '} ,
                                {order.shippingAddress.postalCode}, {' '} ,
                                {order.shippingAddress.country}
                            </p>
                            {
                                order.isDelivered ? (
                                    <Message variant='success'>Delivered on {order.deliveredAt}</Message>
                                ) : (
                                    <Message variant='warning'>Not Delivered</Message>
                                )
                            }
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method:  </strong>
                                {order.paymentMethod}
                            </p>
                            {
                                order.isPaid ? (
                                    <Message variant='success'>Paid on {order.paidAt}</Message>
                                ) : (
                                    <Message variant='warning'>Not Paid</Message>
                                )
                            }
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {
                                order.orderItems.length === 0
                                    ? <Message variant='info'>Order is empty</Message>
                                    : (
                                        <ListGroup variant='flush'>
                                            {order.orderItems.map((item, index) =>
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
                                    <Col>${order.itemPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax:</Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            {!order.isPaid && ( //if order not paid then only show rest
                                <ListGroup.Item>
                                    { loadingPay && <Loader/> }
                                    { !sdkReady ? ( //paypal sdk ready false means not loaded then show loader. 
                                        <Loader />
                                        ) : (  ////paypal sdk ready true means loaded then show paypal button.
                                            <PayPalButton 
                                                amount={order.totalPrice}
                                                onSuccess={successPaymentHandler}
                                            />
                                            )
                                    }
                                </ListGroup.Item>


                                ) 
                            }

                                </ListGroup>
                    </Card>

                </Col>
            </Row>

        </div>
    )
}

export default OrderScreen

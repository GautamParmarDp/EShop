import React, { useEffect } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Button, Card, Image, Form } from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart } from '../actions/cartActions'
import { createBrowserHistory } from "history";

function CartScreen() {
    let productId = useParams()
    // console.log("productId:", productId.id)
    productId = productId.id
    let location = useLocation()
    // const qty = location.search
    // console.log("qty:", qty) 
    // Output=>   qty: ?qty=4

    const qty = location.search ? Number(location.search.split('=')[1]) : 1

    const dispatch = useDispatch()

    const cart = useSelector(state => state.cart)
    const { cartItems } = cart
    // console.log('cartItems:',cartItems)
    const history = createBrowserHistory({ forceRefresh: true });
    useEffect(() => {
        if (productId) {
            dispatch(addToCart(productId, qty))
        }
    }, [dispatch, productId, qty])

    const removeFromCartHandler= (id) => {
        console.log("remove :",id );
    }

    const checkoutHandler =() => {
        history.push('/login?redirect=shipping')
        history.go('/login?redirect=shipping')
    }

    return (
        <Row>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {cartItems.length === 0 ?
                    (
                        <Message variant='info'> Your Cart is empty..
                            <Link to='/'>Go back</Link>
                        </Message>) :
                    (
                        <ListGroup variant='flush'>
                            {
                                cartItems.map(item => (
                                    <ListGroup.Item key={item.product}>
                                        <Row>
                                            <Col md={2}>
                                                <Image src={item.image} alt={item.name} fluid rounded />
                                            </Col>
                                            <Col md={3}>
                                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                                            </Col>
                                            <Col md={2}>
                                                ${item.price}
                                            </Col>
                                            <Col md={3}>
                                                <Form.Control
                                                    as="select"
                                                    value={item.qty}
                                                    onChange={(e) => dispatch(addToCart(item.product,Number(e.target.value)))}>

                                                    {
                                                        // [0,1,2,3,..] same as below
                                                        // [...Array(product.countInStock).keys()]
                                                        [...Array(item.countInStock).keys()].map((x) => (
                                                            <option key={x + 1} value={x + 1}>
                                                                {x + 1}
                                                            </option>
                                                        ))

                                                    }

                                                </Form.Control>
                                            </Col>
                                            <Col md={1}>
                                                    <Button type='button' variant='light'
                                                            onClick={ () => removeFromCartHandler(item.product) }
                                                    >
                                                        <i className='fas fa-trash'></i>
                                                    </Button>
                                            </Col>


                                        </Row>
                                    </ListGroup.Item>
                                )
                                )

                            }

                        </ListGroup>
                    )


                }
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Subtotal ({cartItems.reduce( (acc,item) => acc + item.qty , 0)}) items:</h2>
                            ${cartItems.reduce( (acc,item) => acc + item.qty * item.price, 0).toFixed(2)}

                        </ListGroup.Item>
                    </ListGroup>
                    <ListGroup.Item>
                        <Button type='button'
                                className='btn-block'
                                disabled = {cartItems.length === 0}
                                onClick={checkoutHandler}>
                            Proceed to Checkout
                        </Button>
                    </ListGroup.Item>
    
                </Card>
            </Col>
        </Row>
    )
}

export default CartScreen

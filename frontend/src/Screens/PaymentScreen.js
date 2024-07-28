import React, { useState, useEffect } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { useNavigate } from 'react-router-dom'
import {savePaymentMethod} from '../actions/cartActions'

function PaymentScreen() {
    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    const dispatch = useDispatch()
    const history = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState('PyaPal')

    if (!shippingAddress.address) {
        history('/shipping')
    }

    const submitHandler = (e) => {
        e.preventDefault() // without this it would load next page after submit so we use this
        dispatch(savePaymentMethod(paymentMethod))
        history('/placeorder')
    }


    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />

            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as='legend'>Select Method: </Form.Label>
                    <Col>
                        <Form.Check
                            type='radio'
                            label='PayPal or Credit Card'
                            id='PayPal'
                            name='paymentMethod'
                            checked
                            onChange={(e) => setPaymentMethod(e.target.value)}>

                        </Form.Check>
                    </Col>
                </Form.Group>

                <Button type='submit' variant='primary' className='my-3'>
                    Continue
                </Button>
            </Form>

        </FormContainer>
    )
}

export default PaymentScreen

import React, { useState, useEffect } from 'react'
import { Link, redirect, useLocation, useParams } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { listProductDetails, updateProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function ProductEditScreen() {

    const { id } = useParams()
    const productId = id

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [description, setDescription] = useState('')
    const [uploading, setUploading] = useState(false)

    const dispatch = useDispatch()

    // let location = useLocation()

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    const productUpdate = useSelector(state => state.productUpdate)
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate

    const history = useNavigate();

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_RESET })
            history('/admin/productlist')
        }
        else {
            if (!product.name || product._id !== Number(productId)) {
                dispatch(listProductDetails(productId))
            } else {
                setName(product.name)
                setPrice(product.price)
                setImage(product.image)
                setBrand(product.brand)
                setCategory(product.category)
                setCountInStock(product.countInStock)
                setDescription(product.description)
            }
        }
    }, [dispatch, product, productId, history, successUpdate])

    const submitHandler = (e) => {
        e.preventDefault()
        //update product
        dispatch(updateProduct({
            _id: productId,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description
        }))
    }

    //we will use async bcz we are sending post request so user axios here
    const uploadFileHandler = async (e) => {
        // console.log('File is uploading')
        const file = e.target.files[0]
        const formdata = new FormData()
        formdata.append('image',file)
        formdata.append('product_id',productId)

        setUploading(true)

        try{
            const config = { headers: {'Content-Type':'multipart/form-data'} }
            const {data} = await axios.post('/api/products/upload/', formdata , config)
            setImage(data)
            
            setUploading(false)

        }catch(error){
            setUploading(false)
        }
    }
    return (
        <div>
            <Link to='/admin/productlist/'>
                Go Back
            </Link>

            <FormContainer>
                <h1>Edit Product</h1>

                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'> {errorUpdate}</Message>}

                {loading ? <Loader />
                    : error ? <Message variant='danger'> {error}</Message>
                        : (
                            <Form onSubmit={submitHandler}>

                                <Form.Group controlId='name'>
                                    <Form.Label> Name </Form.Label>
                                    <Form.Control

                                        type='name'
                                        placeholder='Enter name'
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    >
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='price'>
                                    <Form.Label> Price </Form.Label>
                                    <Form.Control

                                        type='number'
                                        placeholder='Enter price'
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    >
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='image'>
                                    <Form.Label> Image </Form.Label>
                                    <Form.Control

                                        type='text'
                                        placeholder='Enter image'
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}
                                    >
                                    </Form.Control>
                                    {/* 
                                    <Form.File 
                                        id='image-file'
                                        Label='Choose File'
                                        custom
                                        onChange={uploadFileHandler}
                                    >

                                    </Form.File> */}
                                    <Form.Group controlId="formFile" className="mb-3">
                                        {/* <Form.Label>Choose File</Form.Label> */}
                                        <Form.Control type="file" onChange={uploadFileHandler}/>
                                        {uploading && <Loader/>}
                                    </Form.Group>

                                </Form.Group>

                                <Form.Group controlId='brand'>
                                    <Form.Label> Brand </Form.Label>
                                    <Form.Control

                                        type='text'
                                        placeholder='Enter brand'
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                    >
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='countInStock'>
                                    <Form.Label> Stock </Form.Label>
                                    <Form.Control

                                        type='number'
                                        placeholder='Enter Stock'
                                        value={countInStock}
                                        onChange={(e) => setCountInStock(e.target.value)}
                                    >
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='category'>
                                    <Form.Label> Category </Form.Label>
                                    <Form.Control

                                        type='text'
                                        placeholder='Enter category'
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='description'>
                                    <Form.Label> Description </Form.Label>
                                    <Form.Control

                                        type='text'
                                        placeholder='Enter description'
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    >
                                    </Form.Control>
                                </Form.Group>


                                <Button type='submit' variant='primary'>
                                    Update
                                </Button>

                            </Form>
                        )
                }


            </FormContainer>
        </div>
    )
}

export default ProductEditScreen

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import products from '../products'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import { listProducts } from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import ProductCarousel from '../components/ProductCarousel'
import { useNavigate, useLocation } from 'react-router-dom'


function HomeScreen() {
  const dispatch = useDispatch()
  const productList = useSelector(state => state.productList)
  const { loading, error, products } = productList

  const history = useNavigate();
  let location = useLocation()
  let keyword = location.search
  console.log(keyword)

  useEffect(() => {
    dispatch(listProducts(keyword))
  }, [dispatch, keyword])

  return (
    <div>
      {!keyword && <ProductCarousel />}
      <h1>Latest products</h1>
      {loading ? <Loader />
        : error ? <Message variant='danger'>{error}</Message>
          :(
          <Row>
            {products.map(product => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          )
      }
    </div>
  )
}

export default HomeScreen

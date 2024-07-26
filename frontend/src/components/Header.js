import React from 'react'

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { LinkContainer } from 'react-router-bootstrap'

import { useDispatch, useSelector } from 'react-redux'
import {logout} from '../actions/userActions'

function Header() {

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin
  const dispatch = useDispatch()
  const logoutHandler = () => {
    // console.log('LOGOUT...')
    dispatch(logout()) 
  }

  return (
    <div>
      <header>
        <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>

          <Container>
            <LinkContainer to="/">
              <Navbar.Brand >Eshop</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav className="mr-auto">
                <LinkContainer to="/cart">
                  <Nav.Link ><i className='fas fa-shopping-cart'></i>Cart</Nav.Link>
                </LinkContainer>

                {userInfo ?
                  (
                    <NavDropdown title={userInfo.name} id='username'>

                      <LinkContainer to='/profile'>
                        <NavDropdown.Item> Profile </NavDropdown.Item>
                      </LinkContainer>

                      <NavDropdown.Item onClick={logoutHandler}> Logout </NavDropdown.Item>

                    </NavDropdown>
                  )
                  :
                  (
                    <LinkContainer to="/login">
                      <Nav.Link><i className='fas fa-user'></i>Login</Nav.Link>
                    </LinkContainer>
                  )
                }

              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    </div>
  )
}

export default Header
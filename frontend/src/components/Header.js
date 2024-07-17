import React from 'react'

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function Header() {
  return (
    <div>
      <header>
        <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>

          <Container>
            <Navbar.Brand href="/">Eshop</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav className="mr-auto">
                <Nav.Link href="/cart"><i className='fas fa-shopping-cart'></i>Cart</Nav.Link>
                <Nav.Link href="/login"><i className='fas fa-user'></i>Login</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    </div>
  )
}

export default Header
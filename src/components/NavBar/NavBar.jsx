import React from 'react';
import './NavBar.css';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import CartWidget from '../CartWidget/CartWidget';
import { NavLink, Link } from 'react-router-dom';

const NavBar = () => {
    const scrollToBottom = () => {
        window.scrollTo(0, document.documentElement.scrollHeight);
    };

    return (
        <Navbar collapseOnSelect expand="lg" className="navbar-custom z-50" bg="dark" variant="dark">
            <Container>
                <Link to='/' className='navbar-brand'>
                    <Navbar.Brand className="d-flex align-items-center">
                        <img
                            alt="Kuta logo"
                            src="/kuta.png"
                            width="90"
                            height="90"
                        />
                    </Navbar.Brand>
                </Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/about-us" className="nav-option">¿Quiénes somos?</Nav.Link>
                        <Nav.Link className="nav-option mr-6" onClick={scrollToBottom}>¿Cómo contactarnos?</Nav.Link>

                        <NavDropdown title="Categorías" id="collasible-nav-dropdown">
                            <NavDropdown.Item as={NavLink} to="/category/cafeteria" className="dropdown-item-custom">Cafetería</NavDropdown.Item>
                            <NavDropdown.Item as={NavLink} to="/category/licuados" className="dropdown-item-custom">Licuados</NavDropdown.Item>
                            <NavDropdown.Item as={NavLink} to="/category/jugos" className="dropdown-item-custom">Jugos</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item as={NavLink} to="/category/delicias" className="dropdown-item-custom">Delicias</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <Nav.Link as={NavLink} to="/more-details" className="nav-option">Más Detalles</Nav.Link>
                        <Nav.Link as={NavLink} to="/cart-container" className="nav-option"><CartWidget /></Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
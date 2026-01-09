import React from 'react';
import './NavBar.css';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import CartWidget from '../CartWidget/CartWidget';
import { NavLink, Link } from 'react-router-dom';

const NavBar = () => {
    const scrollToBottom = () => {
        window.scrollTo(0, document.documentElement.scrollHeight);
    };

    const scrollToMenu = (e) => {
        e.preventDefault();
        const menuSection = document.getElementById('menu');
        if (menuSection) {
            menuSection.scrollIntoView({ behavior: 'smooth' });
        }
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
                        <Nav.Link as={NavLink} to="/about-us" className="nav-option">
                            ¿Quiénes somos?
                        </Nav.Link>
                        <Nav.Link className="nav-option" onClick={scrollToMenu}>
                            Menú
                        </Nav.Link>
                        <Nav.Link className="nav-option" onClick={scrollToBottom}>
                            ¿Cómo contactarnos?
                        </Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link as={NavLink} to="/more-details" className="nav-option">
                            Más Detalles
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/cart-container" className="nav-option">
                            <CartWidget />
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
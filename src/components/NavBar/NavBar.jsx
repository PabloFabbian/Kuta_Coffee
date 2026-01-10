import React, { useState, useEffect } from 'react';
import './NavBar.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import CartWidget from '../CartWidget/CartWidget';
import { NavLink, Link } from 'react-router-dom';

const NavBar = () => {
    const [isMobile, setIsMobile] = useState(false);

    // Detectar el tamaño de pantalla
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 992); // Bootstrap lg breakpoint
        };

        // Verificar al montar
        checkScreenSize();

        // Escuchar cambios en el tamaño de la ventana
        window.addEventListener('resize', checkScreenSize);

        // Limpiar listener
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    };

    const scrollToMenu = (e) => {
        e.preventDefault();
        const menuSection = document.getElementById('menu');
        if (menuSection) {
            menuSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Renderizado para Desktop/Laptop
    const renderDesktopNav = () => (
        <Navbar collapseOnSelect expand="lg" className="navbar-custom" bg="dark" variant="dark">
            <Container>
                <Link to='/' className='navbar-brand'>
                    <Navbar.Brand className="d-flex align-items-center">
                        <img
                            alt="Kuta logo"
                            src="/kuta.png"
                            width="80"
                            height="80"
                            className="nav-logo"
                        />
                    </Navbar.Brand>
                </Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/about-us" className="nav-option">
                            ¿Quiénes somos?
                        </Nav.Link>
                        <Nav.Link
                            className="nav-option mr-3"
                            onClick={scrollToBottom}
                        >
                            ¿Cómo contactarnos?
                        </Nav.Link>

                        <NavDropdown
                            title="Categorías"
                            id="collasible-nav-dropdown"
                            className="nav-dropdown-custom"
                        >
                            <NavDropdown.Item
                                as={NavLink}
                                to="/category/cafeteria"
                                className="dropdown-item-custom"
                            >
                                Cafetería
                            </NavDropdown.Item>
                            <NavDropdown.Item
                                as={NavLink}
                                to="/category/licuados"
                                className="dropdown-item-custom"
                            >
                                Licuados
                            </NavDropdown.Item>
                            <NavDropdown.Item
                                as={NavLink}
                                to="/category/jugos"
                                className="dropdown-item-custom"
                            >
                                Jugos
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item
                                as={NavLink}
                                to="/category/delicias"
                                className="dropdown-item-custom"
                            >
                                Delicias
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <Nav.Link
                            as={NavLink}
                            to="/more-details"
                            className="nav-option"
                        >
                            Más Detalles
                        </Nav.Link>
                        <Nav.Link
                            as={NavLink}
                            to="/cart-container"
                            className="nav-option"
                        >
                            <CartWidget />
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );

    // Renderizado para Mobile
    const renderMobileNav = () => (
        <Navbar collapseOnSelect expand="lg" className="navbar-custom" bg="dark" variant="dark">
            <Container>
                <div className="d-flex align-items-center w-100">
                    {/* Logo */}
                    <Link to='/' className='navbar-brand me-auto'>
                        <Navbar.Brand className="d-flex align-items-center">
                            <img
                                alt="Kuta logo"
                                src="/kuta.png"
                                width="70"
                                height="70"
                                className="nav-logo"
                            />
                        </Navbar.Brand>
                    </Link>

                    {/* Carrito en mobile */}
                    <div className="mobile-cart d-lg-none me-3">
                        <NavLink to="/cart-container" className="nav-option">
                            <CartWidget />
                        </NavLink>
                    </div>

                    {/* Botón hamburguesa */}
                    <Navbar.Toggle
                        aria-controls="responsive-navbar-nav"
                        className="border-0 custom-toggler"
                    />
                </div>

                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link
                            className="nav-option"
                            onClick={scrollToMenu}
                        >
                            Menú
                        </Nav.Link>
                        <Nav.Link
                            as={NavLink}
                            to="/about-us"
                            className="nav-option"
                        >
                            ¿Quiénes somos?
                        </Nav.Link>
                        <Nav.Link
                            className="nav-option"
                            onClick={scrollToBottom}
                        >
                            ¿Cómo contactarnos?
                        </Nav.Link>
                        <Nav.Link
                            as={NavLink}
                            to="/more-details"
                            className="nav-option"
                        >
                            Más Detalles
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );

    return isMobile ? renderMobileNav() : renderDesktopNav();
};

export default NavBar;
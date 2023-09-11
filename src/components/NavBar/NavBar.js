import React from 'react'
import './NavBar.css'

import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'

import CartWidget from '../CartWidget/CartWidget'
import { NavLink, Link } from 'react-router-dom'

const NavBar = () => {
    const scrollToBottom = () => {
        window.scrollTo(0, document.documentElement.scrollHeight);
    };

    return (
        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
            <Container>
                <Link to='/' className='kuta'>
                    <Navbar.Brand>Kuta - <span className='cafe'>Café de Especialidad</span></Navbar.Brand>
                </Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link>
                            <NavLink to={`/about-us`} className={({isActive}) => isActive ? 'ActiveOption' : 'Option'}>¿Quienes somos?</NavLink>
                        </Nav.Link>
                        <Nav.Link>
                            <NavLink onClick={scrollToBottom} className={({isActive}) => 'Option'}>Como contactarnos</NavLink>
                        </Nav.Link>

                        <NavDropdown title="Categorías" id="collasible-nav-dropdown">
                            <NavDropdown.Item>
                                <NavLink id='DropDown' to={`/category/cafeteria`} className={({isActive}) => isActive ? 'ActiveOption' : 'Option'}>Cafetería ~</NavLink>
                            </NavDropdown.Item>
                            <NavDropdown.Item>
                                <NavLink id='DropDown' to={`/category/licuados`} className={({isActive}) => isActive ? 'ActiveOption' : 'Option'}>Licuados ~</NavLink>
                            </NavDropdown.Item>
                            <NavDropdown.Item>
                                <NavLink id='DropDown' to={`/category/jugos`} className={({isActive}) => isActive ? 'ActiveOption' : 'Option'}>Jugos ~</NavLink>
                            </NavDropdown.Item>
                            
                            <NavDropdown.Divider />
                            
                            <NavDropdown.Item>
                                <NavLink id='DropDown' to={`/category/delicias`} className={({isActive}) => isActive ? 'ActiveOption' : 'Option'}>Delicias ~</NavLink>
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <Nav.Link>
                            <NavLink to={`/category/Details`} className={({isActive}) => isActive ? 'ActiveOption' : 'Option'}>Mas Detalles</NavLink>
                        </Nav.Link>
                            <NavLink eventKey={2} href="#desk" to={`/cart-container`} className={({isActive}) => isActive ? 'ActiveOption' : 'Option'}><CartWidget/></NavLink>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar
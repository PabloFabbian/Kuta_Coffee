import React from 'react'
import './MoreDetails.css'
import { Container, Row, Col, Card } from 'react-bootstrap'

const MoreDetails = () => {
    return (
    <div className="more-details">
        <Container>
            <h2 className="section-title">Programa de Lealtad y Ofertas</h2>
            <hr></hr>
            <Row>
                <Col md={6}>
                    <Card className="offering-card">
                        <Card.Body>
                            <h3>Oferta Especial</h3>
                            <p>¡Únete a nuestro programa de lealtad y obtén descuentos exclusivos en tu café favorito!</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="offering-card" id='Day-Offer'>
                        <Card.Body>
                            <h3>Oferta del Día</h3>
                            <p>¡No te pierdas nuestra oferta del día en deliciosos pasteles y bocadillos!</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Container className="sustainability-container">
        <h2 className="section-title">Información sobre Sostenibilidad</h2>
            <Row>
                <Col>
                    <p>Nos preocupamos por el medio ambiente y utilizamos granos de café de comercio justo. Descubre más sobre nuestras iniciativas sostenibles.</p>
                </Col>
            </Row>
        </Container>

        <Container className="private-events-container" id='Private-Events'>
            <h2 className="section-title">Reservas para Eventos Privados</h2>
            <Row>
                <Col>
                    <p>¿Planeas un evento especial? ¡Reserva nuestro espacio para eventos privados y haz que sea inolvidable!</p>
                </Col>
            </Row>
        </Container>

            
        </Container>


    </div>
    );
}

export default MoreDetails
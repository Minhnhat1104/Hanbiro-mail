// @ts-nocheck
import React from "react"
import { Container, Row, Col } from "reactstrap"
import { getMailAppVersion } from "utils"

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            {/* <Col md={6}>Version {process.env.REACT_APP_VERSION}</Col> */}
            <Col md={6}>
              <div className="text-sm-end d-none d-sm-block">
                {/* © {new Date().getFullYear()} - Mail App */}
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  )
}

export default Footer

import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";  // Use NavLink instead of Link

import payfilogo from '../Images/payfilogo.f8eb1a1cfdd4d2250e5f.ico';

const HeadersFile = () => {
  return (
    <Navbar bg="light" expand="md" className="p-3">
      <Container>
        {/* Logo on the left side */}
        <Navbar.Brand as={NavLink} to="/" className="me-2" style={{ marginLeft: "-3vh" }}>
          <img
            src={payfilogo}
            alt="Logo"
            className="img-fluid"
            style={{ height: "70px" }}
          />
        </Navbar.Brand>

        {/* Hamburger menu toggle */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Navbar links */}
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Align both Home and Terms & Conditions to the right */}
          <Nav className="ms-auto">
            <Nav.Link
              as={NavLink}
              to="/"
              className="me-3 custom-nav-link"
              style={({ isActive }) => ({ color: isActive ? "blue" : "inherit", fontWeight: "bold" })}  // Change color when active
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/services"
              className="custom-nav-link"
              style={({ isActive }) => ({ color: isActive ? "blue" : "inherit", fontWeight: "bold", whiteSpace: "nowrap" })}  // Change color when active
            >
              Services
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/contact"
              className="custom-nav-link"
              style={({ isActive }) => ({ color: isActive ? "blue" : "inherit", fontWeight: "bold", whiteSpace: "nowrap" })}  // Change color when active
            >
              Contact Us
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/terms-and-conditions"
              className="custom-nav-link font-inter"
              style={({ isActive }) => ({ color: isActive ? "blue" : "inherit", fontWeight: "bold", whiteSpace: "nowrap" })}  // Change color when active
            >
              Terms & Conditions
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default HeadersFile;

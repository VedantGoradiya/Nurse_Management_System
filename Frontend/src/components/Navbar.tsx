/**
 * Navbar component.
 * This component is used to display the navbar.
 * It is used to navigate to the home page, wards page and to logout.
 * It is also used to display the signup and login buttons if the user is not logged in.
 */

import { useContext } from "react";
import UserContext from "../Context/userContext";

import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

const CustomNavbar = () => {
  const navigate = useNavigate();

  //Getting the token and user from the local storage to check if the user is logged in.
  const token = localStorage.getItem("token");
  const { user, setUser } = useContext(UserContext);

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Nurse Management System
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* If the user is logged in, the navbar will display the home and wards links. */}
          {(user?.email || token) && (
            <Nav className="me-auto">
              <Nav.Link onClick={() => navigate("/")}>Home</Nav.Link>
              <Nav.Link onClick={() => navigate("/wards")}>Wards</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>

        <Navbar.Collapse className="justify-content-end">
          {/* If the user is logged in, the navbar will display the logout button. */}
          {user?.email || token ? (
            <Nav.Link
              onClick={() => {
                setUser(null);
                localStorage.removeItem("token");
                navigate("/login");
              }}
            >
              Logout
            </Nav.Link>
          ) : (
            // If the user is not logged in, the navbar will display the signup and login buttons.
            <Nav>
              <Nav.Link onClick={() => navigate("/signup")}>Sign Up</Nav.Link>
              <Nav.Link onClick={() => navigate("/login")}>Sign In</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;

import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import logo from '../../../public/image/car_logo_PNG1646-1024x544.png'

const Header = () =>  {
    return (
      <Navbar className='bg-light' expand="lg" variant="light" sticky="top">
        <Container className='mt-3'>
          <Navbar.Brand className='h6 mb-0 py-0' href="/">
            <img
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top "
              alt="Logo"
            />
            CARZ
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="mx-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/all-toys">All Toys</Nav.Link>
              <Nav.Link href="/my-toys">My Toys</Nav.Link>
              <Nav.Link href="/add-toy">Add A Toy</Nav.Link>
              <Nav.Link href="/blogs">Blogs</Nav.Link>
            </Nav>
            <Nav>
              <NavDropdown title={<img src="/profile-picture.png" alt="User Profile" />} id="user-dropdown">
                
                <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
  

export default Header;
import { Navbar, Nav, Container } from 'react-bootstrap';

const Header = () => {
  return (
    <Navbar  className='py-3'  expand="lg" >
      <Container>
        <Navbar.Brand className='text-dark d-flex justify-content-center align-items-center' href="#home">
          <img
            src="http://clipart-library.com/images_k/car-transparent-background/car-transparent-background-22.png"
            width="70"
            height="60"
            className="d-inline-block align-top me-2"
            alt="Website Logo"
          />
          {' CARZ'}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto ">
            <Nav.Link href="#home" className='text-dark'>Home</Nav.Link>
            <Nav.Link href="#all-toys" className='text-dark'>All Toys</Nav.Link>
            <Nav.Link className='d-none text-dark' href="#my-toys">My Toys</Nav.Link>
            <Nav.Link className='d-none text-dark' href="#add-toy">Add A Toy</Nav.Link>
            <Nav.Link href="#blogs" className='text-dark'>Blogs</Nav.Link>
          </Nav>
          <Nav>
            <button className='btn btn-primary px-4'>Login</button>
            {/* <NavDropdown
              align="end"
              title={<img src="profile.jpg" alt="User Profile" className="profile-picture" />}
            >
             
          
              <NavDropdown.Item href="#logout">Logout</NavDropdown.Item>
            </NavDropdown> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

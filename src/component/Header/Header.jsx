import { useContext} from 'react';
import {Link} from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { AuthContext } from '../Provider/Provider';
import { useNavigate } from 'react-router-dom';
import './Header.css'
const Header = () => {




// navigating to login page
  const navigate = useNavigate();
  const handleNavigateLogin = () =>{
    navigate('/login')
  }




  
 





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
            <Link  className='text-dark nav_li'>Home</Link>
            <Link to='all_toy' className='text-dark nav_li'>All Toys</Link>
            <Link className='d-none text-dark nav_li' >My Toys</Link>
            <Link className='d-none text-dark nav_li' >Add A Toy</Link>
            <Link className='text-dark nav_li'>Blogs</Link>
            
          </Nav>
          <Nav>
            <button onClick={handleNavigateLogin}  className='btn btn-primary px-4'>Login</button>
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

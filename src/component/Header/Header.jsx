import { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { AuthContext } from '../Provider/Provider';
import { useNavigate } from 'react-router-dom';
import './Header.css'




const Header = () => {


  // context API===================
  const { user, handleLogout, photoUrl, userRole } = useContext(AuthContext);







  const location = useLocation();
  console.log(location.pathname);


  // navigating to login page
  const navigate = useNavigate();
  const handleNavigateLogin = () => {
    navigate('/login')
  }










  return (
    <Navbar className='py-3' expand="lg" >
      <Container>
        <Navbar.Brand className='text-dark' href="#home">
          CARZ
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto ">
            {userRole === 'shop_owner' ? (
              <>
                <Link to={`/shops/${user?.email}`} className={location.pathname === `/shops/${user?.email}` ? 'nav_li text-primary' : 'text-dark nav_li'}>Our Shop</Link>
                <Link to='/toy_table' className={location.pathname == '/toy_table' ? 'nav_li text-primary' : 'text-dark nav_li'}>Our Products</Link>
                <Link to='/shop-dashboard' className={location.pathname == '/shop-dashboard' ? 'nav_li text-primary' : 'text-dark nav_li'}>Dashboard</Link>
              </>
            ) : (
              <>
                <Link to='/' className={location.pathname == '/' ? 'nav_li text-primary' : 'text-dark nav_li'}>Home</Link>
                <Link to='all_toy' className={location.pathname == '/all_toy' ? 'nav_li text-primary' : 'text-dark nav_li'}>All Toys</Link>
                <Link to='/shops' className={location.pathname == '/shops' ? 'nav_li text-primary' : 'text-dark nav_li'}>Shops</Link>
                <Link to='/toy_table' className={!user ? 'd-none text-dark nav_li' : `${location.pathname == '/toy_table' ? 'd-block text-primary nav_li' : 'd-block text-dark nav_li'}`} >My Toys</Link>
                <Link to='/list-old-toy' className={!user ? 'd-none text-dark nav_li' : `${location.pathname == '/list-old-toy' ? 'd-block text-primary nav_li' : 'd-block text-dark nav_li'}`} >List Old Toy</Link>
                <Link to='/chat' className={!user ? 'd-none text-dark nav_li' : `${location.pathname == '/chat' || location.pathname.startsWith('/chat/') ? 'd-block text-primary nav_li' : 'd-block text-dark nav_li'}`} >Chat</Link>
                <Link to='/faq' className={location.pathname == '/faq' ? 'nav_li text-primary' : 'text-dark nav_li'}>FAQ</Link>
              </>
            )}
          </Nav>
          <Nav>
            {!user ? (
              <button onClick={handleNavigateLogin} className='btn btn-primary px-4'>Login</button>
            ) : userRole === 'shop_owner' ? (
              <button 
                onClick={() => {
                  handleLogout();
                  navigate('/login');
                }} 
                className='btn btn-outline-primary px-4'
              >
                Logout
              </button>
            ) : (
              <button 
                onClick={() => {
                  handleLogout();
                  navigate('/login');
                }} 
                className='btn btn-outline-primary px-4'
              >
                Logout
              </button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

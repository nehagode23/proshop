import {Navbar,Nav,Container, Badge, NavDropdown} from 'react-bootstrap';
import {FaShoppingCart,FaUser} from 'react-icons/fa'
import {LinkContainer} from 'react-router-bootstrap'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/userApiSlice';
import {logout} from '../slices/authSlice';

const Header = () => {

    const{cartItems}= useSelector((state)=>state.cart);
    const{userInfo}= useSelector((state)=>state.auth);

    const navigate=useNavigate();
    const dispatch= useDispatch();

    const [logoutApiCall] =useLogoutMutation();

    const logoutHandler=async()=>{
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/login');
        } catch (error) {
            
        }
    }

  return (
    <header>
        <Navbar bg="dark" variant='dark' expand='md' collapseOnSelect> 
            <Container>
                <Link to="/">
                <Navbar.Brand href='/'>
                <img src={logo}></img>Proshop
                </Navbar.Brand>
                </Link>
                <Navbar.Toggle aria-controls='basic-navbar-nav'/>
                <Navbar.Collapse id='basic-navbar-nav'>
                    <Nav className='ms-auto'>
                        <Link to='/cart'>
                        <Nav.Link href='/cart'><FaShoppingCart/>Cart {cartItems.length>0 &&(
                            <Badge pill bg='success' style={{marginLeft:'5px'}}>
                                {cartItems.reduce((a,c)=>a+c.qty,0)}
                            </Badge>
                        )}</Nav.Link>
                        </Link>
                    </Nav>
                    <Nav className='ms-auto'>
                        {userInfo?(
                            <NavDropdown title={userInfo.name} id='username'>
                                <Link to='/profile'>
                                <NavDropdown.Item> Profile</NavDropdown.Item>
                                </Link>
                                <NavDropdown.Item onClick={logoutHandler}> Logout</NavDropdown.Item>
                            </NavDropdown>
                        ):(
                            <Link to='/login'>
                        <Nav.Link href='/sign-in'><FaUser/>Sign in</Nav.Link>
                    </Link>)}
                    
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>
  )
}

export default Header
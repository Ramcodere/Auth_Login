import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaPen } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { theme } from '../styles/GlobalStyles';

const NavbarContainer = styled.nav`
  background-color: #fff;
  box-shadow: ${theme.shadows.small};
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavbarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  
  &:hover {
    color: ${theme.colors.primary};
  }
`;

const MenuIcon = styled.div`
  display: none;
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    display: block;
  }
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    position: absolute;
    top: 70px;
    left: ${({ $isOpen }) => ($isOpen ? '0' : '-100%')};
    background-color: #fff;
    width: 100%;
    box-shadow: ${theme.shadows.medium};
    transition: left 0.3s ease-in-out;
    padding: 1rem 0;
    z-index: 99;
  }
`;

const NavItem = styled(Link)`
  margin: 0 0.8rem;
  color: ${theme.colors.text};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  
  &:hover {
    color: ${theme.colors.primary};
  }
  
  svg {
    margin-right: 0.5rem;
  }
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    margin: 0.8rem 0;
  }
`;

const Button = styled.button`
  background-color: ${theme.colors.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: ${theme.borderRadius.small};
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: ${theme.colors.secondary};
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };
  
  return (
    <NavbarContainer>
      <NavbarContent>
        <Logo to="/">Blog Platform</Logo>
        
        <MenuIcon onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </MenuIcon>
        
        <NavItems $isOpen={isOpen}>
          <NavItem to="/" onClick={() => setIsOpen(false)}>Home</NavItem>
          
          {currentUser ? (
            <>
              <NavItem to="/create-post" onClick={() => setIsOpen(false)}>
                <FaPen /> New Post
              </NavItem>
              <NavItem to="/profile" onClick={() => setIsOpen(false)}>
                <FaUser /> Profile
              </NavItem>
              <Button onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </Button>
            </>
          ) : (
            <>
              <NavItem to="/login" onClick={() => setIsOpen(false)}>Login</NavItem>
              <NavItem to="/register" onClick={() => setIsOpen(false)}>Register</NavItem>
            </>
          )}
        </NavItems>
      </NavbarContent>
    </NavbarContainer>
  );
};

export default Navbar; 
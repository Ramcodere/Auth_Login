import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/GlobalStyles';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background-color: ${theme.colors.lightGrey};
  padding: 2rem 0;
  margin-top: 2rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    text-align: center;
  }
`;

const FooterSection = styled.div`
  flex: 1;
  min-width: 250px;
  margin-bottom: 1.5rem;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    margin-bottom: 2rem;
  }
`;

const FooterTitle = styled.h3`
  color: ${theme.colors.primary};
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const FooterLink = styled(Link)`
  display: block;
  color: ${theme.colors.text};
  margin-bottom: 0.5rem;
  text-decoration: none;
  
  &:hover {
    color: ${theme.colors.primary};
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #ddd;
  margin-top: 1rem;
  color: ${theme.colors.darkGrey};
  font-size: 0.9rem;
  width: 100%;
`;

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>Blog Platform</FooterTitle>
          <p>Share your thoughts and ideas with the world through our simple and elegant blogging platform.</p>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Quick Links</FooterTitle>
          <FooterLink to="/">Home</FooterLink>
          <FooterLink to="/login">Login</FooterLink>
          <FooterLink to="/register">Register</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Contact Us</FooterTitle>
          <p>Email: support@blogplatform.com</p>
          <p>Phone: (123) 456-7890</p>
        </FooterSection>
        
        <Copyright>
          © {year} Blog Platform. All rights reserved.
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer; 
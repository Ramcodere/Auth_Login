import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/GlobalStyles';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { FaSignInAlt } from 'react-icons/fa';

const LoginContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.medium};
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const LoginTitle = styled.h1`
  color: ${theme.colors.primary};
  margin-bottom: 1rem;
`;

const LoginSubtitle = styled.p`
  color: ${theme.colors.darkGrey};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  margin-top: 1rem;
`;

const RegisterLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  
  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorAlert = styled.div`
  background-color: #fddddd;
  color: ${theme.colors.danger};
  padding: 1rem;
  border-radius: ${theme.borderRadius.small};
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  text-align: center;
`;

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear errors when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      const result = await login(formData);
      
      setIsSubmitting(false);
      
      if (result.success) {
        navigate('/');
      }
    }
  };
  
  return (
    <LoginContainer>
      <LoginHeader>
        <LoginTitle>Welcome Back</LoginTitle>
        <LoginSubtitle>Sign in to continue to the blog platform</LoginSubtitle>
      </LoginHeader>
      
      {error && <ErrorAlert>{error}</ErrorAlert>}
      
      <Form onSubmit={handleSubmit}>
        <Input 
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
        
        <Input 
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />
        
        <ButtonContainer>
          <Button 
            type="submit" 
            fullWidth
            disabled={isSubmitting}
          >
            <FaSignInAlt /> {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </ButtonContainer>
      </Form>
      
      <RegisterLink>
        Don't have an account? <Link to="/register">Register</Link>
      </RegisterLink>
    </LoginContainer>
  );
};

export default Login; 
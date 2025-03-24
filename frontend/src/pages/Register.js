import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/GlobalStyles';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { FaUserPlus } from 'react-icons/fa';

const RegisterContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.medium};
`;

const RegisterHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const RegisterTitle = styled.h1`
  color: ${theme.colors.primary};
  margin-bottom: 1rem;
`;

const RegisterSubtitle = styled.p`
  color: ${theme.colors.darkGrey};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  margin-top: 1rem;
`;

const LoginLink = styled.div`
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

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, error } = useAuth();
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
    
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      const { username, email, password } = formData;
      const result = await register({ username, email, password });
      
      setIsSubmitting(false);
      
      if (result.success) {
        navigate('/');
      }
    }
  };
  
  return (
    <RegisterContainer>
      <RegisterHeader>
        <RegisterTitle>Create Account</RegisterTitle>
        <RegisterSubtitle>Join our blog platform and start sharing your thoughts</RegisterSubtitle>
      </RegisterHeader>
      
      {error && <ErrorAlert>{error}</ErrorAlert>}
      
      <Form onSubmit={handleSubmit}>
        <Input 
          label="Username"
          type="text"
          name="username"
          placeholder="Choose a username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          required
        />
        
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
          placeholder="Choose a password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          helperText="Must be at least 6 characters long"
          required
        />
        
        <Input 
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />
        
        <ButtonContainer>
          <Button 
            type="submit" 
            fullWidth
            disabled={isSubmitting}
          >
            <FaUserPlus /> {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>
        </ButtonContainer>
      </Form>
      
      <LoginLink>
        Already have an account? <Link to="/login">Login</Link>
      </LoginLink>
    </RegisterContainer>
  );
};

export default Register; 
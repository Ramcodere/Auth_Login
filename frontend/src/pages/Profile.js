import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/GlobalStyles';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import { FaUser, FaSave } from 'react-icons/fa';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const ProfileHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const ProfileTitle = styled.h1`
  margin-bottom: 0.5rem;
  color: ${theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const ProfileForm = styled.form`
  background-color: white;
  padding: 2rem;
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.small};
`;

const ButtonContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
`;

const SuccessMessage = styled.div`
  background-color: ${theme.colors.success}20;
  border: 1px solid ${theme.colors.success};
  border-radius: ${theme.borderRadius.small};
  color: ${theme.colors.success};
  padding: 1rem;
  margin-bottom: 1rem;
`;

const Profile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    bio: currentUser?.bio || '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
    setSuccess(false);
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const result = await updateProfile(formData);
      
      if (result.success) {
        setSuccess(true);
        window.scrollTo(0, 0);
      } else {
        setErrors(prev => ({
          ...prev,
          form: result.message
        }));
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        form: 'Failed to update profile'
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileTitle>
          <FaUser /> My Profile
        </ProfileTitle>
      </ProfileHeader>
      
      <ProfileForm onSubmit={handleSubmit}>
        {success && (
          <SuccessMessage>
            Profile updated successfully!
          </SuccessMessage>
        )}
        
        {errors.form && (
          <Input
            error={errors.form}
            style={{ marginBottom: '1rem' }}
          />
        )}
        
        <Input
          id="username"
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          required
        />
        
        <Input
          id="email"
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
        
        <Input
          id="bio"
          label="Bio"
          name="bio"
          type="textarea"
          value={formData.bio}
          onChange={handleChange}
          helperText="Tell us a bit about yourself"
        />
        
        <ButtonContainer>
          <Button 
            type="submit" 
            disabled={loading}
            icon={<FaSave />}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </ButtonContainer>
      </ProfileForm>
    </ProfileContainer>
  );
};

export default Profile; 
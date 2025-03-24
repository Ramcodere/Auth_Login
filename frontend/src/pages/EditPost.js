import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/GlobalStyles';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Input from '../components/Input';
import Button from '../components/Button';
import { FaEdit, FaSave, FaTags } from 'react-icons/fa';

const EditPostContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const EditPostHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const EditPostTitle = styled.h1`
  margin-bottom: 0.5rem;
  color: ${theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const EditPostSubtitle = styled.p`
  color: ${theme.colors.darkGrey};
`;

const PostForm = styled.form`
  background-color: white;
  padding: 2rem;
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.small};
`;

const TagsContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const TagsLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${theme.colors.text};
`;

const TagsInput = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: ${theme.borderRadius.small};
  min-height: 45px;
  
  &:focus-within {
    border-color: ${theme.colors.primary};
  }
`;

const Tag = styled.div`
  background-color: ${theme.colors.primary};
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: ${theme.borderRadius.small};
  display: flex;
  align-items: center;
  
  button {
    background: none;
    border: none;
    color: white;
    font-size: 0.8rem;
    cursor: pointer;
    margin-left: 0.3rem;
  }
`;

const TagInputField = styled.input`
  flex: 1;
  border: none;
  outline: none;
  min-width: 100px;
  padding: 0.2rem;
  font-size: 1rem;
`;

const ButtonContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 3rem;
`;

const API_URL = 'http://localhost:5002/api';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, getAuthHeader } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: []
  });
  const [currentTag, setCurrentTag] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/posts/${id}`);
        
        // Check if current user is the author
        if (!isAuthenticated || currentUser._id !== response.data.author._id) {
          navigate(`/posts/${id}`);
          return;
        }
        
        setFormData({
          title: response.data.title,
          content: response.data.content,
          tags: response.data.tags || []
        });
      } catch (error) {
        console.error('Error fetching post:', error);
        setErrors({ form: 'Failed to load post. It may have been deleted or is unavailable.' });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    if (isAuthenticated) {
      fetchPost();
    } else {
      navigate('/login');
    }
  }, [id, isAuthenticated, currentUser, navigate]);

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
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(currentTag.trim().toLowerCase())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, currentTag.trim().toLowerCase()]
        }));
      }
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSaving(true);
    
    try {
      await axios.put(
        `${API_URL}/posts/${id}`, 
        formData,
        getAuthHeader()
      );
      
      navigate(`/posts/${id}`);
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        form: error.response?.data?.message || 'Failed to update post'
      }));
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <h2>Loading post...</h2>
      </LoadingContainer>
    );
  }

  return (
    <EditPostContainer>
      <EditPostHeader>
        <EditPostTitle>
          <FaEdit /> Edit Post
        </EditPostTitle>
        <EditPostSubtitle>
          Update your post content and details
        </EditPostSubtitle>
      </EditPostHeader>
      
      <PostForm onSubmit={handleSubmit}>
        {errors.form && (
          <Input
            error={errors.form}
            style={{ marginBottom: '1rem' }}
          />
        )}
        
        <Input
          id="title"
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          required
        />
        
        <Input
          id="content"
          label="Content"
          name="content"
          type="textarea"
          value={formData.content}
          onChange={handleChange}
          error={errors.content}
          required
          helperText="Write your post content here. Markdown is supported."
        />
        
        <TagsContainer>
          <TagsLabel>
            <FaTags style={{ marginRight: '0.5rem' }} />
            Tags
          </TagsLabel>
          <TagsInput>
            {formData.tags.map(tag => (
              <Tag key={tag}>
                {tag}
                <button type="button" onClick={() => removeTag(tag)}>×</button>
              </Tag>
            ))}
            <TagInputField
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Press enter to add tags..."
            />
          </TagsInput>
        </TagsContainer>
        
        <ButtonContainer>
          <Button 
            type="submit" 
            disabled={saving}
            icon={<FaSave />}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </ButtonContainer>
      </PostForm>
    </EditPostContainer>
  );
};

export default EditPost; 
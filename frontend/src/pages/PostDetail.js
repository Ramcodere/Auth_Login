import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { theme } from '../styles/GlobalStyles';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { FaHeart, FaRegHeart, FaEdit, FaTrash, FaUser, FaClock, FaTag } from 'react-icons/fa';

const PostDetailContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: ${theme.colors.primary};
  margin-bottom: 1rem;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const PostCard = styled.div`
  background-color: white;
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.small};
  overflow: hidden;
  margin-bottom: 2rem;
`;

const PostImage = styled.div`
  width: 100%;
  height: 300px;
  background-image: ${({ $image }) => $image ? `url(${$image})` : 'none'};
  background-size: cover;
  background-position: center;
  background-color: ${({ $image }) => $image ? 'transparent' : theme.colors.lightGrey};
  display: ${({ $image }) => $image ? 'block' : 'none'};
`;

const PostContent = styled.div`
  padding: 2rem;
`;

const PostTitle = styled.h1`
  margin-bottom: 1rem;
  color: ${theme.colors.text};
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  color: ${theme.colors.darkGrey};
  font-size: 0.9rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const PostMetaItem = styled.div`
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.3rem;
  }
`;

const PostBody = styled.div`
  line-height: 1.6;
  margin-bottom: 1.5rem;
  white-space: pre-wrap;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Tag = styled(Link)`
  background-color: ${theme.colors.lightGrey};
  color: ${theme.colors.darkGrey};
  padding: 0.3rem 0.8rem;
  border-radius: ${theme.borderRadius.small};
  font-size: 0.9rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.3rem;
  }
  
  &:hover {
    background-color: ${theme.colors.primary};
    color: white;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const LikeButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ $liked }) => $liked ? theme.colors.danger : theme.colors.darkGrey};
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    color: ${theme.colors.danger};
  }
`;

const ErrorMessage = styled.div`
  background-color: ${theme.colors.danger}20;
  border: 1px solid ${theme.colors.danger};
  color: ${theme.colors.danger};
  padding: 1rem;
  border-radius: ${theme.borderRadius.small};
  margin-bottom: 2rem;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 3rem;
`;

const CommentsSection = styled.div`
  margin-top: 2rem;
`;

const CommentsSectionTitle = styled.h2`
  margin-bottom: 1.5rem;
  color: ${theme.colors.primary};
  font-size: 1.5rem;
`;

const API_URL = 'http://localhost:5002/api';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, getAuthHeader } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/posts/${id}`);
        setPost(response.data);
        
        // Check if user has liked this post
        if (isAuthenticated && response.data.likes) {
          setLiked(response.data.likes.includes(currentUser._id));
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load post. It may have been deleted or is unavailable.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id, isAuthenticated, currentUser]);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      const response = await axios.post(
        `${API_URL}/posts/${id}/like`, 
        {},
        getAuthHeader()
      );
      
      setLiked(!liked);
      setPost(prev => ({
        ...prev,
        likeCount: response.data.likeCount
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };
  
  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }
    
    try {
      await axios.delete(
        `${API_URL}/posts/${id}`,
        getAuthHeader()
      );
      
      navigate('/');
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post. Please try again.');
    }
  };
  
  if (loading) {
    return (
      <LoadingContainer>
        <h2>Loading post...</h2>
      </LoadingContainer>
    );
  }
  
  if (error) {
    return (
      <PostDetailContainer>
        <BackLink to="/">← Back to Posts</BackLink>
        <ErrorMessage>{error}</ErrorMessage>
      </PostDetailContainer>
    );
  }
  
  if (!post) {
    return (
      <PostDetailContainer>
        <BackLink to="/">← Back to Posts</BackLink>
        <ErrorMessage>Post not found</ErrorMessage>
      </PostDetailContainer>
    );
  }
  
  const isAuthor = isAuthenticated && currentUser._id === post.author._id;
  
  return (
    <PostDetailContainer>
      <BackLink to="/">← Back to Posts</BackLink>
      
      <PostCard>
        {post.featuredImage && (
          <PostImage $image={post.featuredImage} />
        )}
        
        <PostContent>
          <PostTitle>{post.title}</PostTitle>
          
          <PostMeta>
            <PostMetaItem>
              <FaUser /> {post.author.username}
            </PostMetaItem>
            <PostMetaItem>
              <FaClock /> {formatDate(post.createdAt)}
            </PostMetaItem>
            <PostMetaItem>
              <FaHeart /> {post.likeCount || 0} likes
            </PostMetaItem>
          </PostMeta>
          
          {post.tags && post.tags.length > 0 && (
            <TagsContainer>
              {post.tags.map(tag => (
                <Tag key={tag} to={`/?tag=${tag}`}>
                  <FaTag /> {tag}
                </Tag>
              ))}
            </TagsContainer>
          )}
          
          <PostBody>{post.content}</PostBody>
          
          <ActionButtons>
            <LikeButton 
              onClick={handleLikeToggle}
              $liked={liked}
            >
              {liked ? <FaHeart /> : <FaRegHeart />} 
              {liked ? 'Liked' : 'Like'}
            </LikeButton>
            
            {isAuthor && (
              <>
                <Button 
                  variant="outline"
                  size="small"
                  icon={<FaEdit />}
                  onClick={() => navigate(`/edit-post/${id}`)}
                >
                  Edit
                </Button>
                <Button 
                  variant="danger"
                  size="small"
                  icon={<FaTrash />}
                  onClick={handleDeletePost}
                >
                  Delete
                </Button>
              </>
            )}
          </ActionButtons>
        </PostContent>
      </PostCard>
      
      <CommentsSection>
        <CommentsSectionTitle>Comments</CommentsSectionTitle>
        {/* Comments component would go here */}
        <p>Comment functionality coming soon!</p>
      </CommentsSection>
    </PostDetailContainer>
  );
};

export default PostDetail; 
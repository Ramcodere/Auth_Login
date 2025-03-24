import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/GlobalStyles';
import { Link } from 'react-router-dom';

const CardContainer = styled.div`
  background-color: #fff;
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.small};
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${theme.shadows.medium};
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 200px;
  background-image: url(${({ $src }) => $src || 'https://via.placeholder.com/400x200'});
  background-size: cover;
  background-position: center;
`;

const CardContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled(Link)`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${theme.colors.text};
  text-decoration: none;
  
  &:hover {
    color: ${theme.colors.primary};
  }
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: ${theme.colors.darkGrey};
  margin-bottom: 1rem;
`;

const CardAuthor = styled.span`
  font-weight: 500;
`;

const CardDate = styled.span`
  &::before {
    content: '•';
    margin: 0 0.5rem;
  }
`;

const CardExcerpt = styled.p`
  margin-bottom: 1rem;
  color: ${theme.colors.text};
  line-height: 1.6;
  flex: 1;
`;

const CardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
`;

const CardTag = styled(Link)`
  background-color: ${theme.colors.lightGrey};
  color: ${theme.colors.text};
  padding: 0.3rem 0.8rem;
  border-radius: ${theme.borderRadius.small};
  font-size: 0.8rem;
  text-decoration: none;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: ${theme.colors.secondary};
    color: white;
  }
`;

const Card = ({ post }) => {
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Create excerpt from content
  const createExcerpt = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };
  
  return (
    <CardContainer>
      {post.featuredImage && (
        <CardImage $src={post.featuredImage} />
      )}
      
      <CardContent>
        <CardTitle to={`/posts/${post._id}`}>{post.title}</CardTitle>
        
        <CardMeta>
          <CardAuthor>By {post.author?.username || 'Unknown'}</CardAuthor>
          <CardDate>{formatDate(post.createdAt)}</CardDate>
        </CardMeta>
        
        <CardExcerpt>{createExcerpt(post.content)}</CardExcerpt>
        
        {post.tags && post.tags.length > 0 && (
          <CardTags>
            {post.tags.map((tag, index) => (
              <CardTag key={index} to={`/?tag=${tag}`}>
                {tag}
              </CardTag>
            ))}
          </CardTags>
        )}
      </CardContent>
    </CardContainer>
  );
};

export default Card; 
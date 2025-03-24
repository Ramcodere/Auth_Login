import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import Card from '../components/Card';
import Button from '../components/Button';
import { theme } from '../styles/GlobalStyles';
import { FaSearch, FaTimes, FaTag } from 'react-icons/fa';

const HomeContainer = styled.div`
  width: 100%;
`;

const Hero = styled.div`
  background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary});
  padding: 3rem 0;
  text-align: center;
  color: white;
  margin-bottom: 2rem;
  border-radius: ${theme.borderRadius.medium};
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto;
`;

const SearchContainer = styled.div`
  display: flex;
  max-width: 600px;
  margin: 2rem auto;
  position: relative;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.8rem 1rem;
  padding-right: ${({ hasValue }) => hasValue ? '2.5rem' : '1rem'};
  border: 1px solid #ddd;
  border-top-left-radius: ${theme.borderRadius.small};
  border-bottom-left-radius: ${theme.borderRadius.small};
  font-size: 1rem;
  outline: none;
  
  &:focus {
    border-color: ${theme.colors.primary};
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 80px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  display: ${({ visible }) => visible ? 'flex' : 'none'};
  font-size: 1rem;
  
  &:hover {
    color: ${theme.colors.danger};
  }
`;

const SearchButton = styled(Button)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const PostsContainer = styled.div`
  flex: 1;
`;

const SidebarContainer = styled.div`
  width: 300px;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    width: 100%;
  }
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const SidebarSection = styled.div`
  background-color: white;
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.small};
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SidebarTitle = styled.h3`
  margin-bottom: 1rem;
  color: ${theme.colors.primary};
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const TagItem = styled.button`
  background-color: ${({ active }) => active ? theme.colors.primary : theme.colors.lightGrey};
  color: ${({ active }) => active ? 'white' : theme.colors.text};
  padding: 0.3rem 0.8rem;
  border-radius: ${theme.borderRadius.small};
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${({ active }) => active ? theme.colors.primary : theme.colors.secondary};
    color: white;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 0.5rem;
`;

const PageButton = styled(Button)`
  min-width: 40px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.small};
  margin: 2rem 0;
`;

const EmptyStateTitle = styled.h2`
  color: ${theme.colors.primary};
  margin-bottom: 1rem;
`;

const EmptyStateDescription = styled.p`
  color: ${theme.colors.darkGrey};
  margin-bottom: 1.5rem;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
`;

const API_URL = 'http://localhost:5002/api';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTag = searchParams.get('tag') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page')) || 1;
  
  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      // Build query params
      let queryParams = `?page=${currentPage}`;
      if (currentTag) queryParams += `&tag=${currentTag}`;
      if (currentSearch) queryParams += `&search=${currentSearch}`;
      
      const response = await axios.get(`${API_URL}/posts${queryParams}`);
      
      setPosts(response.data.posts);
      setPagination(response.data.pagination);
      
      // Extract tags for sidebar (in a real app, you might have a separate API for this)
      const allTags = [];
      response.data.posts.forEach(post => {
        if (post.tags && post.tags.length > 0) {
          allTags.push(...post.tags);
        }
      });
      
      // Count tag occurrences and sort by popularity
      const tagCounts = {};
      allTags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
      
      const uniqueTags = [...new Set(allTags)];
      const sortedTags = uniqueTags.sort((a, b) => tagCounts[b] - tagCounts[a]);
      
      setPopularTags(sortedTags.slice(0, 10)); // Take top 10 tags
      
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to fetch posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPosts();
  }, [currentTag, currentSearch, currentPage]);
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchValue = e.target.search.value;
    
    const params = new URLSearchParams(searchParams);
    if (searchValue) {
      params.set('search', searchValue);
    } else {
      params.delete('search');
    }
    params.set('page', 1); // Reset to page 1 for new search
    setSearchParams(params);
  };
  
  const handleClearSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('search');
    setSearchParams(params);
  };
  
  const handleTagClick = (tag) => {
    const params = new URLSearchParams(searchParams);
    
    if (currentTag === tag) {
      params.delete('tag');
    } else {
      params.set('tag', tag);
    }
    
    params.set('page', 1); // Reset to page 1 for new tag filter
    setSearchParams(params);
  };
  
  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    setSearchParams(params);
  };
  
  // Generate pagination buttons
  const renderPagination = () => {
    const buttons = [];
    
    // Previous button
    buttons.push(
      <PageButton 
        key="prev" 
        variant="outline"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </PageButton>
    );
    
    // Page buttons
    for (let i = 1; i <= pagination.pages; i++) {
      // Show first page, last page, and pages around current page
      if (
        i === 1 || 
        i === pagination.pages || 
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        buttons.push(
          <PageButton 
            key={i} 
            variant={i === currentPage ? 'primary' : 'outline'}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PageButton>
        );
      } else if (
        i === currentPage - 2 || 
        i === currentPage + 2
      ) {
        // Show ellipsis for skipped pages
        buttons.push(
          <span key={i} style={{ alignSelf: 'center' }}>...</span>
        );
      }
    }
    
    // Next button
    buttons.push(
      <PageButton 
        key="next" 
        variant="outline"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === pagination.pages}
      >
        Next
      </PageButton>
    );
    
    return buttons;
  };
  
  return (
    <HomeContainer>
      <Hero>
        <HeroTitle>Welcome to Blog Platform</HeroTitle>
        <HeroSubtitle>
          Discover interesting articles and stories from our community
        </HeroSubtitle>
        
        <form onSubmit={handleSearchSubmit}>
          <SearchContainer>
            <SearchInput 
              type="text"
              name="search"
              placeholder="Search for posts..."
              defaultValue={currentSearch}
              hasValue={currentSearch}
            />
            <ClearButton 
              type="button" 
              onClick={handleClearSearch}
              visible={currentSearch}
            >
              <FaTimes />
            </ClearButton>
            <SearchButton type="submit">
              <FaSearch />
            </SearchButton>
          </SearchContainer>
        </form>
      </Hero>
      
      <ContentContainer>
        <PostsContainer>
          {loading ? (
            <LoadingState>
              <h3>Loading posts...</h3>
            </LoadingState>
          ) : error ? (
            <EmptyState>
              <EmptyStateTitle>Oops!</EmptyStateTitle>
              <EmptyStateDescription>{error}</EmptyStateDescription>
            </EmptyState>
          ) : posts.length === 0 ? (
            <EmptyState>
              <EmptyStateTitle>No posts found</EmptyStateTitle>
              <EmptyStateDescription>
                {currentTag ? 
                  `No posts with the tag "${currentTag}" found.` : 
                  currentSearch ? 
                    `No posts matching "${currentSearch}" found.` : 
                    'No posts available yet. Be the first to create a post!'
                }
              </EmptyStateDescription>
              {(currentTag || currentSearch) && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchParams({});
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </EmptyState>
          ) : (
            <>
              <PostsGrid>
                {posts.map(post => (
                  <Card key={post._id} post={post} />
                ))}
              </PostsGrid>
              
              {pagination.pages > 1 && (
                <PaginationContainer>
                  {renderPagination()}
                </PaginationContainer>
              )}
            </>
          )}
        </PostsContainer>
        
        <SidebarContainer>
          <SidebarSection>
            <SidebarTitle>
              <FaTag /> Popular Tags
            </SidebarTitle>
            <TagsList>
              {popularTags.map(tag => (
                <TagItem 
                  key={tag} 
                  active={currentTag === tag}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </TagItem>
              ))}
              
              {popularTags.length === 0 && (
                <p style={{ color: theme.colors.darkGrey }}>No tags available</p>
              )}
            </TagsList>
          </SidebarSection>
        </SidebarContainer>
      </ContentContainer>
    </HomeContainer>
  );
};

export default Home; 
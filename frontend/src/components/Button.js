import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../styles/GlobalStyles';

const ButtonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ $size }) => 
    $size === 'small' ? '0.5rem 1rem' : 
    $size === 'large' ? '0.8rem 2rem' : 
    '0.6rem 1.5rem'
  };
  font-size: ${({ $size }) => 
    $size === 'small' ? '0.875rem' : 
    $size === 'large' ? '1.1rem' : 
    '1rem'
  };
  border-radius: ${theme.borderRadius.small};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  
  ${({ $variant, disabled }) => {
    if (disabled) {
      return css`
        background-color: #ccc;
        color: #666;
        cursor: not-allowed;
        &:hover {
          background-color: #ccc;
        }
      `;
    }
    
    switch ($variant) {
      case 'secondary':
        return css`
          background-color: ${theme.colors.secondary};
          color: white;
          &:hover {
            background-color: #79c0e0;
          }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          border: 1px solid ${theme.colors.primary};
          &:hover {
            background-color: ${theme.colors.primary};
            color: white;
          }
        `;
      case 'danger':
        return css`
          background-color: ${theme.colors.danger};
          color: white;
          &:hover {
            background-color: #ff5252;
          }
        `;
      case 'success':
        return css`
          background-color: ${theme.colors.success};
          color: white;
          &:hover {
            background-color: #24a03c;
          }
        `;
      default: // primary
        return css`
          background-color: ${theme.colors.primary};
          color: white;
          &:hover {
            background-color: #6da827;
          }
        `;
    }
  }}
  
  svg {
    margin-right: ${({ $iconOnly }) => $iconOnly ? '0' : '0.5rem'};
  }
  
  width: ${({ $fullWidth }) => $fullWidth ? '100%' : 'auto'};
`;

const StyledButton = styled.button`
  ${ButtonStyles}
`;

const StyledLink = styled.a`
  ${ButtonStyles}
  text-decoration: none;
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  fullWidth = false,
  iconOnly = false,
  as = 'button',
  href,
  onClick,
  type = 'button',
  icon,
  ...rest 
}) => {
  const props = {
    $variant: variant,
    $size: size,
    disabled,
    $fullWidth: fullWidth,
    $iconOnly: iconOnly,
    onClick,
    ...rest
  };
  
  if (as === 'link') {
    return (
      <StyledLink 
        href={href}
        {...props}
      >
        {icon && icon}
        {children}
      </StyledLink>
    );
  }
  
  return (
    <StyledButton
      type={type}
      {...props}
    >
      {icon && icon}
      {children}
    </StyledButton>
  );
};

export default Button; 
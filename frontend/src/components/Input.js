import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../styles/GlobalStyles';

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
  width: 100%;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${theme.colors.text};
`;

const baseInputStyles = css`
  padding: 0.8rem 1rem;
  border: 1px solid ${({ $error }) => $error ? theme.colors.danger : '#ddd'};
  border-radius: ${theme.borderRadius.small};
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
  width: 100%;
  
  &:focus {
    border-color: ${({ $error }) => $error ? theme.colors.danger : theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ $error }) => $error 
      ? `${theme.colors.danger}33` 
      : `${theme.colors.primary}33`};
  }
  
  &::placeholder {
    color: #aaa;
  }
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const StyledInput = styled.input`
  ${baseInputStyles}
`;

const StyledTextArea = styled.textarea`
  ${baseInputStyles}
  min-height: 120px;
  resize: vertical;
`;

const ErrorMessage = styled.span`
  color: ${theme.colors.danger};
  font-size: 0.85rem;
  margin-top: 0.3rem;
`;

const HelperText = styled.span`
  color: ${theme.colors.darkGrey};
  font-size: 0.85rem;
  margin-top: 0.3rem;
`;

const Input = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  ...rest
}) => {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s/g, '-')}`;
  
  return (
    <InputWrapper>
      {label && (
        <Label htmlFor={inputId}>
          {label} {required && <span style={{ color: theme.colors.danger }}>*</span>}
        </Label>
      )}
      
      {type === 'textarea' ? (
        <StyledTextArea 
          id={inputId}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          $error={error}
          disabled={disabled}
          required={required}
          {...rest}
        />
      ) : (
        <StyledInput 
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          $error={error}
          disabled={disabled}
          required={required}
          {...rest}
        />
      )}
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {helperText && !error && <HelperText>{helperText}</HelperText>}
    </InputWrapper>
  );
};

export default Input; 
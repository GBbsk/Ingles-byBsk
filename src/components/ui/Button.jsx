import styled, { css } from 'styled-components';

const sizeStyles = {
  small: css`
    padding: 0.45rem 0.9rem;
    font-size: 0.8rem;
    border-radius: 6px;
  `,
  medium: css`
    padding: 0.65rem 1.4rem;
    font-size: 0.9rem;
    border-radius: 8px;
  `,
  large: css`
    padding: 0.85rem 2rem;
    font-size: 1.05rem;
    border-radius: 10px;
  `,
};

const ButtonStyles = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  letter-spacing: 0.01em;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  /* Size */
  ${({ $size }) => sizeStyles[$size] || sizeStyles.medium}

  /* Variant: primary (default) */
  ${({ $variant, theme }) =>
    (!$variant || $variant === 'primary') &&
    css`
      background: ${theme.button.primaryBg};
      color: ${theme.button.primaryText};
      box-shadow: 0 4px 15px ${({ theme }) => theme.primary}44;

      &:hover {
        box-shadow: 0 6px 20px ${({ theme }) => theme.primary}66;
        transform: translateY(-2px);
        filter: brightness(1.1);
      }

      &:active {
        transform: translateY(0);
      }
    `}

  /* Variant: outline */
  ${({ $variant, theme }) =>
    $variant === 'outline' &&
    css`
      background: ${theme.glassBg || 'transparent'};
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      color: ${theme.button.outlineText};
      border: 1px solid ${theme.glassBorder || theme.button.outlineBorder};

      &:hover {
        background: ${theme.primaryLight};
        border-color: ${theme.primary};
        transform: translateY(-2px);
        box-shadow: 0 4px 12px ${({ theme }) => theme.primary}22;
      }
    `}

  /* Variant: text */
  ${({ $variant, theme }) =>
    $variant === 'text' &&
    css`
      background: transparent;
      color: ${theme.primary};
      padding-left: 0.5rem;
      padding-right: 0.5rem;

      &:hover {
        color: ${theme.primaryDark};
        background: ${theme.primaryLight};
      }
    `}

  @media (max-width: 576px) {
    font-size: 0.9rem;
    padding: 0.65rem 1rem;
  }
`;

function Button({ children, variant = 'primary', size = 'medium', ...props }) {
  return (
    <ButtonStyles $variant={variant} $size={size} {...props}>
      {children}
    </ButtonStyles>
  );
}

export default Button;
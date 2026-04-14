import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isOpen'
})`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const ModalContent = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isOpen'
})`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); /* Idealmente, a sombra também viria do tema */
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  transform: ${({ isOpen }) => (isOpen ? 'scale(1)' : 'scale(0.9)')};
  transition: transform 0.3s ease;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.secondaryText};
  transition: color 0.3s ease;
  
  &:hover {
    color: ${({ theme }) => theme.text};
  }
`;

const ModalTitle = styled.h3`
  margin: 0 0 1rem;
  font-size: 1.5rem;
  padding-right: 2rem; /* Para não sobrepor o botão de fechar */
  color: ${({ theme }) => theme.text}; /* Adicionado para garantir a cor do tema */
`;

const ModalBody = styled.div`
  margin-bottom: 1rem;
  height: 70vh; // or another value that fits your design
  display: flex;
  flex-direction: column;
`;

const FileViewer = styled.div`
  width: 100%;
  height: 70vh;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 4px;
  overflow: hidden;
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const Modal = ({ isOpen, onClose, title, fileUrl, fileType }) => {
  const modalRef = useRef(null);
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      // Impedir o scroll do body quando o modal estiver aberto
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContent isOpen={isOpen} ref={modalRef}>
        <CloseButton onClick={onClose}>✕</CloseButton>
        <ModalTitle>{title}</ModalTitle>
        <ModalBody>
          <FileViewer>
            {(fileType === 'pdf' || (fileUrl && fileUrl.includes('drive.google.com'))) && (
              <iframe 
                src={fileUrl}
                title={title}
                allowFullScreen
                loading="eager"
                style={{ border: 'none', background: '#fff' }}
              />
            )}
            {fileType === 'image' && (
              <img src={fileUrl} alt={title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            )}
          </FileViewer>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;
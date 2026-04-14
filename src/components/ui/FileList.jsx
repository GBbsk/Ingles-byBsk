import { useState } from 'react';
import styled from 'styled-components';
import Button from './Button';
import Modal from './Modal';

const FileListContainer = styled.div`
  margin-bottom: 2rem;
`;

const FileListTitle = styled.h3`
  margin: 0 0 1rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const FileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const FileCard = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); /* Idealmente, a sombra também viria do tema */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  }
`;

const FileIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${({ type }) => 
    type === 'pdf' ? '#e74c3c' : 
    type === 'doc' ? '#3498db' : 
    type === 'xls' ? '#2ecc71' : 
    type === 'ppt' ? '#f39c12' : 
    type === 'zip' ? '#9b59b6' : 
    '#95a5a6'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
  margin-bottom: 1rem;
`;

const FileName = styled.h4`
  margin: 0 0 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const FileDescription = styled.p`
  color: ${({ theme }) => theme.secondaryText};
  font-size: 0.85rem;
  margin: 0 0 1rem;
  line-height: 1.4;
`;

const FileActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const FileList = ({ files = [] }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleViewFile = (file) => {
    setSelectedFile(file);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedFile(null);
  };
  
  // REMOVER AS SEGUINTES FUNÇÕES, POIS NÃO SERÃO MAIS NECESSÁRIAS AQUI
  // const getFileType = (fileUrl) => { ... };
  // const getFileExtension = (fileUrl) => { ... };
  
  if (!files.length) {
    return null;
  }
  
  return (
    <FileListContainer>
      <FileListTitle>Arquivos para Download</FileListTitle>
      <FileGrid>
        {files.map((file) => {
          // Usar file.type diretamente do objeto de dados
          const typeForIcon = file.type ? file.type.toLowerCase() : 'other';
          const extensionForDisplay = file.type ? file.type.toUpperCase() : 'ARQUIVO'; // Fallback

          return (
            <FileCard key={file.id}>
              <FileIcon type={typeForIcon}>{extensionForDisplay}</FileIcon>
              <FileName>{file.title}</FileName>
              <FileDescription>{file.description}</FileDescription>
              <FileActions>
                <Button 
                  variant="primary" 
                  size="small" 
                  onClick={() => handleViewFile(file)}
                >
                  Visualizar
                </Button>
                <Button 
                  variant="text" 
                  size="small" 
                  as="a" 
                  href={file.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  download
                >
                  Download
                </Button>
              </FileActions>
            </FileCard>
          );
        })}
      </FileGrid>
      {modalOpen && selectedFile && (
        <Modal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          title={selectedFile.title}
          fileUrl={selectedFile.fileUrl}
          // Passar o tipo do arquivo diretamente para o Modal
          fileType={selectedFile.type ? selectedFile.type.toLowerCase() : 'other'}
        />
      )}
    </FileListContainer>
  );
};

export default FileList;
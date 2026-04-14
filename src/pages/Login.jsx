import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/ui/Button';

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 2rem auto;
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadowMd};
`;

const LoginTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.text};
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}33;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.error};
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const LoginButton = styled(Button)`
  width: 100%;
  margin-top: 1rem;
`;

function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Em um ambiente real, isso seria uma chamada de API para autenticar o usuário
      // Mas como estamos usando um arquivo JSON local, vamos importá-lo diretamente
      const response = await import('../data/ModuleData.json');
      const { admin } = response;
      
      // Verificar as credenciais
      if (username === admin.username && password === admin.password) {
        // Autenticação bem-sucedida
        localStorage.setItem('auth_token', 'dummy_token'); // Em um ambiente real, seria um token JWT
        setIsAuthenticated(true);
        navigate('/admin');
      } else {
        setError('Usuário ou senha incorretos.');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setError('Ocorreu um erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <LoginContainer>
      <LoginTitle>Acesso Restrito a Administradores</LoginTitle>
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="username">Usuário</Label>
          <Input 
            type="text" 
            id="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="password">Senha</Label>
          <Input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </FormGroup>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <LoginButton 
          type="submit" 
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </LoginButton>
      </form>
    </LoginContainer>
  );
}

export default Login;
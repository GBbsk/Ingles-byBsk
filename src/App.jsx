import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyle';
import { lightTheme, darkTheme } from './styles/theme';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Components
import Header from './components/Header/Header';

// Pages (Public)
import Home from './pages/Home';
import Modules from './pages/Modules';
import ModuleDetail from './pages/ModuleDetail';
import LessonDetail from './pages/LessonDetail';
import Login from './pages/Login';  
// C:\Users\gabri\Downloads\plat-curso\Ingles-GBbsk\src\pages

// Pages (Admin) — NÃO ALTERADO
import AdminDashboard from './pages/admin/Dashboard';
import AdminModules from './pages/admin/AdminModules';
import AdminLessons from './pages/admin/Lessons';
import AdminFiles from './pages/admin/Files';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) setIsAuthenticated(true);

    const localTheme = localStorage.getItem('theme');
    if (localTheme) setTheme(localTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle />
      <Header toggleTheme={toggleTheme} currentTheme={theme} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="modulos" element={<Modules />} />
          <Route path="modulos/:moduleId" element={<ModuleDetail />} />
          <Route path="modulos/:moduleId/aula/:lessonId" element={<LessonDetail />} />
          <Route path="login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        </Route>

        {/* Admin Routes — NÃO ALTERADO */}
        <Route path="/admin" element={<AdminLayout isAuthenticated={isAuthenticated} />}>
          <Route index element={<AdminDashboard />} />
          <Route path="modulos" element={<AdminModules />} />
          <Route path="aulas" element={<AdminLessons />} />
          <Route path="arquivos" element={<AdminFiles />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
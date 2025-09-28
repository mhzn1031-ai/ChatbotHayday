import React, { useState } from 'react';
import {
  Dashboard,
  Login,
  Register,
  BotManagement,
  BotCreation,
  BotCustomization,
  EmbedCode,
  Subscription
} from './admin';
import './styles/globals.css';

type Page = 'login' | 'register' | 'dashboard' | 'bots' | 'bot-creation' | 'customize' | 'embed' | 'subscription';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (email: string, password: string) => {
    // Handle login logic here
    console.log('Login:', { email, password });
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleRegister = (email: string, password: string, name: string) => {
    // Handle registration logic here
    console.log('Register:', { email, password, name });
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  // If not authenticated, show login/register
  if (!isAuthenticated) {
    if (currentPage === 'register') {
      return (
        <Register
          onRegister={handleRegister}
          onSwitchToLogin={() => setCurrentPage('login')}
        />
      );
    }
    
    return (
      <Login
        onLogin={handleLogin}
        onSwitchToRegister={() => setCurrentPage('register')}
      />
    );
  }

  // Render authenticated pages
  switch (currentPage) {
    case 'dashboard':
      return <Dashboard />;
    case 'bots':
      return <BotManagement />;
    case 'bot-creation':
      return <BotCreation />;
    case 'customize':
      return <BotCustomization />;
    case 'embed':
      return <EmbedCode />;
    case 'subscription':
      return <Subscription />;
    default:
      return <Dashboard />;
  }
}

export default App;
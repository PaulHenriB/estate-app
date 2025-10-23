
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';

const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
);


const Header: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
            <HomeIcon className="w-7 h-7" />
            <span>Dwelli</span>
          </Link>
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="hidden sm:inline text-neutral-600">Welcome, {user?.username}!</span>
                <Button onClick={() => navigate('/dashboard')} variant="secondary">Dashboard</Button>
                <Button onClick={handleLogout} variant="outline">Logout</Button>
              </>
            ) : (
              <>
                <Button onClick={() => navigate('/login')} variant="ghost">Log In</Button>
                <Button onClick={() => navigate('/signup')}>Sign Up</Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;


import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-[calc(100vh-10rem)] px-4">
      <h1 className="text-8xl font-extrabold text-primary">404</h1>
      <h2 className="text-3xl font-bold text-neutral-800 mt-4">Page Not Found</h2>
      <p className="text-neutral-600 mt-2 max-w-md">
        Sorry, the page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Link to="/">
        <Button className="mt-8">Go Back Home</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;

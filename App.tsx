
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import MySearchesPage from './pages/MySearchesPage';
import MyListingsPage from './pages/MyListingsPage';
import MyDocumentsPage from './pages/MyDocumentsPage';
import MyProfilePage from './pages/MyProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import PublicProfilePage from './pages/PublicProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/t/:username" element={<PublicProfilePage />} />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="listings" replace />} />
                <Route path="searches" element={<MySearchesPage />} />
                <Route path="listings" element={<MyListingsPage />} />
                <Route path="documents" element={<MyDocumentsPage />} />
                <Route path="profile" element={<MyProfilePage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;

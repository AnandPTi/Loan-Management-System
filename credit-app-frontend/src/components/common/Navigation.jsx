// src/components/common/Navigation.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-green-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-white text-xl font-bold">Credit App</span>
            </Link>
            {user && (
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {user.role === 'verifier' && (
                    <Link
                      to="/verifier"
                      className="text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Verifier Dashboard
                    </Link>
                  )}
                  {user.role === 'user' && (
                    <>
                      <Link
                        to="/dashboard"
                        className="text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/apply"
                        className="text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Apply for Loan
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-white">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-x-4">
                  <Link
                    to="/login"
                    className="text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// // src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add debug logging for state changes
  useEffect(() => {
    console.log('Auth state changed:', { user, loading });
  }, [user, loading]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for token in localStorage
        const token = localStorage.getItem('token');
        console.log('Stored token:', token);
        
        if (token) {
          // Set default authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // Verify token and get user data
          await fetchUserData();
        } else {
          console.log('No token found in localStorage');
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const fetchUserData = async () => {
    try {
      console.log('Fetching user data...');
      const response = await axios.get('http://localhost:5000/api/auth/me');
      console.log('User data received:', response.data);
      
      // Ensure user object has all required fields
      const userData = {
        ...response.data,
        token: localStorage.getItem('token'),
        role: response.data.role?.toLowerCase() // Normalize role
      };
      
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Clear auth state on error
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Attempting login...');
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      
      console.log('Login response:', response.data);
      
      const { token, user: userData } = response.data;
      
      // Ensure user object has all required fields
      const enrichedUser = {
        ...userData,
        token,
        role: userData.role?.toLowerCase() // Normalize role
      };
      
      // Store auth state
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(enrichedUser);
      
      console.log('Login successful, user:', enrichedUser);
      return enrichedUser;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    console.log('Logging out...');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Check for token in localStorage
//     const token = localStorage.getItem('token');
//     if (token) {
//       // Set default authorization header
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       // Verify token and get user data
//       fetchUserData();
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const fetchUserData = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/auth/me');
//       setUser(response.data);
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//       localStorage.removeItem('token');
//       delete axios.defaults.headers.common['Authorization'];
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (email, password) => {
//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/login', {
//         email,
//         password,
//       });
      
//       const { token, user } = response.data;
//       localStorage.setItem('token', token);
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       setUser(user);
//       return user;
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Login failed');
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     delete axios.defaults.headers.common['Authorization'];
//     setUser(null);
//   };

//   const value = {
//     user,
//     loading,
//     login,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };


// import React, { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Check for stored token and user data
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//     setLoading(false);
//   }, []);

//   const login = async (email, password) => {
//     try {
//       const response = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         localStorage.setItem('user', JSON.stringify(data));
//         setUser(data);
//         return { success: true };
//       }
//       return { success: false, error: data.message };
//     } catch (error) {
//       return { success: false, error: 'Login failed' };
//     }
//   };

//   const register = async (userData) => {
//     try {
//       const response = await fetch('/api/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(userData),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         return { success: true };
//       }
//       return { success: false, error: data.message };
//     } catch (error) {
//       return { success: false, error: 'Registration failed' };
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('user');
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, register, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
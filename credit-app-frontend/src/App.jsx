// // src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/common/Layout';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { VerifierDashboard } from './components/dashboard/VerifierDashboard';
import { LoanApplication } from './components/loans/loanApplication';

// Protected Route component with role-based access
const PrivateRoute = ({ element, allowedRoles }) => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to appropriate dashboard if role doesn't match
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'verifier':
        return <Navigate to="/verifier" replace />;
      case 'user':
        return <Navigate to="/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return element;
};

// Home route handler
const HomeRoute = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'verifier':
      return <Navigate to="/verifier" replace />;
    case 'user':
      return <Navigate to="/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Home route */}
            <Route path="/" element={<HomeRoute />} />
            
            {/* Protected routes */}
            <Route 
              path="/admin" 
              element={
                <PrivateRoute 
                  element={<AdminDashboard />} 
                  allowedRoles={['admin']} 
                />
              } 
            />
            <Route 
              path="/verifier" 
              element={
                <PrivateRoute 
                  element={<VerifierDashboard />} 
                  allowedRoles={['verifier']} 
                />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute 
                  element={<UserDashboard />} 
                  allowedRoles={['user']} 
                />
              } 
            />
            <Route 
              path="/apply-loan" 
              element={
                <PrivateRoute 
                  element={<LoanApplication />} 
                  allowedRoles={['user']} 
                />
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './contexts/AuthContext';
// import { Layout } from './components/common/Layout';
// import { Login } from './components/auth/Login';
// import { Register } from './components/auth/Register';
// import { AdminDashboard } from './components/dashboard/AdminDashboard';
// import { UserDashboard } from './components/dashboard/UserDashboard';
// import { VerifierDashboard } from './components/dashboard/VerifierDashboard';
// import { LoanApplication } from './components/loans/loanApplication';

// const PrivateRoute = ({ element, allowedRoles }) => {
//   const { user } = useAuth();
  
//   if (!user) {
//     return <Navigate to="/login" />;
//   }

//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/dashboard" />;
//   }

//   return element;
// };

// const App = () => {
//   return (
//     <Router>
//       <AuthProvider>
//         <Layout>
//           <Routes>
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route 
//               path="/admin" 
//               element={
//                 <PrivateRoute 
//                   element={<AdminDashboard />} 
//                   allowedRoles={['admin']} 
//                 />
//               } 
//             />
//             <Route 
//               path="/verifier" 
//               element={
//                 <PrivateRoute 
//                   element={<VerifierDashboard />} 
//                   allowedRoles={['verifier']} 
//                 />
//               } 
//             />
//             <Route 
//               path="/dashboard" 
//               element={
//                 <PrivateRoute 
//                   element={<UserDashboard />} 
//                   allowedRoles={['user']} 
//                 />
//               } 
//             />
//             <Route 
//               path="/apply" 
//               element={
//                 <PrivateRoute 
//                   element={<LoanApplication />} 
//                   allowedRoles={['user']} 
//                 />
//               } 
//             />
//             <Route path="/" element={<Navigate to="/dashboard" />} />
//           </Routes>
//         </Layout>
//       </AuthProvider>
//     </Router>
//   );
// };

// export default App;

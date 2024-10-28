// // // src/components/dashboard/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { useAuth } from '../../contexts/AuthContext';
import { AlertCircle, CheckCircle, Clock, UserPlus, Users, FileText } from 'lucide-react';

export const AdminDashboard = () => {
  const [loans, setLoans] = useState([]);
  const [users, setUsers] = useState([]);
  const [verifiers, setVerifiers] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateVerifierOpen, setIsCreateVerifierOpen] = useState(false);
  const [isAssignVerifierOpen, setIsAssignVerifierOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [loansResponse, usersResponse] = await Promise.all([
          fetch('/api/admin/loans', {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          }),
          fetch('/api/admin/users', {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          })
        ]);

        const [loansData, usersData] = await Promise.all([
          loansResponse.json(),
          usersResponse.json()
        ]);

        setLoans(loansData);
        setUsers(usersData.filter(u => u.role !== 'verifier'));
        setVerifiers(usersData.filter(u => u.role === 'verifier'));
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const createVerifier = async (verifierData) => {
    try {
      const response = await fetch('/api/admin/verifier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(verifierData)
      });
      if (response.ok) {
        const newVerifier = await response.json();
        setVerifiers([...verifiers, newVerifier]);
        setIsCreateVerifierOpen(false);
        setSuccessMessage('Verifier created successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error('Failed to create verifier');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const assignVerifier = async (loanId, verifierId) => {
    try {
      const response = await fetch('/api/admin/loans/assign-verifier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ loanId, verifierId })
      });
      if (response.ok) {
        const updatedLoan = await response.json();
        setLoans(loans.map(loan => 
          loan._id === updatedLoan._id ? updatedLoan : loan
        ));
        setIsAssignVerifierOpen(false);
        setSuccessMessage('Verifier assigned successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error('Failed to assign verifier');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`/api/admin/user/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (response.ok) {
        setUsers(users.filter(user => user._id !== userId));
        setSuccessMessage('User deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => setIsCreateVerifierOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus size={20} />
          Create Verifier
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <p className="text-green-800">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-600">Total Loans</h3>
            <FileText className="h-4 w-4 text-gray-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{loans.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
            <Users className="h-4 w-4 text-gray-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{users.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-600">Total Verifiers</h3>
            <UserPlus className="h-4 w-4 text-gray-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{verifiers.length}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loan Applications */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Loan Applications</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="px-6 py-3 text-sm font-semibold">Applicant</th>
                    <th className="px-6 py-3 text-sm font-semibold">Amount</th>
                    <th className="px-6 py-3 text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((loan) => (
                    <tr key={loan._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{loan.fullName}</td>
                      <td className="px-6 py-4">${loan.amount?.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          loan.status === 'approved' ? 'bg-green-100 text-green-800' :
                          loan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {loan.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                          {loan.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {!loan.verifier && (
                          <button
                            onClick={() => {
                              setSelectedLoan(loan);
                              setIsAssignVerifierOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Assign Verifier
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Users</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="px-6 py-3 text-sm font-semibold">Name</th>
                    <th className="px-6 py-3 text-sm font-semibold">Email</th>
                    <th className="px-6 py-3 text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{user.name}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Create Verifier Modal */}
      <Dialog open={isCreateVerifierOpen} onClose={() => setIsCreateVerifierOpen(false)} className="fixed inset-0 z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <Dialog.Title className="text-lg font-semibold mb-4">Create Verifier</Dialog.Title>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                createVerifier({
                  email: formData.get('email'),
                  password: formData.get('password'),
                  name: formData.get('name'),
                  phone: formData.get('phone'),
                  address: formData.get('address')
                });
              }}>
                <div className="space-y-4">
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <input
                    name="name"
                    type="text"
                    placeholder="Full Name"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Phone"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <input
                    name="address"
                    type="text"
                    placeholder="Address"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCreateVerifierOpen(false)}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Assign Verifier Modal */}
      <Dialog open={isAssignVerifierOpen} onClose={() => setIsAssignVerifierOpen(false)} className="fixed inset-0 z-50">
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <Dialog.Title className="text-lg font-semibold mb-4">Assign Verifier</Dialog.Title>
              <form onSubmit={(e) => {
                e.preventDefault();
                const verifierId = e.target.verifier.value;
                assignVerifier(selectedLoan._id, verifierId);
              }}>
                <div className="space-y-4">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Assigning verifier for loan application from: <span className="font-medium">{selectedLoan?.fullName}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Amount: <span className="font-medium">${selectedLoan?.amount.toLocaleString()}</span>
                    </p>
                  </div>
                  
                  <select
                    name="verifier"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a verifier</option>
                    {verifiers.map((verifier) => (
                      <option key={verifier._id} value={verifier._id}>
                        {verifier.name} ({verifier.email})
                      </option>
                    ))}
                  </select>
                  
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Assign
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAssignVerifierOpen(false)}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;

// import React, { useState, useEffect } from 'react';
// import { Dialog } from '@headlessui/react';
// import { useAuth } from '../../contexts/AuthContext';

// export const AdminDashboard = () => {
//   const [loans, setLoans] = useState([]);
//   const [users, setUsers] = useState([]);
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [isOpen, setIsOpen] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const loansResponse = await fetch('/api/admin/loans', {
//           headers: {
//             'Authorization': `Bearer ${user.token}`
//           }
//         });
//         const loansData = await loansResponse.json();
//         setLoans(loansData);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to fetch data');
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [user]);

//   const createVerifier = async (verifierData) => {
//     try {
//       const response = await fetch('/api/admin/verifier', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${user.token}`
//         },
//         body: JSON.stringify(verifierData)
//       });
//       if (response.ok) {
//         // Handle success
//         setIsOpen(false); // Close modal on success
//       } else {
//         throw new Error('Failed to create verifier');
//       }
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const deleteUser = async (userId) => {
//     try {
//       const response = await fetch(`/api/admin/user/${userId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${user.token}`
//         }
//       });
//       if (response.ok) {
//         setUsers(users.filter(user => user._id !== userId));
//       } else {
//         throw new Error('Failed to delete user');
//       }
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

//       {/* Button to open modal for creating verifier */}
//       <button
//         onClick={() => setIsOpen(true)}
//         className="mb-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
//       >
//         Create Verifier
//       </button>

//       {/* Modal for Create Verifier */}
//       <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 flex items-center justify-center z-50">
//         <div className="bg-white p-6 rounded shadow-lg w-80">
//           <Dialog.Title className="text-xl font-semibold">Create Verifier</Dialog.Title>
//           <form onSubmit={(e) => {
//             e.preventDefault();
//             const formData = new FormData(e.target);
//             createVerifier({
//               email: formData.get('email'),
//               password: formData.get('password'),
//               name: formData.get('name'),
//               phone: formData.get('phone'),
//               address: formData.get('address')
//             });
//           }}>
//             <div className="space-y-4 mt-4">
//               <input name="email" type="email" placeholder="Email" className="w-full p-2 border rounded" required />
//               <input name="password" type="password" placeholder="Password" className="w-full p-2 border rounded" required />
//               <input name="name" type="text" placeholder="Full Name" className="w-full p-2 border rounded" required />
//               <input name="phone" type="tel" placeholder="Phone" className="w-full p-2 border rounded" required />
//               <input name="address" type="text" placeholder="Address" className="w-full p-2 border rounded" required />
//               <button type="submit" className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">Create</button>
//             </div>
//           </form>
//           <button onClick={() => setIsOpen(false)} className="mt-4 w-full text-center text-red-500">Cancel</button>
//         </div>
//       </Dialog>

//       {/* Display Loan Applications */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-xl font-semibold mb-4">Loan Applications</h2>
//           <div className="overflow-x-auto">
//             <table className="min-w-full">
//               <thead>
//                 <tr>
//                   <th className="px-6 py-3 border-b">Applicant</th>
//                   <th className="px-6 py-3 border-b">Amount</th>
//                   <th className="px-6 py-3 border-b">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loans.map((loan) => (
//                   <tr key={loan._id}>
//                     <td className="px-6 py-4 border-b">{loan.fullName}</td>
//                     <td className="px-6 py-4 border-b">${loan.amount}</td>
//                     <td className="px-6 py-4 border-b">
//                       <span className={`px-2 py-1 rounded ${
//                         loan.status === 'approved' ? 'bg-green-100 text-green-800' :
//                         loan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                         'bg-red-100 text-red-800'
//                       }`}>
//                         {loan.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Display Users with Delete Option */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-xl font-semibold mb-4">Users</h2>
//           <div className="overflow-x-auto">
//             <table className="min-w-full">
//               <thead>
//                 <tr>
//                   <th className="px-6 py-3 border-b">Name</th>
//                   <th className="px-6 py-3 border-b">Email</th>
//                   <th className="px-6 py-3 border-b">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((user) => (
//                   <tr key={user._id}>
//                     <td className="px-6 py-4 border-b">{user.name}</td>
//                     <td className="px-6 py-4 border-b">{user.email}</td>
//                     <td className="px-6 py-4 border-b">
//                       <button
//                         onClick={() => deleteUser(user._id)}
//                         className="text-red-600 hover:underline"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };












// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../contexts/AuthContext';

// export const AdminDashboard = () => {
//   const [loans, setLoans] = useState([]);
//   const [users, setUsers] = useState([]);
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const loansResponse = await fetch('/api/admin/loans', {
//           headers: {
//             'Authorization': `Bearer ${user.token}`
//           }
//         });
//         const loansData = await loansResponse.json();
//         setLoans(loansData);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to fetch data');
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [user]);

//   const createVerifier = async (verifierData) => {
//     try {
//       const response = await fetch('/api/admin/verifier', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${user.token}`
//         },
//         body: JSON.stringify(verifierData)
//       });
//       if (response.ok) {
//         // Handle success
//       }
//     } catch (err) {
//       setError('Failed to create verifier');
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-xl font-semibold mb-4">Loan Applications</h2>
//           <div className="overflow-x-auto">
//             <table className="min-w-full">
//               <thead>
//                 <tr>
//                   <th className="px-6 py-3 border-b">Applicant</th>
//                   <th className="px-6 py-3 border-b">Amount</th>
//                   <th className="px-6 py-3 border-b">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loans.map((loan) => (
//                   <tr key={loan._id}>
//                     <td className="px-6 py-4 border-b">{loan.fullName}</td>
//                     <td className="px-6 py-4 border-b">${loan.amount}</td>
//                     <td className="px-6 py-4 border-b">
//                       <span className={`px-2 py-1 rounded ${
//                         loan.status === 'approved' ? 'bg-green-100 text-green-800' :
//                         loan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                         'bg-red-100 text-red-800'
//                       }`}>
//                         {loan.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-xl font-semibold mb-4">Create Verifier</h2>
//           <form onSubmit={(e) => {
//             e.preventDefault();
//             const formData = new FormData(e.target);
//             createVerifier({
//               email: formData.get('email'),
//               password: formData.get('password'),
//               name: formData.get('name'),
//               phone: formData.get('phone'),
//               address: formData.get('address')
//             });
//           }}>
//             <div className="space-y-4">
//               <input
//                 name="email"
//                 type="email"
//                 placeholder="Email"
//                 className="w-full p-2 border rounded"
//                 required
//               />
//               <input
//                 name="password"
//                 type="password"
//                 placeholder="Password"
//                 className="w-full p-2 border rounded"
//                 required
//               />
//               <input
//                 name="name"
//                 type="text"
//                 placeholder="Full Name"
//                 className="w-full p-2 border rounded"
//                 required
//               />
//               <input
//                 name="phone"
//                 type="tel"
//                 placeholder="Phone"
//                 className="w-full p-2 border rounded"
//                 required
//               />
//               <input
//                 name="address"
//                 type="text"
//                 placeholder="Address"
//                 className="w-full p-2 border rounded"
//                 required
//               />
//               <button
//                 type="submit"
//                 className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
//               >
//                 Create Verifier
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

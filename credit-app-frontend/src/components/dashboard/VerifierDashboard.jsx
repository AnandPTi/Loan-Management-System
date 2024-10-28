
// // src/components/dashboard/VerifierDashboard.jsx
// src/components/dashboard/VerifierDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const VerifierDashboard = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await fetch('/api/verifier/loans', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const data = await response.json();
      setLoans(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching loans:', error);
      setLoading(false);
    }
  };

  const updateLoanStatus = async (loanId, status) => {
    try {
      const response = await fetch(`/api/verifier/loans/${loanId}/status`, { // Updated URL path
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        fetchLoans(); // Refresh loans after update
      }
    } catch (error) {
      console.error('Error updating loan status:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Loan Verification Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loans.map((loan) => (
                <tr key={loan._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{loan.fullName}</div>
                    <div className="text-sm text-gray-500">{loan.user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${loan.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {loan.employmentStatus}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      loan.status === 'approved' ? 'bg-green-100 text-green-800' :
                      loan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      loan.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="space-x-2">
                      <button
                        onClick={() => updateLoanStatus(loan._id, 'approved')}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateLoanStatus(loan._id, 'rejected')}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../contexts/AuthContext';

// export const VerifierDashboard = () => {
//   const [loans, setLoans] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { user } = useAuth();

//   useEffect(() => {
//     fetchLoans();
//   }, []);

//   const fetchLoans = async () => {
//     try {
//       const response = await fetch('/api/verifier/loans', {
//         headers: {
//           'Authorization': `Bearer ${user.token}`
//         }
//       });
//       const data = await response.json();
//       setLoans(data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching loans:', error);
//       setLoading(false);
//     }
//   };

//   const updateLoanStatus = async (loanId, status) => {
//     try {
//       const response = await fetch(`/api/verifier/${loanId}/status`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${user.token}`
//         },
//         body: JSON.stringify({ status })
//       });
      
//       if (response.ok) {
//         fetchLoans(); // Refresh loans after update
//       }
//     } catch (error) {
//       console.error('Error updating loan status:', error);
//     }
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">Loan Verification Dashboard</h1>
      
//       <div className="bg-white rounded-lg shadow">
//         <div className="overflow-x-auto">
//           <table className="min-w-full">
//             <thead>
//               <tr className="bg-gray-50">
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Applicant
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Amount
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Employment
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {loans.map((loan) => (
//                 <tr key={loan._id}>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-gray-900">{loan.fullName}</div>
//                     <div className="text-sm text-gray-500">{loan.user.email}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     ${loan.amount.toLocaleString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {loan.employmentStatus}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
//                       loan.status === 'approved' ? 'bg-green-100 text-green-800' :
//                       loan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                       loan.status === 'rejected' ? 'bg-red-100 text-red-800' :
//                       'bg-gray-100 text-gray-800'
//                     }`}>
//                       {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="space-x-2">
//                       <button
//                         onClick={() => updateLoanStatus(loan._id, 'approved')}
//                         className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
//                       >
//                         Approve
//                       </button>
//                       <button
//                         onClick={() => updateLoanStatus(loan._id, 'rejected')}
//                         className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
//                       >
//                         Reject
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };
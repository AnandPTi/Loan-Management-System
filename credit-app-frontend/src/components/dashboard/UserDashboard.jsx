// src/components/dashboard/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

export const UserDashboard = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLoans = async () => {
      console.log('Fetching loans with user:', user); // Add this
      try {
        const response = await fetch('/api/loans/user-loans', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        console.log('Loans response:', response); // Add this
        const data = await response.json();
        console.log('Loans data:', data); // Add this
        setLoans(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching loans:', error);
        setLoading(false);
      }
    };
  
    fetchLoans();
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Loans</h1>
        <Link
          to="/apply-loan"
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Apply for New Loan
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loan ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loans.map((loan) => (
                <tr key={loan._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {loan._id.slice(-6)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${loan.amount.toLocaleString()}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(loan.createdAt).toLocaleDateString()}
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


// src/components/dashboard/UserDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import { Link } from 'react-router-dom';

// export const UserDashboard = () => {
//   const [loans, setLoans] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { user } = useAuth();

//   useEffect(() => {
//     const fetchLoans = async () => {
//       try {
//         const response = await fetch('/api/loans/user-loans', {
//           headers: {
//             'Authorization': `Bearer ${user.token}`
//           }
//         });
//         const data = await response.json();
//         setLoans(data);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching loans:', error);
//         setLoading(false);
//       }
//     };

//     fetchLoans();
//   }, [user]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   if (loans.length === 0) {
//     return (
//       <div className="p-6">
//         <div className="text-center py-12">
//           <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
//             <svg 
//               className="mx-auto h-16 w-16 text-gray-400 mb-4" 
//               fill="none" 
//               stroke="currentColor" 
//               viewBox="0 0 24 24"
//             >
//               <path 
//                 strokeLinecap="round" 
//                 strokeLinejoin="round" 
//                 strokeWidth="2" 
//                 d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
//               />
//             </svg>
//             <h3 className="text-xl font-medium text-gray-900 mb-2">
//               No Loans Yet
//             </h3>
//             <p className="text-gray-500 mb-6">
//               Get started by applying for your first loan. We're here to help you achieve your financial goals.
//             </p>
//             <Link
//               to="/apply"
//               className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//             >
//               <svg 
//                 className="mr-2 -ml-1 h-5 w-5" 
//                 xmlns="http://www.w3.org/2000/svg" 
//                 viewBox="0 0 20 20" 
//                 fill="currentColor"
//               >
//                 <path 
//                   fillRule="evenodd" 
//                   d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" 
//                   clipRule="evenodd" 
//                 />
//               </svg>
//               Apply for Your First Loan
//             </Link>
//           </div>
          
//           {/* Quick Guide Section */}
//           <div className="mt-12 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
//             <div className="bg-white p-6 rounded-lg shadow">
//               <div className="text-green-600 mb-4">
//                 <svg className="h-8 w-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                 </svg>
//               </div>
//               <h4 className="text-lg font-medium mb-2">1. Fill Application</h4>
//               <p className="text-gray-600 text-sm">Complete our simple loan application form with your details</p>
//             </div>
            
//             <div className="bg-white p-6 rounded-lg shadow">
//               <div className="text-green-600 mb-4">
//                 <svg className="h-8 w-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <h4 className="text-lg font-medium mb-2">2. Quick Review</h4>
//               <p className="text-gray-600 text-sm">Our team will review your application promptly</p>
//             </div>
            
//             <div className="bg-white p-6 rounded-lg shadow">
//               <div className="text-green-600 mb-4">
//                 <svg className="h-8 w-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <h4 className="text-lg font-medium mb-2">3. Get Funded</h4>
//               <p className="text-gray-600 text-sm">Receive funds quickly after approval</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Your Loans</h1>
//         <Link
//           to="/apply"
//           className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 flex items-center"
//         >
//           <svg 
//             className="mr-2 -ml-1 h-5 w-5" 
//             xmlns="http://www.w3.org/2000/svg" 
//             viewBox="0 0 20 20" 
//             fill="currentColor"
//           >
//             <path 
//               fillRule="evenodd" 
//               d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" 
//               clipRule="evenodd" 
//             />
//           </svg>
//           Apply for New Loan
//         </Link>
//       </div>
//       <div className="bg-white rounded-lg shadow">
//         <div className="overflow-x-auto">
//           <table className="min-w-full">
//             <thead>
//               <tr className="bg-gray-50">
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Loan ID
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Amount
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Applied Date
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {loans.map((loan) => (
//                 <tr key={loan._id}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     {loan._id.slice(-6)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     ${loan.amount.toLocaleString()}
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
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(loan.createdAt).toLocaleDateString()}
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
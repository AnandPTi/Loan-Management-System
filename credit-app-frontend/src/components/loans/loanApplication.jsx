// src/components/loans/LoanApplication.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const LoanApplication = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    amount: '',
    tenure: '',
    employmentStatus: '',
    reason: '',
    employmentAddress1: '',
    employmentAddress2: '',
    termsAccepted: false,
    creditInfoDisclosure: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/loans/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/dashboard');
      } else {
        setError(data.message || 'Failed to submit loan application');
      }
    } catch (err) {
      setError('An error occurred while submitting your application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow px-6 py-8">
          <h2 className="text-2xl font-bold mb-6">Loan Application</h2>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Loan Amount ($)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                required
                min="1000"
                max="50000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Loan Tenure (months)
              </label>
              <input
                type="number"
                name="tenure"
                value={formData.tenure}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                required
                min="6"
                max="60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Employment Status
              </label>
              <select
                name="employmentStatus"
                value={formData.employmentStatus}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                required
              >
                <option value="">Select status</option>
                <option value="employed">Employed</option>
                <option value="unemployed">Unemployed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Reason for Loan
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                rows="3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Employment Address Line 1
              </label>
              <input
                type="text"
                name="employmentAddress1"
                value={formData.employmentAddress1}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Employment Address Line 2
              </label>
              <input
                type="text"
                name="employmentAddress2"
                value={formData.employmentAddress2}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="mt-1"
                  required
                />
                <label className="ml-2 block text-sm text-gray-700">
                  I accept the terms and conditions
                </label>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="creditInfoDisclosure"
                  checked={formData.creditInfoDisclosure}
                  onChange={handleChange}
                  className="mt-1"
                  required
                />
                <label className="ml-2 block text-sm text-gray-700">
                  I authorize the verification of my credit information
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminAuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // 1. Local storage se token aur user check karein
      const adminToken = localStorage.getItem('adminToken');
      const user = localStorage.getItem('user');

      // 2. Agar token nahi milta, toh login page par bhej dein
      if (!adminToken || !user) {
        console.log("Auth Guard: Access Denied. Redirecting to Login...");
        navigate('/admin/login');
      } else {
        // 3. Agar token hai, toh loading screen hata kar dashboard dikhayein
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Jab tak verification ho raha hai, tab tak spinner dikhega
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-semibold text-lg">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  // Agar authenticated hai, toh actual dashboard components render honge
  return children;
};

export default AdminAuthGuard;
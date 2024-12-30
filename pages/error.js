// pages/api/auth/error.js
"use client"; 

import { useRouter } from 'next/router';
import { useEffect } from 'react';

const ErrorPage = () => {
  const router = useRouter();

  useEffect(() => {
    const { error } = router.query;
    if (error) {
      // You can log or handle the error here
      console.error('Authentication error:', error);
    }
  }, [router.query]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Authentication Error</h2>
        <p className="text-red-500">There was an issue with your login attempt. Please try again.</p>
      </div>
    </div>
  );
};

export default ErrorPage;

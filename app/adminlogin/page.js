'use client';
import { signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BsArrowReturnLeft } from "react-icons/bs";

const EyeIcon = ({ isVisible, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
    style={{ top: 'calc(50% + 2px)' }} // Adjust the vertical position
  >
    {isVisible ? '🙈' : '👁️'}
  </button>
);

const Adminlogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Prevent server-client mismatch by not rendering until the client-side check is complete
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (result.error) {
      setError(result.error); // Set error message from NextAuth
    } else if (result.ok) {
      // Fetch the user role from the server after login
      const response = await fetch('/api/getUserRole', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch user role');
        return; // Stop further actions if the API call fails
      }

      const data = await response.json();

      // Check if the user role is "admin"
      if (data.role !== 'admin') {
        setError('Account must be admin'); // Set an error message for non-admin accounts
        return; // Prevent further actions
      }

      router.push('/admin'); // Redirect to admin dashboard on successful login and admin role
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <Link href={"/"} className="text-black">
          <BsArrowReturnLeft size={20} />
        </Link>
        <h2 className="text-2xl font-heading text-blue-700 mb-4">Admin Login</h2>
        <form onSubmit={handleSubmit} className="relative">
          <label className="block mb-2 text-blue-800 font-body">
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border bg-gray-100 rounded px-3 py-2 w-full"
              required
            />
          </label>
          <label className="block mb-4 text-blue-800 font-body relative">
            Password
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border bg-gray-100 rounded px-3 py-2 w-full pr-10"
              required
            />
            <EyeIcon isVisible={showPassword} onClick={() => setShowPassword(!showPassword)} />
          </label>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Adminlogin;

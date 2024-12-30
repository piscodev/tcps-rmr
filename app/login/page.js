'use client';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const EyeIcon = ({ isVisible, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
  >
    {isVisible ? '🙈' : '👁️'}
  </button>
);

const Login = () => {
  const { data: session } = useSession(); // Accessing session here
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
      // Check the role directly from the session returned by useSession
      if (session?.user.role === 'admin') {
        router.push('/admin'); // Redirect to admin if role is admin
      } else {
        router.push('/'); // Redirect to user dashboard if role is user
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-heading text-blue-700 mb-4">Login</h2>
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
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Sign In
          </button>
          <div>
            <p>
              Not a user? Login as <Link href="/adminlogin">Admin</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

// pages/Profile.js
'use client';
import { useSession } from 'next-auth/react';
import Nav from '/components/adminNav.js';
import { UserCircleIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const { data: session, status } = useSession();
  const user = session?.user; // Direct access to session.user

  if (status === 'loading') return <p>Loading...</p>;
  if (!session) return <p>Please log in to view your profile.</p>;

  return (
    <>
    <Nav>

    </Nav>
     
      <div className="flex flex-col items-center p-8 bg-blue-50 min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <UserCircleIcon className="w-20 h-20 text-gray-300" />
          </div>
          <h1 className="text-3xl font-bold text-blue-700 mb-4">{user.name}</h1>
          <div className="space-y-2">
            <p className="text-lg text-gray-700">Contact No: {user.contact_num}</p>
            <p className="text-lg text-gray-700">Role: {user.role}</p>
          </div>
          <div className="mt-4 space-x-4">
            <button onClick={() => alert('Edit Profile')} className="bg-blue-500 text-white px-4 py-2 rounded">
              Edit Profile
            </button>
            <button onClick={() => alert('Delete Account')} className="bg-red-500 text-white px-4 py-2 rounded">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

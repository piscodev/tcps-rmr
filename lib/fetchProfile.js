// fetchProfile.js in /lib
export const fetchProfile = async (session) => {
  const response = await fetch('/api/profile', {
    headers: {
      Authorization: `Bearer ${session.accessToken}`, // if needed for auth
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch profile data');
  }

  return await response.json(); // Should return { name, contact_num }
};

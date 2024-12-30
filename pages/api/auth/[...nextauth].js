import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import pool from '/lib/db';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const connection = await pool.getConnection();
        try {
          const [rows] = await connection.query('SELECT * FROM users WHERE username = ?', [credentials.username]);
      
          if (rows.length === 0) {
            throw new Error('Invalid username or password');
          }
      
          const user = rows[0];
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
      
          if (!isPasswordValid) {
            throw new Error('Invalid username or password');
          }
      
          // Prevent cross-role logins
          if (credentials.role === 'admin' && user.role !== 'admin') {
            throw new Error('Only admins can access this page');
          }
          if (credentials.role === 'user' && user.role !== 'user') {
            throw new Error('This account is not a user account');
          }
      
          return {
            id: user.user_id,
            username: user.username,
            name: user.name,
            role: user.role,
            contact_num: user.contact_num,
          };
        } finally {
          connection.release();
        }
      }
      ,
    }),
  ],
  pages: {
    signIn: '/adminlogin',
    signOut: '/',
    error: '/error',
  },
  session: {
    strategy: 'jwt',maxAge: 30 * 24 * 60 * 60, // Optional: Customize session duration
    generateSessionToken: ({ token, user }) => {
      if (user?.role === 'admin') {
        return `admin-session-${token.id}`;
      }
      return `user-session-${token.id}`;
    },
  },
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username; // Username for login reference
        token.name = user.name; // Actual name to display
        token.contact_num = user.contact_num;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.username = token.username;
        session.user.name = token.name; // Actual name for profile display
        session.user.contact_num = token.contact_num;
      }
      return session;
    },
  },
});

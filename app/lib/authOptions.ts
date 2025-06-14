import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';
import { connectDB } from './db';
import User from './models/User';

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials?.email });
        if (user) return user;
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token } : {session : any, token : any}) {
        console.log(session, token, "login details")
      if (session?.user) session.user.id = token.sub;      
      return session;
    },
  },
};

export default authOptions;
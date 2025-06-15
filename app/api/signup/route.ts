import { connectDB } from '@/app/lib/db';
import User from '@/app/lib/models/User';
import { hash } from 'bcryptjs';
import { cookies } from 'next/headers';
import authOptions from '@/app/lib/authOptions';
import { encode } from 'next-auth/jwt';

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  await connectDB();

  const userExists = await User.findOne({ email });
  if (userExists) {
    return new Response(JSON.stringify({ message: 'User already exists' }), {
      status: 400,
    });
  }

  const hashedPassword = await hash(password, 12);
  const newUser = await User.create({ name, email, password: hashedPassword });

  // Create session token
  const token = await encode({
    token: {
      sub: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
    },
    secret: authOptions.secret!,
  });

  // Set session cookie
  (await
    // Set session cookie
    cookies()).set({
    name: 'next-auth.session-token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/',
  });

  return new Response(JSON.stringify({ 
    message: 'User created and logged in', 
    user: {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email
    }
  }), {
    status: 201,
  });
}

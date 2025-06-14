import { connectDB } from '@/app/lib/db';
import User from '@/app/lib/models/User';
import { hash } from 'bcryptjs';

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

  return new Response(JSON.stringify({ message: 'User created', user: newUser }), {
    status: 201,
  });
}

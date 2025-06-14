import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/lib/authOptions';
import { connectDB } from '@/app/lib/db';
import Message from '@/app/lib/models/Message';
import User from '@/app/lib/models/User';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { to, text } = await req.json();
  if (!to || !text)
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  await connectDB();

  const sender = await User.findOne({ email: session.user.email });

  const newMessage = new Message({
    from: sender._id,
    to,
    text,
  });

  await newMessage.save();

  return NextResponse.json({ message: 'Message sent' });
}

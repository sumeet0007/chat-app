import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/lib/authOptions';
import { connectDB } from '@/app/lib/db';
import Message from '@/app/lib/models/Message';
import User from '@/app/lib/models/User';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const friendId = searchParams.get('friendId');

  if (!friendId)
    return NextResponse.json({ error: 'Missing friend ID' }, { status: 400 });

  await connectDB();

  const user = await User.findOne({ email: session.user.email });

  const messages = await Message.find({
    $or: [
      { from: user._id, to: friendId },
      { from: friendId, to: user._id },
    ],
  }).sort({ createdAt: 1 });

  const formatted = messages.map((msg) => ({
    text: msg.text,
    sender: String(msg.from) === String(user._id) ? 'You' : 'Friend',
  }));

  return NextResponse.json(
    formatted.map((m) => `${m.sender}: ${m.text}`)
  );
}

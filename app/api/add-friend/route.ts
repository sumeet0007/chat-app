import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';
import User from '@/app/lib/models/User';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/lib/authOptions';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { friendEmail } = await req.json();

  await connectDB();

  const user = await User.findOne({ email: session.user.email });
  const friend = await User.findOne({ email: friendEmail });

  if (!friend || !user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  if (user.friends.includes(friend._id)) {
    return NextResponse.json({ message: 'Already friends' }, { status: 200 });
  }

  user.friends.push(friend._id);
  await user.save();

  return NextResponse.json({ message: 'Friend added' }, { status: 200 });
}

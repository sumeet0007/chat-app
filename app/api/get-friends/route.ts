// /app/api/get-friends/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/lib/authOptions';
import { connectDB } from '@/app/lib/db';
import User from '@/app/lib/models/User';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const user = await User.findOne({ email: session.user.email }).populate('friends', 'email _id');
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user.friends);
}

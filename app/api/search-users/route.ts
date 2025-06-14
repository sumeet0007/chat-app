import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';
import User from '@/app/lib/models/User';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  await connectDB();

  if (!query) return NextResponse.json([], { status: 200 });

  const users = await User.find({
    email: { $regex: query, $options: 'i' }
  }).select('_id name email');

  return NextResponse.json(users, { status: 200 });
}

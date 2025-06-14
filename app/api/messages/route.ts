import Message from '@/app/lib/models/Message';
import { connectDB } from '@/app/lib/db';
import authOptions from '@/app/lib/authOptions';
import { getServerSession } from 'next-auth/next';
export async function GET() {
  await connectDB();
  const messages = await Message.find().populate('sender').sort({ createdAt: 1 });
  return Response.json(messages);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions) as any;
    if (!session || !session.user || !session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }
  
    const { text } = await req.json();
    await connectDB();
    const newMessage = await Message.create({
      text,
      sender: session.user.id    });
    return Response.json(newMessage);
  }
  

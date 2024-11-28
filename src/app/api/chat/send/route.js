import { prisma } from '@/lib/prisma';
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});

export async function POST(request) {
  try {
    const { content, clubId, userId } = await request.json();

    // Get member record
    const member = await prisma.member.findFirst({
      where: {
        userId,
        clubId,
      },
      include: {
        user: true,
      },
    });

    if (!member) {
      return new Response(JSON.stringify({ error: 'User is not a member of this club' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        content,
        memberId: member.id,
        clubId,
      },
      include: {
        member: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Trigger Pusher event
    await pusher.trigger(`club-${clubId}`, 'new-message', message);

    return new Response(JSON.stringify(message), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to send message' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
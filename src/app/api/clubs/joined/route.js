import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const members = await prisma.member.findMany({
      where: { userId },
      include: {
        club: true
      }
    });

    const clubs = members.map(member => member.club);

    return new Response(JSON.stringify(clubs), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch joined clubs' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

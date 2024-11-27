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

    // First check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get all club IDs this user is a member of
    const members = await prisma.member.findMany({
      where: { userId }
    });

    if (!members || !Array.isArray(members)) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get all clubs for these memberships
    const clubIds = members.map(member => member.clubId);
    const clubs = await prisma.club.findMany({
      where: {
        id: {
          in: clubIds
        }
      }
    });

    return new Response(JSON.stringify(clubs), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorResponse = {
      error: 'Failed to fetch joined clubs',
      details: errorMessage
    };
    console.error('Error in /api/clubs/joined:', errorMessage);
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

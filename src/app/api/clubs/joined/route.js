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

    const members = await prisma.member.findMany({
      where: { userId },
      include: {
        club: true
      }
    });

    // Return empty array if no memberships found
    // Ensure we have valid data to return
    if (!members || !Array.isArray(members)) {
      return new Response(JSON.stringify({ error: 'No membership data found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const clubs = members.map(member => member.club);

    return new Response(JSON.stringify(clubs || []), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in /api/clubs/joined:', error);
    const errorResponse = {
      error: 'Failed to fetch joined clubs',
      details: error.message || String(error)
    };
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

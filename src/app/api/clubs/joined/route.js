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

    // Get all clubs this user is a member of with full club details
    const clubs = await prisma.club.findMany({
      where: {
        members: {
          some: {
            userId: userId
          }
        }
      },
      include: {
        members: {
          where: {
            userId: userId
          }
        }
      }
    });

    // Log the query results for debugging
    console.log('Found clubs for user:', userId, JSON.stringify(clubs, null, 2));

    if (!clubs) {
      console.log('No clubs found for user:', userId);
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Transform the data to include all necessary fields
    const formattedClubs = clubs.map(club => ({
      id: club.id,
      name: club.name,
      description: club.description,
      category: club.category,
      members: club.members
    }));

    // Log the clubs data for debugging
    console.log('Found clubs:', JSON.stringify(clubs, null, 2));

    if (!clubs || clubs.length === 0) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

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

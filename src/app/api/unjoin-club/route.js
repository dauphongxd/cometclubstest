import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { userId, clubId } = await request.json();
    
    if (!userId || !clubId) {
      return new Response(JSON.stringify({ error: 'User ID and Club ID are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Delete member relationship
    await prisma.member.delete({
      where: {
        userId_clubId: {
          userId,
          clubId,
        },
      },
    });

    return new Response(JSON.stringify({ 
      message: 'Successfully unjoined club'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to unjoin club' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

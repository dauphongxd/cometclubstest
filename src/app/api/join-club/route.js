import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { userId, clubId } = await request.json();
    
    console.log('Attempting to join club:', { userId, clubId });
    
    if (!userId || !clubId) {
      console.log('Missing required fields:', { userId, clubId });
      return new Response(JSON.stringify({ error: 'User ID and Club ID are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.log('User not found:', userId);
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if club exists
    const club = await prisma.club.findUnique({
      where: { id: clubId },
    });

    if (!club) {
      console.log('Club not found:', clubId);
      return new Response(JSON.stringify({ error: 'Club not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if membership already exists
    const existingMember = await prisma.member.findUnique({
      where: {
        userId_clubId: {
          userId,
          clubId,
        },
      },
    });

    if (existingMember) {
      console.log('Membership already exists:', { userId, clubId });
      return new Response(JSON.stringify({ error: 'Already joined this club' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create member relationship
    const member = await prisma.member.create({
      data: {
        userId,
        clubId,
      },
      include: {
        club: true
      }
    });

    console.log('Successfully created membership:', member);

    return new Response(JSON.stringify({ 
      message: 'Successfully joined',
      member,
      club: member.club
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error joining club:', error);
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return new Response(JSON.stringify({ error: 'Already joined this club' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Handle foreign key constraint failures
    if (error.code === 'P2003') {
      return new Response(JSON.stringify({ error: 'Invalid user or club ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      error: 'Failed to join club',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

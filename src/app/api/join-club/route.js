import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { userId, clubId } = await request.json();
    
    if (!userId || !clubId) {
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
      return new Response(JSON.stringify({ error: 'User not found' }), {
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

    return new Response(JSON.stringify({ 
      message: 'Successfully joined',
      member,
      club: member.club
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return new Response(JSON.stringify({ error: 'Already joined this club' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Failed to join club' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

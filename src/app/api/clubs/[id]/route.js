import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const club = await prisma.club.findUnique({
      where: {
        id: params.id,
      },
      include: {
        members: true,
      },
    });

    if (!club) {
      return new Response(JSON.stringify({ error: 'Club not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(club), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch club' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

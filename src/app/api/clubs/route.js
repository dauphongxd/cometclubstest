import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const clubs = await prisma.club.findMany({
      include: {
        members: true,
      },
    });

    return new Response(JSON.stringify(clubs), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch clubs' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request) {
  try {
    const { name, description, category } = await request.json();

    const club = await prisma.club.create({
      data: {
        name,
        description,
        category,
      },
    });

    return new Response(JSON.stringify(club), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create club' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

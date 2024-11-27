import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const organizations = await prisma.organization.findMany({
      include: {
        members: true,
      },
    });

    return new Response(JSON.stringify(organizations), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch organizations' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request) {
  try {
    const { name, description, userId } = await request.json();

    const organization = await prisma.organization.create({
      data: {
        name,
        description,
        members: {
          create: {
            userId,
            role: 'ADMIN',
          },
        },
      },
    });

    return new Response(JSON.stringify(organization), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create organization' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

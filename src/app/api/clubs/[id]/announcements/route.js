import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const announcements = await prisma.announcement.findMany({
      where: {
        clubId: id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return new Response(JSON.stringify(announcements), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch announcements' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.split(' ')[1];
    const [userId] = Buffer.from(token, 'base64').toString().split('-');

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user?.isAdmin) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { title, content } = await request.json();
    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        clubId: id,
      },
    });

    return new Response(JSON.stringify(announcement), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create announcement' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
  const { id } = params;
  try {
    const announcements = await prisma.announcement.findMany({
      where: {
        clubId: id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return new Response(JSON.stringify(announcements), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch announcements' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request, { params }) {
  const { id } = params;
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.split(' ')[1];
    const [userId] = Buffer.from(token, 'base64').toString().split('-');

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user?.isAdmin) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { title, content } = await request.json();
    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        clubId: id,
      },
    });

    return new Response(JSON.stringify(announcement), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create announcement' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

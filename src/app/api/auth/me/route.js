import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'No token provided' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.split(' ')[1];
    // In a real app, you would verify the JWT token
    // For now, we'll decode the base64 token which contains userId-timestamp
    const [userId] = Buffer.from(token, 'base64').toString().split('-');

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Remove sensitive data
    const { password, ...userWithoutPassword } = user;

    return new Response(JSON.stringify(userWithoutPassword), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Authentication check failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found. Please check your email or register.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return new Response(JSON.stringify({ error: 'Incorrect password. Please try again.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate token
    const token = Buffer.from(`${user.id}-${Date.now()}`).toString('base64');
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return new Response(JSON.stringify({ user: userWithoutPassword, token }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    // Generate a simple token (in a real app, use proper JWT)
    const token = Buffer.from(`${user.id}-${Date.now()}`).toString('base64');

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return new Response(JSON.stringify({ user: userWithoutPassword, token }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Authentication failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

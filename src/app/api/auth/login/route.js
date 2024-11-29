import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Check for admin credentials
    if (email === 'admin@admin.com' && password === 'Djtmemay123!') {
      const adminUser = await prisma.user.upsert({
        where: { email },
        update: { isAdmin: true },
        create: {
          email,
          password: await bcrypt.hash(password, 10),
          name: 'Admin',
          isAdmin: true
        }
      });
      
      const token = Buffer.from(`${adminUser.id}-${Date.now()}`).toString('base64');
      const { password: _, ...userWithoutPassword } = adminUser;
      return new Response(JSON.stringify({ user: userWithoutPassword, token }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // For non-admin login attempts
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
      status: 401,
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

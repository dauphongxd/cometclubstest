import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Only allow admin@admin.com login
    if (email !== 'admin@admin.com' || password !== 'Djtmemay123!') {
      return new Response(JSON.stringify({ error: 'Invalid admin credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create or update admin user
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
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Authentication failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

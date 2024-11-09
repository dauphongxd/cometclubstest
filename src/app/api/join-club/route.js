import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Create new member in database
    const member = await prisma.member.create({
      data: {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        studentId: data.studentId,
        clubName: data.clubName,
      },
    });
    
    return new Response(JSON.stringify({ 
      message: 'Successfully joined',
      member: member 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to process request' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

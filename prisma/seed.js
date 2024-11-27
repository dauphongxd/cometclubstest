import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const clubs = [
    {
      name: 'Computer Science Club',
      description: 'For students interested in programming and technology',
      category: 'Technology'
    },
    {
      name: 'Photography Club',
      description: 'Capture moments and learn photography techniques',
      category: 'Arts'
    },
    {
      name: 'Debate Club',
      description: 'Develop public speaking and argumentation skills',
      category: 'Academic'
    },
    // Add more clubs as needed
  ];

  for (const club of clubs) {
    await prisma.club.create({
      data: club
    });
  }

  console.log('Database has been seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

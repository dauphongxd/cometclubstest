const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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
  }
];

async function main() {
  console.log('Start seeding database...');
  
  for (const club of clubs) {
    const createdClub = await prisma.club.create({
      data: club
    });
    console.log(`Created club: ${createdClub.name}`);
  }
  
  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
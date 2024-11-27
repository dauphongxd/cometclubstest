const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const clubs = [
  {
    name: 'Computer Science Club',
    description: 'For students interested in programming and technology',
    category: 'Technology'
  },
  {
    name: 'Robotics Club',
    description: 'Build and program robots for competitions',
    category: 'Technology'
  },
  {
    name: 'Artificial Intelligence Society',
    description: 'Explore AI, machine learning, and data science',
    category: 'Technology'
  },
  {
    name: 'Photography Club',
    description: 'Capture moments and learn photography techniques',
    category: 'Arts'
  },
  {
    name: 'Art & Design Club',
    description: 'Express creativity through various art mediums',
    category: 'Arts'
  },
  {
    name: 'Theater Society',
    description: 'Perform plays and develop acting skills',
    category: 'Arts'
  },
  {
    name: 'Debate Club',
    description: 'Develop public speaking and argumentation skills',
    category: 'Academic'
  },
  {
    name: 'Mathematics Society',
    description: 'Explore advanced mathematical concepts',
    category: 'Academic'
  },
  {
    name: 'Physics Club',
    description: 'Discover the mysteries of the physical world',
    category: 'Academic'
  },
  {
    name: 'Environmental Society',
    description: 'Promote sustainability and environmental awareness',
    category: 'Environmental'
  },
  {
    name: 'Garden Club',
    description: 'Learn about plants and sustainable gardening',
    category: 'Environmental'
  },
  {
    name: 'Chess Club',
    description: 'Learn strategies and compete in tournaments',
    category: 'Games'
  },
  {
    name: 'Board Game Society',
    description: 'Play and discover new board games',
    category: 'Games'
  },
  {
    name: 'Basketball Club',
    description: 'Play basketball and improve your game',
    category: 'Sports'
  },
  {
    name: 'Soccer Team',
    description: 'Compete in university soccer leagues',
    category: 'Sports'
  },
  {
    name: 'Volleyball Club',
    description: 'Practice and play volleyball together',
    category: 'Sports'
  },
  {
    name: 'Music Society',
    description: 'Make music and perform together',
    category: 'Music'
  },
  {
    name: 'Jazz Band',
    description: 'Play jazz music and improvise',
    category: 'Music'
  },
  {
    name: 'Book Club',
    description: 'Read and discuss various literary works',
    category: 'Literature'
  },
  {
    name: 'Creative Writing Club',
    description: 'Develop writing skills and share stories',
    category: 'Literature'
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
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient, PropertyType, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const DUBLIN_LISTINGS = [
  {
    id: '1',
    title: 'Modern 2-Bed Apartment in Grand Canal Dock',
    address: 'Forbes Quay, Dublin 2',
    price: 2800,
    type: PropertyType.APARTMENT,
    bedrooms: 2,
    bathrooms: 2,
    furnished: true,
    imageUrl: 'https://picsum.photos/seed/house1/600/400',
    source: 'Daft.ie',
    description: 'Stunning two-bedroom apartment with a balcony overlooking the water. Features include a modern kitchen, spacious living area, and secure underground parking.'
  },
  {
    id: '2',
    title: 'Charming Studio in Ranelagh',
    address: 'Ranelagh Village, Dublin 6',
    price: 1600,
    type: PropertyType.STUDIO,
    bedrooms: 1,
    bathrooms: 1,
    furnished: true,
    imageUrl: 'https://picsum.photos/seed/house2/600/400',
    source: 'Rent.ie',
    description: 'A bright and cozy studio apartment in the heart of Ranelagh. Close to shops, restaurants, and the Luas green line for easy city access.'
  },
  {
    id: '3',
    title: 'Spacious 4-Bed House in Dún Laoghaire',
    address: 'Monkstown Road, Dún Laoghaire, Co. Dublin',
    price: 4200,
    type: PropertyType.HOUSE,
    bedrooms: 4,
    bathrooms: 3,
    furnished: false,
    imageUrl: 'https://picsum.photos/seed/house3/600/400',
    source: 'MyHome.ie',
    description: 'An elegant, unfurnished family home with a large private garden. Located minutes from the sea, DART station, and excellent local schools.'
  },
  {
    id: '4',
    title: 'Penthouse Apartment with City Views',
    address: 'The Marker Residence, Dublin 2',
    price: 5500,
    type: PropertyType.APARTMENT,
    bedrooms: 3,
    bathrooms: 3,
    furnished: true,
    imageUrl: 'https://picsum.photos/seed/house4/600/400',
    source: 'Daft.ie',
    description: 'Luxurious penthouse offering panoramic views of Dublin city. Fully furnished to a high standard with access to residents\' gym and concierge service.'
  },
  {
    id: '5',
    title: 'Refurbished 1-Bed in Portobello',
    address: 'South Richmond Street, Dublin 8',
    price: 1950,
    type: PropertyType.APARTMENT,
    bedrooms: 1,
    bathrooms: 1,
    furnished: true,
    imageUrl: 'https://picsum.photos/seed/house5/600/400',
    source: 'Daft.ie',
    description: 'Newly refurbished one-bedroom apartment with stylish interiors. Excellent location along the canal, within walking distance of the city centre.'
  },
  {
    id: '6',
    title: 'Detached Family Home in Clontarf',
    address: 'Clontarf Road, Dublin 3',
    price: 3800,
    type: PropertyType.HOUSE,
    bedrooms: 3,
    bathrooms: 2,
    furnished: false,
    imageUrl: 'https://picsum.photos/seed/house6/600/400',
    source: 'MyHome.ie',
    description: 'Beautiful seaside home with unobstructed views of Dublin Bay. Features a modern kitchen, two reception rooms, and off-street parking.'
  },
   {
    id: '7',
    title: 'Cozy Studio in Temple Bar',
    address: 'Eustace Street, Dublin 2',
    price: 1800,
    type: PropertyType.STUDIO,
    bedrooms: 1,
    bathrooms: 1,
    furnished: true,
    imageUrl: 'https://picsum.photos/seed/house7/600/400',
    source: 'Rent.ie',
    description: 'Live in the cultural heart of Dublin! This compact studio is perfect for a single professional or student wanting a vibrant city life.'
  },
  {
    id: '8',
    title: 'Modern 3-Bed House in Rathmines',
    address: 'Palmerston Park, Dublin 6',
    price: 3500,
    type: PropertyType.HOUSE,
    bedrooms: 3,
    bathrooms: 2,
    furnished: true,
    imageUrl: 'https://picsum.photos/seed/house8/600/400',
    source: 'Daft.ie',
    description: 'A stunning red-brick home overlooking Palmerston Park. Fully furnished with a mix of contemporary and classic styles, plus a private rear patio.'
  },
];

async function main() {
  console.log('Start seeding...');

  // Clear existing data
  await prisma.document.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  // Seed Listings
  for (const listing of DUBLIN_LISTINGS) {
    await prisma.listing.create({
      data: listing,
    });
  }
  console.log(`Seeded ${DUBLIN_LISTINGS.length} listings.`);

  // Seed Users
  const saltRounds = 10;
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@dwelli.app',
      username: 'AdminUser',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });
  console.log(`Created admin user: ${adminUser.email}`);

  const demoUser = await prisma.user.create({
    data: {
      email: 'user@dwelli.app',
      username: 'DemoUser',
      password: hashedPassword,
      role: Role.USER,
      profession: 'Software Engineer',
    },
  });
  console.log(`Created demo user: ${demoUser.email}`);

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    // FIX: Cast process to any to access exit method
    (process as any).exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

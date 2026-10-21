import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Categories
  await prisma.category.createMany({
    data: [
      { name: 'Photographe', slug: 'photographe' },
      { name: 'Traiteur', slug: 'traiteur' },
      { name: 'Lieu', slug: 'lieu' },
      { name: 'Animation', slug: 'animation' },
    ],
    skipDuplicates: true,
  });

  // Example provider user
  const providerPassword = await bcrypt.hash('provider123', 10);
  const providerUser = await prisma.user.upsert({
    where: { email: 'provider@example.com' },
    update: {},
    create: {
      email: 'provider@example.com',
      passwordHash: providerPassword,
      firstName: 'Ali',
      lastName: 'Ben',
      role: UserRole.PRESTATAIRE,
    },
  });

  await prisma.providerProfile.upsert({
    where: { userId: providerUser.id },
    update: {},
    create: {
      userId: providerUser.id,
      slug: 'ali-photographe',
      businessName: 'Ali Photographie',
      status: 'VERIFIED',
    },
  });

  // Example client user
  const clientPassword = await bcrypt.hash('client123', 10);
  const clientUser = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      email: 'client@example.com',
      passwordHash: clientPassword,
      firstName: 'Sarra',
      lastName: 'Mansour',
      role: UserRole.CLIENT,
    },
  });

  // Example event for the client
  await prisma.event.upsert({
    where: { title: 'Mariage de Sarra' },
    update: {},
    create: {
      clientId: clientUser.id,
      title: 'Mariage de Sarra',
      type: 'MARIAGE',
      date: new Date('2024-06-15'),
      governorate: 'Tunis',
      city: 'Tunis',
      guestCount: 120,
      budgetMillimes: 5000000,
    },
  });

  console.log('✅ Seed data inserted');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

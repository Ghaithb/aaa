import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // ── CATEGORIES ─────────────────────────────────────
  await prisma.category.createMany({
    data: [
      { name: 'Photographe', slug: 'photographe' },
      { name: 'Traiteur', slug: 'traiteur' },
      { name: 'Lieu', slug: 'lieu' },
      { name: 'Animation', slug: 'animation' },
    ],
    skipDuplicates: true,
  });

  // ── PROVIDER USER ─────────────────────────────────
  const providerPwd = await bcrypt.hash('provider123', 10);
  const providerUser = await prisma.user.upsert({
    where: { email: 'provider@example.com' },
    update: {},
    create: {
      email: 'provider@example.com',
      passwordHash: providerPwd,
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

  // ── CLIENT USER ───────────────────────────────────
  const clientPwd = await bcrypt.hash('client123', 10);
  const clientUser = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      email: 'client@example.com',
      passwordHash: clientPwd,
      firstName: 'Sarra',
      lastName: 'Mansour',
      role: UserRole.CLIENT,
    },
  });

  // ── EXAMPLE EVENT ─────────────────────────────────
  // Use findFirst + create instead of upsert because title is not a unique field
  const existing = await prisma.event.findFirst({ where: { clientId: clientUser.id, title: 'Mariage de Sarra' } });
  if (!existing) {
    await prisma.event.create({
      data: {
        clientId: clientUser.id,
        title: 'Mariage de Sarra',
        type: 'MARIAGE',
        date: new Date('2024-06-15'),
        governorate: 'Tunis',
        city: 'Tunis',
        guestCount: 120,
        budgetMillimes: 5_000_000,
      },
    });
  }

  console.log('✅ FERHA seed data inserted!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

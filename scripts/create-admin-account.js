const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  const adminPasswordHash = hashPassword('admin123');

  // 1. Create or update primary Super Admin
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@asadlandholdings.com' },
    update: {
      password: adminPasswordHash,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      name: 'System Administrator',
      firstName: 'System',
      lastName: 'Admin',
      jobTitle: 'Super Administrator',
    },
    create: {
      email: 'admin@asadlandholdings.com',
      password: adminPasswordHash,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      name: 'System Administrator',
      firstName: 'System',
      lastName: 'Admin',
      jobTitle: 'Super Administrator',
      phone: '+92 300 5123456',
      whatsappNumber: '+92 300 5123456',
    },
  });

  // 2. Update asad@asadlandholdings.com as well
  const asadUser = await prisma.user.upsert({
    where: { email: 'asad@asadlandholdings.com' },
    update: {
      password: adminPasswordHash,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      name: 'Asad Ali',
      firstName: 'Asad',
      lastName: 'Ali',
      jobTitle: 'Managing Director',
    },
    create: {
      email: 'asad@asadlandholdings.com',
      password: adminPasswordHash,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      name: 'Asad Ali',
      firstName: 'Asad',
      lastName: 'Ali',
      jobTitle: 'Managing Director',
      phone: '+92 300 5123456',
      whatsappNumber: '+92 300 5123456',
    },
  });

  console.log('--- ADMIN ACCOUNTS CREATED / UPDATED SUCCESSFULLY ---');
  console.log('Account 1:');
  console.log('  Email:    admin@asadlandholdings.com');
  console.log('  Password: admin123');
  console.log('  Role:     SUPER_ADMIN');
  console.log('');
  console.log('Account 2:');
  console.log('  Email:    asad@asadlandholdings.com');
  console.log('  Password: admin123');
  console.log('  Role:     SUPER_ADMIN');
  console.log('------------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('Error creating admin account:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';
import { PERMISSIONS, seedPermissions, grantPermission } from '@/lib/permissions';
import { prisma } from "@/lib/prisma";

const prismaClient = new PrismaClient();

const permissions = [
  {
    name: "MANAGE_BADGES",
    description: "Can create, edit and delete badges",
  },
  {
    name: "BYPASS_TUTORIAL_VALIDATION",
    description: "Can publish tutorials without requiring moderation",
  },
];

async function main() {
  console.log('Seeding permissions...');
  
  // Seed the permissions
  await seedPermissions();
  
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: permission,
      create: permission,
    });
  }

  // If an admin user ID is provided, grant them the ADMIN permission
  if (process.env.ADMIN_DISCORD_ID) {
    const adminUser = await prismaClient.user.findFirst({
      where: {
        accounts: {
          some: {
            provider: 'discord',
            providerAccountId: process.env.ADMIN_DISCORD_ID
          }
        }
      }
    });
    
    if (adminUser) {
      console.log(`Granting ADMIN permission to user with ID ${adminUser.id}`);
      await grantPermission(adminUser.id, PERMISSIONS.ADMIN);
      
      // Also set the role to ADMIN for backwards compatibility
      await prismaClient.user.update({
        where: { id: adminUser.id },
        data: { role: 'ADMIN' }
      });
      console.log('Admin user updated successfully');
    } else {
      console.log(`No user found with Discord ID ${process.env.ADMIN_DISCORD_ID}`);
      console.log('Admin permission will be granted when this user logs in');
    }
  }
  
  // Example: grant VALIDATE_TUTORIAL permission to tutorial moderators
  const moderators = await prismaClient.user.findMany({
    where: { role: 'TUTORIAL_MODERATOR' }
  });
  
  for (const moderator of moderators) {
    console.log(`Granting VALIDATE_TUTORIAL permission to tutorial moderator ${moderator.id}`);
    await grantPermission(moderator.id, PERMISSIONS.VALIDATE_TUTORIAL);
  }
  
  // Example: grant BYPASS_TUTORIAL_VALIDATION to tutorial creators
  const creators = await prismaClient.user.findMany({
    where: { role: 'TUTORIAL_CREATOR' }
  });
  
  for (const creator of creators) {
    console.log(`Granting BYPASS_TUTORIAL_VALIDATION permission to tutorial creator ${creator.id}`);
    await grantPermission(creator.id, PERMISSIONS.BYPASS_TUTORIAL_VALIDATION);
  }
  
  console.log('Permission seeding completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
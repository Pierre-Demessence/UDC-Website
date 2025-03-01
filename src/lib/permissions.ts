import { prisma } from './prisma';

// Define permission constants
export const PERMISSIONS = {
  ADMIN: 'ADMIN',
  VALIDATE_TUTORIAL: 'VALIDATE_TUTORIAL',
  BYPASS_TUTORIAL_VALIDATION: 'BYPASS_TUTORIAL_VALIDATION',
} as const;

export type Permission = keyof typeof PERMISSIONS;

// Check if a user has a specific permission
export async function hasPermission(userId: string, permission: Permission): Promise<boolean> {
  try {
    const count = await prisma.userPermission.count({
      where: {
        userId,
        permission: {
          name: permission,
        },
      },
    });
    
    return count > 0;
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
}

// Check if a user has any of the specified permissions
export async function hasAnyPermission(userId: string, permissions: Permission[]): Promise<boolean> {
  try {
    const count = await prisma.userPermission.count({
      where: {
        userId,
        permission: {
          name: {
            in: permissions,
          },
        },
      },
    });
    
    return count > 0;
  } catch (error) {
    console.error('Error checking permissions:', error);
    return false;
  }
}

// Get all permissions for a user
export async function getUserPermissions(userId: string): Promise<string[]> {
  try {
    const userPermissions = await prisma.userPermission.findMany({
      where: {
        userId,
      },
      include: {
        permission: {
          select: {
            name: true,
          },
        },
      },
    });
    
    return userPermissions.map((up) => up.permission.name);
  } catch (error) {
    console.error('Error getting user permissions:', error);
    return [];
  }
}

// Grant a permission to a user
export async function grantPermission(userId: string, permission: Permission): Promise<void> {
  try {
    // Check if the Permission model exists in the database
    // This will throw an error if the table doesn't exist yet
    await prisma.$queryRaw`SELECT 1 FROM "Permission" LIMIT 1`.catch(() => {
      console.warn('Permission table does not exist yet. Skipping permission grant.');
      return;
    });
    
    // First, find or create the permission
    const permissionRecord = await prisma.permission.upsert({
      where: {
        name: permission,
      },
      update: {},
      create: {
        name: permission,
        description: `Permission to ${permission.toLowerCase().replace(/_/g, ' ')}`,
      },
    });
    
    // Then, assign it to the user (if they don't already have it)
    await prisma.userPermission.upsert({
      where: {
        userId_permissionId: {
          userId,
          permissionId: permissionRecord.id,
        },
      },
      update: {},
      create: {
        userId,
        permissionId: permissionRecord.id,
      },
    });
  } catch (error) {
    console.error('Error granting permission:', error);
    // Don't throw the error so authentication can still proceed
  }
}

// Revoke a permission from a user
export async function revokePermission(userId: string, permission: Permission): Promise<void> {
  try {
    const permissionRecord = await prisma.permission.findUnique({
      where: {
        name: permission,
      },
    });
    
    if (!permissionRecord) {
      return; // Permission doesn't exist, so user can't have it
    }
    
    await prisma.userPermission.deleteMany({
      where: {
        userId,
        permissionId: permissionRecord.id,
      },
    });
  } catch (error) {
    console.error('Error revoking permission:', error);
  }
}

// Seed the initial permissions
export async function seedPermissions(): Promise<void> {
  try {
    const permissions = Object.values(PERMISSIONS);
    
    for (const permission of permissions) {
      await prisma.permission.upsert({
        where: {
          name: permission,
        },
        update: {},
        create: {
          name: permission,
          description: `Permission to ${permission.toLowerCase().replace(/_/g, ' ')}`,
        },
      });
    }
    
    console.log('Permissions seeded successfully');
  } catch (error) {
    console.error('Error seeding permissions:', error);
  }
}
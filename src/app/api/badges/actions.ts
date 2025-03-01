'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Admin check middleware
async function checkAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized. Admin access required.");
  }
}

// Create a new badge (admin only)
export async function createBadge(data: {
  name: string;
  description: string;
  imageUrl: string;
}) {
  await checkAdmin();
  
  const badge = await prisma.badge.create({
    data
  });
  
  revalidatePath('/badges');
  return badge;
}

// Update a badge (admin only)
export async function updateBadge(id: string, data: {
  name?: string;
  description?: string;
  imageUrl?: string;
}) {
  await checkAdmin();
  
  const badge = await prisma.badge.update({
    where: { id },
    data
  });
  
  revalidatePath('/badges');
  return badge;
}

// Delete a badge (admin only)
export async function deleteBadge(id: string) {
  await checkAdmin();
  
  await prisma.badge.delete({
    where: { id }
  });
  
  revalidatePath('/badges');
}

// Award a badge to a user (admin only)
export async function awardBadge(userId: string, badgeId: string) {
  await checkAdmin();
  
  const userBadge = await prisma.userBadge.create({
    data: {
      userId,
      badgeId
    }
  });
  
  revalidatePath('/badges');
  revalidatePath(`/users/${userId}`);
  return userBadge;
}

// Remove a badge from a user (admin only)
export async function removeBadgeFromUser(userId: string, badgeId: string) {
  await checkAdmin();
  
  await prisma.userBadge.delete({
    where: {
      userId_badgeId: {
        userId,
        badgeId
      }
    }
  });
  
  revalidatePath('/badges');
  revalidatePath(`/users/${userId}`);
}
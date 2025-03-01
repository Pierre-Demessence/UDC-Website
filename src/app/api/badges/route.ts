import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Get all badges or filter by user
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");
  
  if (userId) {
    // Get badges for a specific user
    const userBadges = await prisma.userBadge.findMany({
      where: { userId },
      include: {
        badge: true
      }
    });
    return NextResponse.json(userBadges.map(ub => ub.badge));
  } else {
    // Get all badges
    const badges = await prisma.badge.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    return NextResponse.json(badges);
  }
}
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = params;
  const { score } = await request.json();

  if (typeof score !== "number" || score < 1 || score > 5) {
    return new NextResponse("Invalid rating score", { status: 400 });
  }

  // Use upsert to either create or update the rating
  const rating = await prisma.rating.upsert({
    where: {
      userId_tutorialId: {
        userId: session.user.id,
        tutorialId: id,
      },
    },
    create: {
      score,
      userId: session.user.id,
      tutorialId: id,
    },
    update: {
      score,
    },
  });

  return NextResponse.json(rating);
}
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user || 
      (session.user.role !== "ADMIN" && session.user.role !== "TUTORIAL_MODERATOR")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = params;
  const { isValidated } = await request.json();

  const tutorial = await prisma.tutorial.update({
    where: { id },
    data: { isValidated },
  });

  return NextResponse.json(tutorial);
}
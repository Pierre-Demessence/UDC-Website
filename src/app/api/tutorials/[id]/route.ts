import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = params;
  const { title, content, isPublished } = await request.json();

  // Get the tutorial to check ownership
  const existingTutorial = await prisma.tutorial.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
        }
      }
    }
  });

  if (!existingTutorial) {
    return new NextResponse("Tutorial not found", { status: 404 });
  }

  // Only allow author and admins to edit
  if (existingTutorial.author.id !== session.user.id && 
      session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const tutorial = await prisma.tutorial.update({
    where: { id },
    data: {
      title,
      content,
      isPublished,
      // Set publishedAt when publishing for the first time
      publishedAt: !existingTutorial.isPublished && isPublished ? new Date() : undefined,
    },
  });

  return NextResponse.json(tutorial);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  await prisma.tutorial.delete({
    where: { id }
  });

  return new NextResponse(null, { status: 204 });
}
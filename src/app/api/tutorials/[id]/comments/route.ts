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
  const { content } = await request.json();

  if (!content?.trim()) {
    return new NextResponse("Comment content is required", { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      authorId: session.user.id,
      tutorialId: id,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        }
      }
    }
  });

  return NextResponse.json(comment);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  const comments = await prisma.comment.findMany({
    where: {
      tutorialId: id,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(comments);
}

// Delete a comment - Admin only or comment author
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = params;
  const { commentId } = await request.json();

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      author: {
        select: { id: true }
      }
    }
  });

  if (!comment) {
    return new NextResponse("Comment not found", { status: 404 });
  }

  // Allow admin or comment author to delete
  if (comment.author.id !== session.user.id && session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  await prisma.comment.delete({
    where: { id: commentId }
  });

  return new NextResponse(null, { status: 204 });
}
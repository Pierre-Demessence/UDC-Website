import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Get all tutorials or filter by status
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const published = searchParams.get("published") === "true";
  const validated = searchParams.get("validated") === "true";
  const authorId = searchParams.get("authorId");

  const where: any = {};
  if (typeof published === "boolean") where.isPublished = published;
  if (typeof validated === "boolean") where.isValidated = validated;
  if (authorId) where.authorId = authorId;

  const tutorials = await prisma.tutorial.findMany({
    where,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        }
      },
      ratings: {
        select: {
          score: true,
        }
      },
      _count: {
        select: {
          comments: true,
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  // Calculate average rating for each tutorial
  const tutorialsWithStats = tutorials.map(tutorial => {
    const avgRating = tutorial.ratings.length > 0
      ? tutorial.ratings.reduce((sum, r) => sum + r.score, 0) / tutorial.ratings.length
      : null;

    const { ratings, ...rest } = tutorial;
    return {
      ...rest,
      avgRating,
    };
  });

  return NextResponse.json(tutorialsWithStats);
}

// Create a new tutorial
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await request.json();
  const { title, content } = data;

  if (!title || !content) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  // Check if user is allowed to create tutorials without validation
  const canBypassValidation = session.user.role === "ADMIN" || 
    session.user.permissions?.includes("BYPASS_TUTORIAL_VALIDATION");

  const tutorial = await prisma.tutorial.create({
    data: {
      title,
      content,
      authorId: session.user.id,
      isPublished: true,
      isValidated: canBypassValidation, // Auto-validate for users with bypass permission
    },
  });

  return NextResponse.json(tutorial);
}
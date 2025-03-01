import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// Admin check middleware
async function checkAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized. Admin access required.");
  }
}

export async function GET() {
    const jams = await prisma.gameJam.findMany({
        orderBy: {
            startDate: 'asc'
        },
        where: {
            startDate: {
                gte: new Date() // Only get upcoming jams
            }
        }
    });
    return NextResponse.json(jams);
}

export async function POST(request: NextRequest) {
    await checkAdmin();

    const data = await request.json();
    const { title, startDate, endDate, itchIoUrl } = data;

    const jam = await prisma.gameJam.create({
        data: {
            title,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            itchIoUrl
        }
    });

    return NextResponse.json(jam);
}

export async function PUT(request: NextRequest) {
    await checkAdmin();

    const data = await request.json();
    const { id, title, startDate, endDate, itchIoUrl } = data;

    const jam = await prisma.gameJam.update({
        where: { id },
        data: {
            title,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            itchIoUrl
        }
    });

    return NextResponse.json(jam);
}

export async function DELETE(request: NextRequest) {
    await checkAdmin();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
        return new NextResponse('Missing id parameter', { status: 400 });
    }

    await prisma.gameJam.delete({
        where: { id }
    });

    return new NextResponse(null, { status: 204 });
}
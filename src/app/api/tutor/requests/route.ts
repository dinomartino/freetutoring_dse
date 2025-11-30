import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET - Browse available tutoring requests (public for approved tutors)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "OPEN";
    const subject = searchParams.get("subject");
    const gradeLevel = searchParams.get("gradeLevel");

    // Build where clause
    const where: any = {
      status: status as "OPEN" | "CLOSED" | "MATCHED",
    };

    if (subject) {
      where.subjects = {
        has: subject,
      };
    }

    if (gradeLevel) {
      where.gradeLevel = gradeLevel;
    }

    // Fetch requests with student info (but hide sensitive data)
    const requests = await prisma.tutoringRequest.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            gradeLevel: true,
            subjectsNeeded: true,
            // Don't include phone, fullName for privacy
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50, // Limit results
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Error fetching tutoring requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}

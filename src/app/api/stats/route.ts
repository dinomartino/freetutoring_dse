import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Get counts in parallel for better performance
    const [
      approvedStudentsCount,
      approvedTutorsCount,
      openRequestsCount,
      totalMatchesCount,
    ] = await Promise.all([
      prisma.studentProfile.count({
        where: { verificationStatus: "APPROVED" },
      }),
      prisma.tutorProfile.count({
        where: { verificationStatus: "APPROVED" },
      }),
      prisma.tutoringRequest.count({
        where: { status: "OPEN" },
      }),
      prisma.connectionRequest.count({
        where: { status: "ACCEPTED" },
      }),
    ]);

    return NextResponse.json({
      students: approvedStudentsCount,
      tutors: approvedTutorsCount,
      openRequests: openRequestsCount,
      totalMatches: totalMatchesCount,
    });
  } catch (error) {
    console.error("Error fetching platform statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}

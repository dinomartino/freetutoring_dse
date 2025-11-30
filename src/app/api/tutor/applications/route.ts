import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET - Get tutor's applications
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get tutor profile
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId: user.id },
    });

    if (!tutorProfile) {
      return NextResponse.json(
        { error: "Tutor profile not found" },
        { status: 404 }
      );
    }

    // Fetch all applications with request details
    const applications = await prisma.tutorApplication.findMany({
      where: { tutorId: tutorProfile.id },
      include: {
        request: {
          include: {
            student: {
              select: {
                id: true,
                gradeLevel: true,
                subjectsNeeded: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

// POST - Apply to a tutoring request
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get tutor profile
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId: user.id },
    });

    if (!tutorProfile) {
      return NextResponse.json(
        { error: "Tutor profile not found" },
        { status: 404 }
      );
    }

    // Check if tutor is approved
    if (tutorProfile.verificationStatus !== "APPROVED") {
      return NextResponse.json(
        { error: "Your account must be approved before applying to requests" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { requestId, message, proposedSchedule } = body;

    // Validation
    if (!requestId || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if request exists and is open
    const tutoringRequest = await prisma.tutoringRequest.findUnique({
      where: { id: requestId },
    });

    if (!tutoringRequest) {
      return NextResponse.json(
        { error: "Tutoring request not found" },
        { status: 404 }
      );
    }

    if (tutoringRequest.status !== "OPEN") {
      return NextResponse.json(
        { error: "This request is no longer accepting applications" },
        { status: 400 }
      );
    }

    // Check if tutor already applied
    const existingApplication = await prisma.tutorApplication.findUnique({
      where: {
        requestId_tutorId: {
          requestId,
          tutorId: tutorProfile.id,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied to this request" },
        { status: 400 }
      );
    }

    // Create application
    const application = await prisma.tutorApplication.create({
      data: {
        requestId,
        tutorId: tutorProfile.id,
        message,
        proposedSchedule: proposedSchedule
          ? JSON.stringify(proposedSchedule)
          : null,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      { message: "Application submitted successfully", application },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}

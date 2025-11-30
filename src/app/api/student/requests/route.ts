import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET - Fetch student's tutoring requests
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get student profile
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: user.id },
    });

    if (!studentProfile) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 }
      );
    }

    // Fetch all tutoring requests for this student with applications
    const requests = await prisma.tutoringRequest.findMany({
      where: { studentId: studentProfile.id },
      include: {
        applications: {
          include: {
            tutor: {
              select: {
                id: true,
                fullName: true,
                educationLevel: true,
                subjectsTaught: true,
                bio: true,
                examResults: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        selectedTutor: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            educationLevel: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
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

// POST - Create a new tutoring request
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get student profile
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: user.id },
    });

    if (!studentProfile) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 }
      );
    }

    // Check if student is approved
    if (studentProfile.verificationStatus !== "APPROVED") {
      return NextResponse.json(
        { error: "Your account must be approved before posting requests" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, subjects, description, preferredSchedule } = body;

    // Validation
    if (!title || !subjects || subjects.length === 0 || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create tutoring request
    const tutoringRequest = await prisma.tutoringRequest.create({
      data: {
        studentId: studentProfile.id,
        title,
        subjects,
        gradeLevel: studentProfile.gradeLevel,
        description,
        preferredSchedule: preferredSchedule
          ? JSON.stringify(preferredSchedule)
          : null,
        status: "OPEN",
      },
    });

    return NextResponse.json(
      { message: "Tutoring request created successfully", request: tutoringRequest },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating tutoring request:", error);
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 }
    );
  }
}

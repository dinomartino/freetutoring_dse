import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// PATCH - Accept or reject an application
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { action } = body; // "accept" or "reject"

    if (!action || (action !== "accept" && action !== "reject")) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'accept' or 'reject'" },
        { status: 400 }
      );
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

    // Get application with request
    const application = await prisma.tutorApplication.findUnique({
      where: { id },
      include: {
        request: true,
        tutor: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            educationLevel: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (application.request.studentId !== studentProfile.id) {
      return NextResponse.json(
        { error: "Unauthorized to modify this application" },
        { status: 403 }
      );
    }

    if (action === "accept") {
      // Use transaction to ensure consistency
      const result = await prisma.$transaction(async (tx) => {
        // 1. Update application status to ACCEPTED
        const updatedApplication = await tx.tutorApplication.update({
          where: { id },
          data: { status: "ACCEPTED" },
        });

        // 2. Reject all other applications for this request
        await tx.tutorApplication.updateMany({
          where: {
            requestId: application.requestId,
            id: { not: id },
            status: "PENDING",
          },
          data: { status: "REJECTED" },
        });

        // 3. Update request status to MATCHED and set selectedTutorId
        await tx.tutoringRequest.update({
          where: { id: application.requestId },
          data: {
            status: "MATCHED",
            selectedTutorId: application.tutorId,
          },
        });

        // 4. Create a connection request (final pairing)
        const connection = await tx.connectionRequest.create({
          data: {
            studentId: studentProfile.id,
            tutorId: application.tutorId,
            tutoringRequestId: application.requestId,
            status: "ACCEPTED", // Automatically accepted since student chose them
            notes: `Matched through tutoring request: ${application.request.title}`,
          },
        });

        return { updatedApplication, connection };
      });

      return NextResponse.json({
        message: "Application accepted and tutor matched successfully",
        application: result.updatedApplication,
        connection: result.connection,
        tutorContact: application.tutor, // Return tutor contact info
      });
    } else {
      // Reject application
      const updatedApplication = await prisma.tutorApplication.update({
        where: { id },
        data: { status: "REJECTED" },
      });

      return NextResponse.json({
        message: "Application rejected",
        application: updatedApplication,
      });
    }
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}

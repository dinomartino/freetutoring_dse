import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// PATCH - Update request status (close/reopen)
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
    const { status } = body;

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

    // Verify ownership
    const tutoringRequest = await prisma.tutoringRequest.findUnique({
      where: { id },
    });

    if (!tutoringRequest || tutoringRequest.studentId !== studentProfile.id) {
      return NextResponse.json(
        { error: "Request not found or unauthorized" },
        { status: 404 }
      );
    }

    // Update status
    const updatedRequest = await prisma.tutoringRequest.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ request: updatedRequest });
  } catch (error) {
    console.error("Error updating tutoring request:", error);
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a tutoring request
export async function DELETE(
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

    // Verify ownership
    const tutoringRequest = await prisma.tutoringRequest.findUnique({
      where: { id },
    });

    if (!tutoringRequest || tutoringRequest.studentId !== studentProfile.id) {
      return NextResponse.json(
        { error: "Request not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete request (applications will cascade delete)
    await prisma.tutoringRequest.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting tutoring request:", error);
    return NextResponse.json(
      { error: "Failed to delete request" },
      { status: 500 }
    );
  }
}

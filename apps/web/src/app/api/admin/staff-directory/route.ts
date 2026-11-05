import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ADMIN_EMAILS } from "@/lib/server/adminAccess";
const STAFF_ROLES = ["admin", "clinician", "counselor"] as const;
type StaffRole = (typeof STAFF_ROLES)[number];

async function getAdminContext() {
  const { userId } = await auth();
  if (!userId) return null;

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const email = user.primaryEmailAddress?.emailAddress.toLowerCase().trim();
  if (user.publicMetadata.role !== "admin" && !ADMIN_EMAILS.has(email ?? "")) {
    return null;
  }

  return { client, userId };
}

function emailAndName(
  user: Awaited<ReturnType<Awaited<ReturnType<typeof clerkClient>>["users"]["getUser"]>>,
  email = user.primaryEmailAddress?.emailAddress ?? "",
) {
  return {
    id: user.id,
    email,
    displayName:
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      email ||
      "Staff member",
    role: user.publicMetadata.role,
  };
}

export async function GET(request: Request) {
  try {
    const admin = await getAdminContext();
    if (!admin) {
      return NextResponse.json({ error: "Administrator access is required." }, { status: 403 });
    }

    const url = new URL(request.url);
    const role = url.searchParams.get("role");
    if (role === "admin") {
      const { data } = await admin.client.users.getUserList({ limit: 500 });
      const administrators = data.filter((candidate) => {
        const email = candidate.primaryEmailAddress?.emailAddress?.toLowerCase().trim();
        return Boolean(email) &&
          (candidate.publicMetadata.role === "admin" || ADMIN_EMAILS.has(email ?? ""));
      });
      return NextResponse.json({
        users: administrators.map((user) => emailAndName(user)),
      });
    }

    const email = url.searchParams.get("email")?.trim().toLowerCase();
    if (email) {
      const { data } = await admin.client.users.getUserList({
        emailAddress: [email],
        limit: 10,
      });
      const user = data.find((candidate) =>
        candidate.emailAddresses.some(
          (address) =>
            address.emailAddress.toLowerCase() === email &&
            address.verification?.status === "verified",
        ),
      );
      const verifiedEmail = user?.emailAddresses.find(
        (address) =>
          address.emailAddress.toLowerCase() === email &&
          address.verification?.status === "verified",
      );
      if (!user || !verifiedEmail) {
        return NextResponse.json(
          { error: "No verified Clerk account was found for that email." },
          { status: 404 },
        );
      }
      return NextResponse.json({
        user: emailAndName(user, verifiedEmail.emailAddress),
      });
    }

    const ids = (url.searchParams.get("userIds") ?? "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
    if (ids.length === 0 || ids.length > 100) {
      return NextResponse.json({ error: "Provide between 1 and 100 account IDs." }, { status: 400 });
    }

    const { data } = await admin.client.users.getUserList({
      userId: ids,
      limit: ids.length,
    });
    return NextResponse.json({ users: data.map((user) => emailAndName(user)) });
  } catch {
    return NextResponse.json(
      { error: "Unable to read Clerk staff accounts right now." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getAdminContext();
    if (!admin) {
      return NextResponse.json({ error: "Administrator access is required." }, { status: 403 });
    }

    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "A staff account and role are required." }, { status: 400 });
    }

    const { userId, role } = body as { userId?: unknown; role?: unknown };
    if (
      typeof userId !== "string" ||
      (role !== null && !STAFF_ROLES.includes(role as StaffRole))
    ) {
      return NextResponse.json({ error: "The staff account or role is invalid." }, { status: 400 });
    }
    if (userId === admin.userId && role !== "admin") {
      return NextResponse.json(
        { error: "You cannot remove your own administrator role." },
        { status: 400 },
      );
    }

    const target = await admin.client.users.getUser(userId);
    const previousRole = STAFF_ROLES.includes(target.publicMetadata.role as StaffRole)
      ? (target.publicMetadata.role as StaffRole)
      : null;
    const publicMetadata = { ...target.publicMetadata };
    if (role === null) {
      delete publicMetadata.role;
    } else {
      publicMetadata.role = role;
    }
    await admin.client.users.updateUserMetadata(userId, { publicMetadata });

    return NextResponse.json({ previousRole });
  } catch {
    return NextResponse.json(
      { error: "Unable to synchronize the staff role with Clerk." },
      { status: 500 },
    );
  }
}
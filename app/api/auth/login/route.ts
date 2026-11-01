import { z } from "zod";
import { createSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { UNKNOWN_USER_HASH, verifyPassword } from "@/lib/password";
import { User } from "@/models/User";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().min(1).max(254),
  password: z.string().min(1).max(128),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "請輸入 Email 和密碼" }, { status: 400 });
  }

  const { email, password } = parsed.data;

  try {
    await connectToDatabase();
    const user = await User.findOne({ email }).select("+password");
    const isValid = await verifyPassword(
      password,
      user?.password ?? UNKNOWN_USER_HASH,
    );

    if (!user || !isValid) {
      return Response.json({ error: "Email 或密碼不正確" }, { status: 401 });
    }

    await createSession(user.id);
    return Response.json({ name: user.name });
  } catch (error) {
    console.error("Failed to log in", error);
    return Response.json({ error: "登入失敗，請稍後再試" }, { status: 500 });
  }
}

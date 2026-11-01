import { z } from "zod";
import { createSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { hashPassword } from "@/lib/password";
import { User } from "@/models/User";

const DUPLICATE_KEY_ERROR = 11000;
const REGISTRATION_CODE = "love";

const registerSchema = z.object({
  email: z
    .string("請輸入 Email")
    .trim()
    .toLowerCase()
    .max(254, "Email 格式不正確")
    .pipe(z.email("Email 格式不正確")),
  password: z
    .string("請輸入密碼")
    .min(8, "密碼至少需要 8 個字元")
    .max(128, "密碼不可超過 128 個字元"),
  name: z
    .string("請輸入名稱")
    .trim()
    .min(1, "請輸入名稱")
    .max(50, "名稱不可超過 50 個字"),
  code: z.string("請輸入驗證碼").trim().min(1, "請輸入驗證碼"),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const { email, password, name, code } = parsed.data;

  if (code !== REGISTRATION_CODE) {
    return Response.json({ error: "驗證碼不正確" }, { status: 403 });
  }

  try {
    await connectToDatabase();
    // Role is never taken from the request, so everyone registers as "user".
    const user = await User.create({
      email,
      name,
      password: await hashPassword(password),
    });
    await createSession(user.id);

    return Response.json({ name: user.name }, { status: 201 });
  } catch (error) {
    if ((error as { code?: number }).code === DUPLICATE_KEY_ERROR) {
      return Response.json({ error: "這個 Email 已經註冊過了" }, { status: 409 });
    }
    console.error("Failed to register user", error);
    return Response.json({ error: "註冊失敗，請稍後再試" }, { status: 500 });
  }
}

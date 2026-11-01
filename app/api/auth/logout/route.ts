import { deleteSession } from "@/lib/auth";

export async function POST() {
  await deleteSession();
  return new Response(null, { status: 204 });
}

import { analyzeExpense, OPENAI_MODEL } from "@/lib/analyze-expense";
import { getSessionUserId } from "@/lib/auth";
import {
  isValidDate,
  isValidMonth,
  isValidYear,
  todayInTaipei,
} from "@/lib/dates";
import { connectToDatabase } from "@/lib/mongodb";
import { Expense } from "@/models/Expense";
import { User } from "@/models/User";

const MAX_TEXT_LENGTH = 1000;

type MonthItemRow = {
  _id: unknown;
  index: number;
  userName: string;
  items: {
    description: string;
    amount: number;
    currency: string;
    category: string;
    date: string;
  };
};

export async function GET(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return Response.json({ error: "請先登入" }, { status: 401 });
  }

  const period = new URL(request.url).searchParams.get("period") ?? "";
  if (!isValidMonth(period) && !isValidYear(period)) {
    return Response.json(
      { error: "期間格式須為 YYYY-MM 或 YYYY" },
      { status: 400 },
    );
  }

  try {
    await connectToDatabase();
    // One document can hold items on different dates, so filter per item.
    const inPeriod = { "items.date": { $regex: `^${period}-` } };
    const rows = await Expense.aggregate<MonthItemRow>([
      // The book is shared: every signed-in user sees everyone's items.
      { $match: inPeriod },
      { $unwind: { path: "$items", includeArrayIndex: "index" } },
      { $match: inPeriod },
      { $sort: { "items.date": 1, createdAt: -1, index: 1 } },
      {
        $lookup: {
          from: User.collection.name,
          localField: "user",
          foreignField: "_id",
          pipeline: [{ $project: { name: 1 } }],
          as: "author",
        },
      },
      {
        $project: {
          items: 1,
          index: 1,
          userName: { $first: "$author.name" },
        },
      },
    ]);

    return Response.json({
      items: rows.map((row) => ({
        id: `${row._id}-${row.index}`,
        ...row.items,
        userName: row.userName,
      })),
    });
  } catch (error) {
    console.error("Failed to load expenses", error);
    return Response.json(
      { error: "讀取失敗，請稍後再試" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return Response.json({ error: "請先登入" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  const date = body?.date ?? todayInTaipei();

  if (
    typeof date !== "string" ||
    !isValidDate(date) ||
    date > todayInTaipei()
  ) {
    return Response.json({ error: "日期不正確" }, { status: 400 });
  }

  if (!text || text.length > MAX_TEXT_LENGTH) {
    return Response.json(
      { error: `請輸入 1 到 ${MAX_TEXT_LENGTH} 個字的內容` },
      { status: 400 },
    );
  }

  try {
    const items = await analyzeExpense(text, date);
    if (items.length === 0) {
      return Response.json(
        { error: "這段文字中沒有找到消費資訊" },
        { status: 422 },
      );
    }

    await connectToDatabase();
    const expense = await Expense.create({
      user: userId,
      rawText: text,
      model: OPENAI_MODEL,
      items,
    });

    return Response.json(
      { id: expense.id, rawText: expense.rawText, items },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to analyze or save expense", error);
    return Response.json(
      { error: "分析或儲存失敗，請稍後再試" },
      { status: 500 },
    );
  }
}

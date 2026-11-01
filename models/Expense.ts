import mongoose, { type InferSchemaType, type Model } from "mongoose";

export const EXPENSE_CATEGORIES = [
  "餐飲",
  "交通",
  "購物",
  "娛樂",
  "居住",
  "醫療",
  "教育",
  "其他",
] as const;

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rawText: { type: String, required: true },
    model: { type: String, required: true },
    items: {
      type: [
        {
          _id: false,
          description: { type: String, required: true },
          amount: { type: Number, required: true, min: 0 },
          currency: { type: String, required: true },
          category: { type: String, required: true, enum: EXPENSE_CATEGORIES },
          date: { type: String, required: true },
        },
      ],
      required: true,
    },
  },
  { timestamps: true, suppressReservedKeysWarning: true },
);

type ExpenseDocument = InferSchemaType<typeof expenseSchema>;

export const Expense =
  (mongoose.models.Expense as Model<ExpenseDocument> | undefined) ??
  mongoose.model("Expense", expenseSchema);

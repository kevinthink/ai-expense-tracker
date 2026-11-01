import mongoose, { type InferSchemaType, type Model } from "mongoose";

export const USER_ROLES = ["user", "admin"] as const;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Holds the scrypt hash, never the plain password. Excluded from queries
    // unless explicitly requested with select("+password").
    password: { type: String, required: true, select: false },
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, enum: USER_ROLES, default: "user" },
  },
  { timestamps: true },
);

type UserDocument = InferSchemaType<typeof userSchema>;

export const User = (mongoose.models.User ??
  mongoose.model("User", userSchema)) as Model<UserDocument>;

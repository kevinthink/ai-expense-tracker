import mongoose from "mongoose";

// Reuse one connection across hot reloads and route invocations.
const globalForMongoose = globalThis as typeof globalThis & {
  mongooseConnection?: Promise<typeof mongoose>;
};

export function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  globalForMongoose.mongooseConnection ??= mongoose
    .connect(uri, { bufferCommands: false })
    .catch((error) => {
      // Allow the next request to retry after a failed connection.
      globalForMongoose.mongooseConnection = undefined;
      throw error;
    });

  return globalForMongoose.mongooseConnection;
}

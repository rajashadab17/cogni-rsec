import mongoose, { Connection } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL!;

if (!MONGODB_URL) {
  throw new Error(
    "Please define the MONGODB_URL environment variable inside .env.local"
  );
}

declare global {
  var mongoose: {
    connection: Connection | null;
    Promise: Promise<Connection> | null;
  } | undefined;
}

if (!global.mongoose) {
  global.mongoose = { connection: null, Promise: null };
}

const cached = global.mongoose;

export async function connectToDatabase(): Promise<Connection> {
  if (cached.connection) {
    return cached.connection;
  }

  if (!cached.Promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
    };

    cached.Promise = mongoose
      .connect(MONGODB_URL, opts)
      .then(() => mongoose.connection);
  }

  try {
    cached.connection = await cached.Promise;
  } catch (e) {
    cached.Promise = null;
    throw e;
  }

  return cached.connection;
}

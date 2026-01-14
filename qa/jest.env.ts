import dotenv from "dotenv";
import path from "path";

// Explicitly load .env.local for Jest
dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

// Optional: debug once if needed
if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  console.warn(
    "[JEST ENV] NEXT_PUBLIC_FIREBASE_API_KEY is not loaded"
  );
}

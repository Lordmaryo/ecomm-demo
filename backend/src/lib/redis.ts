import "dotenv/config";
import Redis from "ioredis";

const REDIS_URL: string | undefined = process.env.UPSTASH_REDIS_URL;

if (!REDIS_URL) throw new Error("Redis URL is undefined");
export const redis = new Redis(REDIS_URL);

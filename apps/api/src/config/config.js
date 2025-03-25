import dotenv from "dotenv";
dotenv.config({ path: "./.env" }); 


import { z } from "zod";

export const envsSchema = z.object({
  AWS_ACCESS_KEY: z.string().min(1, "AWS_ACCESS_KEY is required"),
  AWS_SECRET_KEY: z.string().min(1, "AWS_SECRET_KEY is required"),
  AWS_REGION: z.string().min(1, "AWS_REGION is required"),
  AWS_BUCKET_NAME: z.string().min(1, "AWS_BUCKET_NAME is required"),
  CDN_URL: z.string().min(1, "CDN_URL is required"),
  ACCESS_JWT_KEY: z.string().min(1,"ACCESS_JWT_KEY is required")
});

const { success, data, error } = envsSchema.safeParse(process.env);

if (!success) {
  console.error("Error with envs", error.format());
  process.exit(1);
}

export const { AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_BUCKET_NAME, AWS_REGION,CDN_URL,ACCESS_JWT_KEY } =
  data;

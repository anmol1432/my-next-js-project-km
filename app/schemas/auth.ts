import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2).max(40),
  email: z.email(),
  password: z.string().min(12).max(30),
});

export const signinSchema = z.object({
  email: z.email(),
  password: z.string().min(12).max(30),
});
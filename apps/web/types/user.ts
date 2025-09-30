import z, { email } from "zod";

export const UserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type UserType = z.infer<typeof UserSchema>;

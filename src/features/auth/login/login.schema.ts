import { z } from "zod";

 export const loginSchema = z.object({
  email: z
      .string()
      .min(1, "This field is required!")
      .email("Not valid email"),
    
    password: z
      .string()
      .min(1, "This field is required!")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
      ),
});

 export type LoginFormData = z.infer<typeof loginSchema>;
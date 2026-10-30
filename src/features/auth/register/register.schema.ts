import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "This field is required!")
      .min(2, "Min char 2 chars")
      .max(15, "Max chars 15"),
    
    username: z
      .string()
      .min(1, "This field is required!")
      .min(2, "Min char 2 chars")
      .max(15, "Max chars 15"),
    
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
    
    rePassword: z
      .string()
      .min(1, "This field is required!"),
    
    gender: z.enum(["male", "female"]),
    
    dateOfBirth: z
      .string()
      .min(1, "This field is required!")
      .refine((data) => {
        const myYear = new Date(data).getFullYear();
        // Optional: Add custom year validation if needed, e.g. age restrictions
        return !isNaN(myYear);
      }, {
        message: "Invalid date",
      }),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords don't match",
    path: ["rePassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
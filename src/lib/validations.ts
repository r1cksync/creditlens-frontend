import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[a-z]/, "Must contain lowercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[!@#$%^&*]/, "Must contain a special character"),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

export const analysisStartSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  company_type: z.string().optional(),
  industry_sector: z.string().optional(),
  annual_revenue: z.number().positive().optional(),
  loan_amount_requested: z.number().positive().optional(),
  loan_purpose: z.string().optional(),
  document_ids: z.array(z.string()).optional(),
  natural_language_query: z.string().optional(),
});

export const employeeReviewSchema = z.object({
  decision: z.enum(["approve", "reject", "escalate"]),
  comments: z.string().min(10, "Comments must be at least 10 characters"),
  override_rating: z.string().optional(),
});

export const employeeCreateSchema = z.object({
  email: z.string().email("Invalid email address"),
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["employee", "admin"]),
  department: z.string().min(1, "Department is required"),
});

export const creditPolicySchema = z.object({
  name: z.string().min(1, "Policy name is required"),
  min_dscr: z.number().positive(),
  min_current_ratio: z.number().positive(),
  max_debt_to_equity: z.number().positive(),
  min_interest_coverage: z.number().positive(),
  min_net_worth: z.number(),
  min_promoter_contribution_pct: z.number().min(0).max(100),
  max_exposure_pct: z.number().min(0).max(100),
  max_single_borrower_limit: z.number().positive(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type AnalysisStartFormData = z.infer<typeof analysisStartSchema>;
export type EmployeeReviewFormData = z.infer<typeof employeeReviewSchema>;
export type EmployeeCreateFormData = z.infer<typeof employeeCreateSchema>;
export type CreditPolicyFormData = z.infer<typeof creditPolicySchema>;

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormData } from "@/lib/validations";
import { auth } from "@/lib/api";
import Cookies from "js-cookie";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Shield } from "lucide-react";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    try {
      const res = await auth.signup({
        email: data.email,
        full_name: data.full_name,
        password: data.password,
      });
      if (res.data?.access_token) {
        Cookies.set("access_token", res.data.access_token, { expires: 1 });
      }
      toast.success("Account created successfully!");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <Shield size={20} strokeWidth={1.5} className="text-foreground" />
            <span className="text-sm font-display font-bold tracking-tight uppercase">CreditLens</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tighter leading-none mb-3">
            Create Account
          </h1>
          <p className="text-muted-foreground font-body text-lg">Start your credit analysis journey</p>
        </div>

        <div className="border-t-4 border-foreground pt-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Full Name"
              placeholder="John Doe"
              error={errors.full_name?.message}
              {...register("full_name")}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              error={errors.password?.message}
              {...register("password")}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm password"
              error={errors.confirm_password?.message}
              {...register("confirm_password")}
            />
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Create Account &rarr;
            </Button>
          </form>
        </div>

        <p className="mt-8 text-sm text-muted-foreground font-body">
          Already have an account?{" "}
          <Link href="/login" className="text-foreground underline hover:no-underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

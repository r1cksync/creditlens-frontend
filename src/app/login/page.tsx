"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validations";
import { auth } from "@/lib/api";
import Cookies from "js-cookie";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Shield } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const res = await auth.login(data);
      Cookies.set("access_token", res.data.access_token, { expires: 1 });
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials");
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
            Sign In
          </h1>
          <p className="text-muted-foreground font-body text-lg">Multi-Agent Credit Analysis Platform</p>
        </div>

        <div className="border-t-4 border-foreground pt-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Sign In &rarr;
            </Button>
          </form>
        </div>

        <p className="mt-8 text-sm text-muted-foreground font-body">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-foreground underline hover:no-underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

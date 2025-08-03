import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SocialButtons } from "./social-buttons";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  isMobile?: boolean;
}

export function LoginForm({ isMobile = false }: LoginFormProps) {
  const { toast } = useToast();
  const [rememberMe, setRememberMe] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      // Handle successful login (redirect, etc.)
    },
    onError: (error) => {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate({ ...data, rememberMe });
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            className="form-input-botanical w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none"
            {...form.register("email")}
            data-testid="input-email"
          />
          {form.formState.errors.email && (
            <p className="text-red-400 text-sm">{form.formState.errors.email.message}</p>
          )}

          <Input
            type="password"
            placeholder="Password"
            className="form-input-botanical w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none"
            {...form.register("password")}
            data-testid="input-password"
          />
          {form.formState.errors.password && (
            <p className="text-red-400 text-sm">{form.formState.errors.password.message}</p>
          )}

          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-[var(--botanical-green)] hover:bg-[var(--botanical-dark)] text-white font-medium py-3 rounded-lg transition-colors"
            data-testid="button-login"
          >
            {loginMutation.isPending ? "Logging in..." : "LOGIN"}
          </Button>
        </form>

        <SocialButtons />
      </div>
    );
  }

  return (
    <div className="max-w-md w-full">
      <div className="mb-12">
        <h1 className="text-5xl font-light text-white mb-4">Login</h1>
        <p className="text-gray-400 text-sm">Sign up here if you already have an account</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label className="block text-gray-300 text-xs font-medium mb-3 tracking-widest uppercase">
            Email
          </Label>
          <Input
            type="email"
            className="w-full px-0 py-3 bg-transparent text-white placeholder-gray-500 border-0 border-b border-gray-600 focus:outline-none focus:ring-0 focus:border-[var(--botanical-green)] rounded-none"
            {...form.register("email")}
            data-testid="input-email"
          />
          {form.formState.errors.email && (
            <p className="text-red-400 text-sm mt-1">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div>
          <Label className="block text-gray-300 text-xs font-medium mb-3 tracking-widest uppercase">
            Password
          </Label>
          <Input
            type="password"
            className="w-full px-0 py-3 bg-transparent text-white placeholder-gray-500 border-0 border-b border-gray-600 focus:outline-none focus:ring-0 focus:border-[var(--botanical-green)] rounded-none"
            {...form.register("password")}
            data-testid="input-password"
          />
          {form.formState.errors.password && (
            <p className="text-red-400 text-sm mt-1">{form.formState.errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-4">
          <label className="flex items-center cursor-pointer">
            <Checkbox
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
              className="sr-only"
              data-testid="checkbox-remember"
            />
            <div className="w-4 h-4 border border-gray-600 rounded mr-3 flex items-center justify-center">
              {rememberMe && (
                <span className="text-[var(--botanical-green)] text-xs">✓</span>
              )}
            </div>
            <span className="text-gray-400 text-sm">Remember me</span>
          </label>
          <a
            href="#"
            className="text-gray-400 text-sm hover:text-[var(--botanical-green)] transition-colors"
            data-testid="link-forgot-password"
          >
            Forgot your password?
          </a>
        </div>

        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full bg-[var(--botanical-green)] hover:bg-[var(--botanical-dark)] text-white font-medium py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[var(--botanical-green)]/20 mt-8"
          data-testid="button-login"
        >
          {loginMutation.isPending ? "Logging in..." : "LOGIN"}
        </Button>
      </form>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-black text-gray-500">OR</span>
          </div>
        </div>

        <SocialButtons />
      </div>
    </div>
  );
}

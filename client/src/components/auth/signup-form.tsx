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
import { SocialButtons } from "./social-buttons";

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  isMobile?: boolean;
}

export function SignupForm({ isMobile = false }: SignupFormProps) {
  const { toast } = useToast();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: Omit<SignupFormData, "confirmPassword">) => {
      const response = await apiRequest("POST", "/api/auth/signup", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Account created successfully",
        description: "Welcome! You can now sign in to your account.",
      });
      // Handle successful signup (redirect to login, etc.)
    },
    onError: (error) => {
      toast({
        title: "Sign up failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SignupFormData) => {
    const { confirmPassword, ...signupData } = data;
    signupMutation.mutate(signupData);
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

          <Input
            type="password"
            placeholder="Confirm Password"
            className="form-input-botanical w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none"
            {...form.register("confirmPassword")}
            data-testid="input-confirm-password"
          />
          {form.formState.errors.confirmPassword && (
            <p className="text-red-400 text-sm">{form.formState.errors.confirmPassword.message}</p>
          )}

          <Button
            type="submit"
            disabled={signupMutation.isPending}
            className="w-full bg-[var(--botanical-green)] hover:bg-[var(--botanical-dark)] text-white font-medium py-3 rounded-lg transition-colors"
            data-testid="button-signup"
          >
            {signupMutation.isPending ? "Creating account..." : "SIGN UP"}
          </Button>
        </form>

        <SocialButtons />
      </div>
    );
  }

  return (
    <div className="max-w-md w-full">
      <div className="mb-12">
        <h1 className="text-5xl font-light text-white mb-4">Sign up</h1>
        <p className="text-gray-400 text-sm">
          Welcome! Create an account here before you can enter to the forum with others and exchange ideas.
        </p>
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

        <div>
          <Label className="block text-gray-300 text-xs font-medium mb-3 tracking-widest uppercase">
            Confirm Password
          </Label>
          <Input
            type="password"
            className="w-full px-0 py-3 bg-transparent text-white placeholder-gray-500 border-0 border-b border-gray-600 focus:outline-none focus:ring-0 focus:border-[var(--botanical-green)] rounded-none"
            {...form.register("confirmPassword")}
            data-testid="input-confirm-password"
          />
          {form.formState.errors.confirmPassword && (
            <p className="text-red-400 text-sm mt-1">{form.formState.errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={signupMutation.isPending}
          className="w-full bg-[var(--botanical-green)] hover:bg-[var(--botanical-dark)] text-white font-medium py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[var(--botanical-green)]/20 mt-8"
          data-testid="button-signup"
        >
          {signupMutation.isPending ? "Creating account..." : "SIGN UP"}
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

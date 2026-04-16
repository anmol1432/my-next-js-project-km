"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signinSchema } from "@/app/schemas/auth";
import { authClient } from "@/lib/auth-client";

export function SigninForm() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    form.clearErrors("email");
    form.clearErrors("root");
    const toastId = toast.loading("Signing you in...");

    try {
      await authClient.signIn.email({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      form.reset();
      toast.success("Signed in. Redirecting...", { id: toastId });
      router.push("/");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown auth error.";
      const normalizedMessage = message.toLowerCase();

      if (
        normalizedMessage.includes("invalid") ||
        normalizedMessage.includes("credentials")
      ) {
        form.setError("root", {
          type: "manual",
          message: "Invalid email or password.",
        });
        toast.error("Invalid email or password.", { id: toastId });
        return;
      }

      form.setError("root", {
        type: "manual",
        message,
      });
      toast.error(message, { id: toastId });
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" {...form.register("email")} />
              <p className="text-sm text-destructive">
                {form.formState.errors.email?.message}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" {...form.register("password")} />
              <p className="text-sm text-destructive">
                {form.formState.errors.password?.message}
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
            </Button>

            <p className="text-sm text-muted-foreground">
              Enter your email and password to sign in.
            </p>

            {form.formState.errors.root?.message ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.root.message}
              </p>
            ) : null}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

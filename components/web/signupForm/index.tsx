"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useConvexConnectionState } from "convex/react";
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
import { signupSchema } from "@/app/schemas/auth";
import { authClient } from "@/lib/auth-client";

export function SignupForm() {
  const router = useRouter();
  const connectionState = useConvexConnectionState();
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    form.clearErrors("email");
    form.clearErrors("root");
    const toastId = toast.loading("Creating your account...");

    try {
      await authClient.signUp.email({
        email: values.email.trim().toLowerCase(),
        name: values.name.trim(),
        password: values.password,
      });

      form.reset();
      toast.success("Account created. Redirecting...", { id: toastId });
      router.push("/");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown auth error.";
      const normalizedMessage = message.toLowerCase();

      if (
        normalizedMessage.includes("user already exists") ||
        normalizedMessage.includes("already exists")
      ) {
        form.setError("email", {
          type: "manual",
          message: "That email is already registered.",
        });
        toast.error("That email is already registered.", { id: toastId });
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
      <Card className="w-full max-w-sm shadow-sm">
        <CardHeader>
          <CardTitle>Create account to get started</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Full name</Label>
              <Input {...form.register("name")} />
              <p className="text-sm text-destructive">
                {form.formState.errors.name?.message}
              </p>
            </div>

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
              {form.formState.isSubmitting ? "Creating account..." : "Sign up"}
            </Button>

            <p className="text-sm text-muted-foreground">
              This form now creates a Better Auth account backed by Convex.
            </p>

            {!connectionState.isWebSocketConnected &&
            connectionState.connectionRetries > 0 ? (
              <p className="text-sm text-amber-600">
                Convex is disconnected. Start it with `npm run convex:dev`, then
                refresh this page before signing up.
              </p>
            ) : null}

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

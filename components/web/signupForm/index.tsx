"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useConvexConnectionState, useMutation } from "convex/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signupSchema } from "@/app/schemas/auth";

export function SignupForm() {
  const createUser = useMutation(api.users.create);
  const connectionState = useConvexConnectionState();
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitMessage(null);
    form.clearErrors("email");

    try {
      const result = await createUser({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
      });

      if (result.status === "exists") {
        form.setError("email", {
          type: "manual",
          message: "That email already exists in Convex.",
        });
        return;
      }

      form.reset();
      setSubmitMessage("Profile saved to Convex.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown Convex error.";
      setSubmitMessage(
        `Convex could not save that profile. ${message} Make sure \`npm run convex:dev\` is running.`,
      );
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
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
              {form.formState.isSubmitting ? "Saving..." : "Sign up"}
            </Button>

            <p className="text-sm text-muted-foreground">
              This demo stores your profile in Convex. Password auth is not
              wired yet.
            </p>

            {!connectionState.isWebSocketConnected &&
            connectionState.connectionRetries > 0 ? (
              <p className="text-sm text-amber-600">
                Convex is disconnected. Start it with `npm run convex:dev`, then
                refresh this page.
              </p>
            ) : null}

            {submitMessage ? (
              <p className="text-sm text-muted-foreground">{submitMessage}</p>
            ) : null}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

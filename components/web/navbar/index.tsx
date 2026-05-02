"use client"

import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";
import { useConvexAuth } from "convex/react";
import { auth } from "@/lib/auth-server";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const NavBar = () => {
  const {isAuthenticated, isLoading} = useConvexAuth();
  return (
    <nav className="sticky top-0 z-50">
      <div className="bg-white dark:bg-card border-b border-border px-4 py-3 w-full flex items-center justify-between shadow-sm">
        <Link className="hover:opacity-75 transition-opacity px-2" href="/">
          <h1 className="text-xl font-semibold text-foreground">
            Next <span className="text-primary">Bros</span>
          </h1>
        </Link>

        <ul className="flex items-center gap-1">
          <Link className={buttonVariants({ variant: "ghost" })} href="/">Home</Link>
          <Link className={buttonVariants({ variant: "ghost" })} href="/about">About</Link>
          <Link className={buttonVariants({ variant: "ghost" })} href="/create">Create</Link>
        </ul>

        <div className="flex items-center gap-2">
          {isLoading ? null : isAuthenticated ? (
            <Button
              variant="outline"
              onClick={() =>
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => toast.success("Signed out successfully"),
                    onError: () => toast.error("Error signing out"),
                  },
                })
              }
            >
              Logout
            </Button>
          ) : (
            <>
              <Link href="/auth/signup" className={buttonVariants({ variant: "default" })}>
                Sign Up
              </Link>
              <Link href="/auth/signin" className={buttonVariants({ variant: "outline" })}>
                Log In
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

export default NavBar;

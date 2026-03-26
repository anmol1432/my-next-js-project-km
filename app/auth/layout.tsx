import { buttonVariants } from '@/components/ui/button'
import { ThemeToggle } from '@/components/web/theme-toggle'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/dist/client/link'
import React from 'react'

interface AuthLayoutPorps {
    children: React.ReactNode
}

const AuthLayout = ({children}:AuthLayoutPorps) => {
  return (
      <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.24),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.2),transparent_22%)] px-4 py-10 text-foreground sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(255,247,237,0.72),rgba(255,255,255,0.94))] dark:bg-[linear-gradient(135deg,rgba(10,10,10,0.98),rgba(28,25,23,0.94),rgba(10,10,10,0.98))]" />
        <div className="absolute left-4 top-8 z-10">
          <ThemeToggle />
        </div>
        <div className="absolute left-14 top-8 z-10">
          <Link href="/" className={buttonVariants({ variant: "secondary" })}>
            <ArrowLeft className="size-4" />
            Go Back
          </Link>
        </div>
        <div className="absolute left-1/2 top-16 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-orange-300/20 blur-3xl dark:bg-orange-500/10" />
        <div className="absolute bottom-10 right-10 -z-10 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl dark:bg-amber-500/10" />
        <div className="w-full max-w-6xl">{children}</div>
      </div>
  );
}

export default AuthLayout
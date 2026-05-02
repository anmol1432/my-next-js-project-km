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
      <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground sm:px-6 lg:px-8">
        <div className="absolute left-4 top-8 z-10">
          <ThemeToggle />
        </div>
        <div className="absolute left-14 top-8 z-10">
          <Link href="/" className={buttonVariants({ variant: "secondary" })}>
            <ArrowLeft className="size-4" />
            Go Back
          </Link>
        </div>
        <div className="w-full max-w-6xl">{children}</div>
      </div>
  );
}

export default AuthLayout
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";

const NavBar = () => {
  return (
    <nav>
      <div
        className="bg-black p-4 w-full flex 
        items-center justify-between
        box-border top-0 left-0 z-50"
      >
        <h1 className="text-2xl text-white font-bold">
          Next <span className="text-blue-500">Bros</span>
        </h1>
        <ul className="flex space-x-4 mt-2">
          <Link className={buttonVariants({ variant: "ghost" })} href="/">
            Home
          </Link>
          <Link className={buttonVariants({ variant: "ghost" })} href="/about">
            About
          </Link>
          <Link className={buttonVariants({ variant: "ghost" })} href="/contact">
            Contact
          </Link>
        </ul>
        <div className="flex items-end gap-2">
          <Link
            href="/auth/signup"
            className={buttonVariants({ variant: "secondary" })}
          >
            Sign Up
          </Link>
          <Link
            href="/auth/signin"
            className={buttonVariants({ variant: "outline" })}
          >
            Log In
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

export default NavBar;

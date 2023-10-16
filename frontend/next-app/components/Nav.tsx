"use client";
import Image from "next/image";
import { ModeToggle } from "@ui/theme-toggle";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Nav() {
  return (
    <header>
      <nav>
        <ul className="flex items-center justify-between">
          <li>
            <Button asChild variant={"ghost"} rel="noopener noreferrer">
              {/* <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                className="dark:invert"
                width={100}
                height={24}
                priority
              /> */}
              <Link href="/">Home</Link>
            </Button>
          </li>

          <li>
            <ModeToggle />
          </li>
        </ul>
      </nav>
    </header>
  );
}

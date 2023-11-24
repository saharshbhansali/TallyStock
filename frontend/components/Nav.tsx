"use client";
import Image from "next/image";
import { ModeToggle } from "@ui/theme-toggle";
import { NavMenu } from "@ui/nav-menu";
import { FullMenu } from "@ui/full-menu";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Nav() {
  return (
    <header>
      <nav>
        <ul className="flex items-center justify-between">
          <li className="md:flex hidden items-center justify-between gap-2 ">
            <FullMenu />
          </li>
          <li className="flex md:hidden">
            <NavMenu />
          </li>
          <li>
            <ModeToggle />
          </li>
        </ul>
      </nav>
    </header>
  );
}

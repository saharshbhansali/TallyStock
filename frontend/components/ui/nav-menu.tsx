"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import Link from "next/link";

export function NavMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <ChevronRight className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all focus:rotate-90 focus:scale-90" />
          <span className="sr-only">Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem>
          <Link href="/">Home</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/stocks">Stocks</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/transactions">Transactions</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

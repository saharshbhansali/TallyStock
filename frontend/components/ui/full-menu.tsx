"use client";
import Image from "next/image";
import { Button } from "@ui/button";
import Link from "next/link";

export function FullMenu() {
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <Button asChild variant={"ghost"} rel="noopener noreferrer">
          <Link href="/">Home</Link>
        </Button>
        <Button asChild variant={"ghost"} rel="noopener noreferrer">
          <Link href="/stocks">Stocks</Link>
        </Button>
        <Button asChild variant={"ghost"} rel="noopener noreferrer">
          <Link href="/transactions">Transactions</Link>
        </Button>
      </div>
    </>
  );
}

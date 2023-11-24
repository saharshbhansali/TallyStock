"use client";

import Nav from "@comp/Nav";
import { Button } from "@ui/button";
import { StockEditForm } from "@comp/StockEditForm";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Home() {
  // get id from url
  const search = useSearchParams();
  const id =
    typeof search.get("id") === "string" ? parseInt(search.get("id")!) : 0;
  // console.log(id);
  return (
    <>
      <Button asChild variant={"secondary"}>
        <Link href="/stocks">View Stock</Link>
      </Button>
      <main className="">
        <div className="gap-4 py-6 flex flex-col items-center">
          <StockEditForm id={id} />
        </div>
        {/* <div className="flex gap-3 items-center justify-center ">
        <Button variant={"secondary"}>Learn More</Button>
        <Button variant={"secondary"}>Enroll Now</Button>
      </div> */}
      </main>
    </>
  );
}

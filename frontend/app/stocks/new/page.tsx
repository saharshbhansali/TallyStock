import Nav from "@comp/Nav";
import { Button } from "@ui/button";
import { StockForm } from "@comp/StockForm";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Button asChild variant={"secondary"}>
        <Link href="/stocks">View Stock</Link>
      </Button>
      <main className="">
        <div className="gap-4 py-6 flex flex-col items-center">
          <StockForm />
        </div>
        {/* <div className="flex gap-3 items-center justify-center ">
        <Button variant={"secondary"}>Learn More</Button>
        <Button variant={"secondary"}>Enroll Now</Button>
      </div> */}
      </main>
    </>
  );
}

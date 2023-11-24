import Nav from "@comp/Nav";
import { Button } from "@ui/button";
import { TransactionForm } from "@comp/TransactionForm";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Button asChild variant={"secondary"}>
        <Link href="/transactions">View Transactions</Link>
      </Button>
      <main className="">
        <div className="gap-4 py-6 flex flex-col items-center">
          <TransactionForm />
        </div>
        {/* <div className="flex gap-3 items-center justify-center ">
        <Button variant={"secondary"}>Learn More</Button>
        <Button variant={"secondary"}>Enroll Now</Button>
      </div> */}
      </main>
    </>
  );
}

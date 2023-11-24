import Nav from "@comp/Nav";
import { Button } from "@ui/button";
import { ProfileForm } from "@comp/UserForm";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="">
      <section className="py-12 flex flex-col items-center text-center gap-8">
        <h1 className="text-4xl font-bold">Welcome to TallyStock</h1>
        <p className="text-2xl text-foreground">
          Please choose what information you would like to view
        </p>
      </section>
      <div className="grid grid-cols-2 gap-5 px-40 pt-3 pb-3">
        <Button asChild variant={"secondary"}>
          <Link href="/stocks">Stocks</Link>
        </Button>
        <Button asChild variant={"secondary"}>
          <Link href="/transactions">Transactions</Link>
        </Button>
      </div>
      {/* <div className="gap-4 py-6 flex flex-col items-center">
        <ProfileForm />
      </div> */}
    </main>
  );
}

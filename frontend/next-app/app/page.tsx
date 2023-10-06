import Nav from "@components/Nav";
import { Button } from "@components/ui/button";
import { ProfileForm } from "@components/UserForm";
import Image from "next/image";

export default function Home() {
  return (
    <main className=" p-24">
      <Nav />
      <section className="py-12 flex flex-col items-center text-center gap-8">
        <h1 className="text-4xl font-bold">Shadcn is awesome</h1>
        <p className="text-2xl text-foreground">
          Hand picked themes to copy and paste
        </p>
      </section>
      <div className="flex gap-3 items-center justify-center ">
        <Button variant={"secondary"}>Learn More</Button>
        <Button variant={"secondary"}>Enroll Now</Button>
      </div>

      <div className="gap-4 py-6 flex flex-col items-center">
        <ProfileForm />
      </div>
    </main>
  );
}

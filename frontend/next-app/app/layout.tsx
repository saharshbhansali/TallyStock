import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@ui/theme-provider";
import Nav from "@comp/Nav";
import { Button } from "@ui/button";
import { ProfileForm } from "@comp/UserForm";

export const metadata: Metadata = {
  title: "TallyStock",
  description: "NextJS application with ShadcnUI, TailwindCSS, and TypeScript",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="max-w-6xl mx-auto p-24">
          <ThemeProvider attribute="class" defaultTheme="system">
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
            <div>{children}</div>
            {/* <div className="gap-4 py-6 flex flex-col items-center">
                <ProfileForm />
              </div> */}
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}

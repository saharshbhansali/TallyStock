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
      <body className="">
        <div className="flex flex-col gap-5 max-w-6xl mx-auto p-24 ">
          <ThemeProvider attribute="class" defaultTheme="system">
            <Nav />
          </ThemeProvider>
          {children}
        </div>
      </body>
    </html>
  );
}

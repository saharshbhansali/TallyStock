import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ui/theme-provider";

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
        <main className="max-w-6xl mx-auto">
          <ThemeProvider attribute="class" defaultTheme="system">
            {children}
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}

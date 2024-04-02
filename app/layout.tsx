import "./globals.css";

import { Inter } from "next/font/google";
import type { Metadata } from "next";

import { ModalProvider } from "@/components/providers/modal";
import { ThemeProvider } from "@/components/providers/theme";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600"] });

export const metadata: Metadata = {
  title: "App name",
  description: "Volunteering, in a snap",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="rat-project-251"
        >
          <ModalProvider />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

// TODO: Change all instances of "app name" to something substantive

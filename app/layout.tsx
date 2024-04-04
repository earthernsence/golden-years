import "./globals.css";

import { Inter } from "next/font/google";
import type { Metadata } from "next";

import { ConvexClientProvider } from "@/components/providers/convex";
import { ModalProvider } from "@/components/providers/modal";
import { ThemeProvider } from "@/components/providers/theme";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600"] });

export const metadata: Metadata = {
  title: "Golden Years",
  description: "Connecting students to opportunities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider>
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
        </ConvexClientProvider>
      </body>
    </html>
  );
}

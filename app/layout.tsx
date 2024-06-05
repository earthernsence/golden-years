import "./globals.css";

import { Inter } from "next/font/google";
import type { Metadata } from "next";

import { ConvexClientProvider } from "@/components/providers/convex";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { ModalProvider } from "@/components/providers/modal";
import { ThemeProvider } from "@/components/providers/theme";

import { Toaster } from "@/components/ui/Toaster";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600"] });

export const metadata: Metadata = {
  title: "Golden Years",
  description: "Connecting students to opportunities",
  openGraph: {
    title: "Golden Years",
    description: "Golden Years is a student organisation helping those in memory care facilities through volunteering.",
    url: "https://golden-years.vercel.app/",
    siteName: "golden-years",
    locale: "en_US",
    type: "website",
    images: [
      {
        // eslint-disable-next-line max-len
        url: "https://cdn.discordapp.com/attachments/873209506430066808/1247937387187671040/golden_years_logo.png?ex=6661d7c2&is=66608642&hm=254734bcd31b6d8479a4832f6bc0e49034f950404cedb940fce1c5521a447d55&",
        width: 400,
        height: 400,
        alt: "Golden years logo",
        type: "image/png"
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <ConvexClientProvider>
          <EdgeStoreProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              storageKey="rat-project-251"
            >
              <ModalProvider />
              {children}
              <Toaster />
            </ThemeProvider>
          </EdgeStoreProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}

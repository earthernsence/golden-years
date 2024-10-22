// Main layout for the site. Contains the Navbar and Footer components to be used repeatedly

import { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Golden Years",
  description: "Connecting students to opportunities",
};

const LandingLayout = ({
  children
}: {
  children: React.ReactNode
}) => (
  <div className="flex flex-col h-screen justify-between bg-gy-bg-light dark:bg-gy-bg-dark">
    <Navbar />
    <main className="mb-auto">
      { children }
    </main>
    <footer>
      <Footer />
    </footer>
  </div>
);

export default LandingLayout;
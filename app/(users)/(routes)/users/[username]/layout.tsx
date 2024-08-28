"use client";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

const UserProfilePageLayout = ({
  children
}: {
  children: React.ReactNode
}) => (
  <div className="flex flex-col h-screen justify-between bg-gy-bg-light dark:bg-gy-bg-dark">
    <Navbar />
    <main className="mb-auto h-auto">
      { children }
    </main>
    <footer>
      <Footer />
    </footer>
  </div>
);

export default UserProfilePageLayout;
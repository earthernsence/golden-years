import LandingCarousel from "./_components/LandingCarousel";

import { Header } from "./_components/Header";

const LandingPage = () => (
  <main className="min-h-full flex flex-col pt-40">
    <section className="flex flex-col items-center justify-center
                        text-center gap-y-8 flex-1 px-6 pb-10
                        bg-gy-bg-light dark:bg-gy-bg-dark
                        md:justify-start"
    >
      <Header />
      <LandingCarousel />
    </section>
  </main>
);

export default LandingPage;
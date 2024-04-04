import { Header } from "./_components/Header";
import { Testimonials } from "./_components/Testimonials";

const LandingPage = () => (
  <main className="min-h-full flex flex-col pt-40">
    <section className="flex flex-col items-center justify-center
                        text-center gap-y-8 flex-1 px-6 pb-10
                        dark:bg-dark
                        md:justify-start"
    >
      <Header />
      <Testimonials />
    </section>
  </main>
);

export default LandingPage;
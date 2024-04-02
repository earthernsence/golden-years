import { Footer } from "../../components/Footer";
import { Header } from "./_components/Header";
import { Testimonials } from "./_components/Testimonials";

const LandingPage = () => (
  <main className="min-h-full flex flex-col">
    <section className="flex flex-col items-center justify-center
                        text-center gap-y-8 flex-1 px-6 pb-10
                        dark:bg-dark
                        md:justify-start"
    >
      <Header />
      <Testimonials />
    </section>
    <footer>
      <Footer />
    </footer>
  </main>
);

export default LandingPage;
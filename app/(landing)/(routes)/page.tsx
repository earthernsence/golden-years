// Main page of the website. Contains the top main text and the image carousel.

import Image from "next/image";

import { Header } from "./_components/Header";
import LandingCarousel from "./_components/LandingCarousel";
import { Logo } from "@/components/Logo";

import Carissa from "#/testimonial_cc.png";
import Holly from "#/holly.jpg";
import Partners from "./_components/Partners";

const LandingPage = () => (
  <main className="min-h-full flex flex-col pt-20">
    <Logo size="ExtraSmall" className="xs:hidden md:flex place-self-start" />
    <section className="flex flex-col items-center justify-center
                        text-center gap-y-8 flex-1 px-6 pb-10
                        bg-gy-bg-light dark:bg-gy-bg-dark
                        md:justify-start"
    >
      <div className="grid xs:grid-cols-1 md:grid-cols-4 grid-flow-row w-full gap-4 min-h-[75svh]">
        <div className="md:flex col-span-1 items-end xs:hidden">
          <Image
            src={Holly}
            className="size-72 object-contain"
            alt="Holly"
          />
        </div>
        <div className="flex col-span-2 flex-col items-center justify-center">
          <Header />
        </div>
        <div className="xs:hidden md:flex col-span-1 items-start relative">
          <Image
            src={Carissa}
            className="size-96 object-right-top object-cover absolute"
            alt="Carissa"
          />
        </div>
      </div>
      <br />
      <div className="grid xs:grid-cols-1 md:grid-cols-2 grid-flow-row w-full gap-4 min-h-[25svh]">
        <div className="flex col-span-1 flex-col justify-center items-center">
          <div className="xs:text-xl md:text-2xl">
            Where We&apos;ve Been
          </div>
          <LandingCarousel />
        </div>
        <div className="flex col-span-1 flex-col items-center h-full">
          <div className="xs:text-xl md:text-2xl">
            Our Partners
          </div>
          <br />
          <Partners />
        </div>
      </div>
      <br />
      <br />
      <div className="flex flex-col">
        <div className="text-xl">Our Sponsors</div>
      </div>
    </section>
  </main>
);

export default LandingPage;
// Main page of the website. Contains the top main text and the image carousel.

import Image from "next/image";

import { Header } from "./_components/Header";
import LandingCarousel from "./_components/LandingCarousel";
import { Logo } from "@/components/Logo";

import Carissa from "#/testimonial_cc.png";
import Holly from "#/holly.jpg";

const LandingPage = () => (
  <main className="min-h-full flex flex-col pt-20">
    <Logo size="ExtraSmall" className="flex place-self-start" />
    <section className="flex flex-col items-center justify-center
                        text-center gap-y-8 flex-1 px-6 pb-10
                        bg-gy-bg-light dark:bg-gy-bg-dark
                        md:justify-start"
    >
      <div className="grid grid-cols-4 grid-rows-1 grid-flow-row w-full gap-4 min-h-[75svh]">
        <div className="flex col-span-1 items-end">
          <div className="border-2 border-black">
            <Image
              src={Holly}
              className="size-72 object-contain"
              alt="Holly"
            />
          </div>
        </div>
        <div className="flex col-span-2 flex-col items-center justify-center">
          <Header />
        </div>
        <div className="flex col-span-1 items-start justify-end">
          <div className="border-2 border-black">
            <Image
              src={Carissa}
              className="size-72 object-contain"
              alt="Carissa"
            />
          </div>
        </div>
      </div>
      <LandingCarousel />
    </section>
  </main>
);

export default LandingPage;
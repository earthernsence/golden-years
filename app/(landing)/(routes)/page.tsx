// Main page of the website. Contains the top main text and the image carousel.

"use client";

import { StaticImageData } from "next/image";

import { Header } from "./_components/Header";
import LandingCarousel from "./_components/LandingCarousel";

import Partners from "./_components/Partners";
import { ImageReel } from "./_components/ImageReel";

import image1 from "#/reel/image_1.png";
import image2 from "#/reel/image_2.png";
import image3 from "#/reel/image_3.png";
import image4 from "#/reel/image_4.png";
import image5 from "#/reel/image_5.png";
import image6 from "#/reel/image_6.png";
import image7 from "#/reel/image_7.png";
import image8 from "#/reel/image_8.png";
import image9 from "#/reel/image_9.png";

const images: StaticImageData[] = [image1, image2, image3, image4, image5, image6, image7, image8, image9];

const LandingPage = () => (
  <main className="min-h-full flex flex-col pt-20">
    <section className="flex flex-col items-center justify-center
                        text-center gap-y-8 flex-1 px-6 pb-10
                        bg-gy-bg-light dark:bg-gy-bg-dark
                        md:justify-start"
    >
      <div className="grid xs:grid-cols-1 md:grid-cols-4 grid-flow-row w-full gap-4 min-h-[75svh]">
        <div className="md:flex col-span-1 xs:hidden">
          <ImageReel
            images={images}
            reelDirection="forward"
          />
        </div>
        <div className="flex col-span-2 flex-col items-center justify-center">
          <Header />
        </div>
        <div className="xs:hidden md:flex col-span-1 items-start relative justify-end">
          <ImageReel
            images={images.toReversed()}
            reelDirection="backward"
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
      {/* <br />
      <br />
      <div className="flex flex-col">
        <div className="text-xl">Our Sponsors</div>
      </div> */}
    </section>
  </main>
);

export default LandingPage;
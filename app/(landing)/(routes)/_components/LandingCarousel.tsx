"use client";

import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/Card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/Carousel";

import carouselImage1 from "#/carousel_1.jpg";
import carouselImage2 from "#/carousel_2.jpg";
import carouselImage3 from "#/carousel_3.jpg";
import carouselImage4 from "#/carousel_4.jpg";

interface CarouselItems {
  [key: number]: {
    image: typeof carouselImage1,
    text: string
  }
}

const items: CarouselItems = {
  1: {
    image: carouselImage1,
    text: `On July 7th, some of the members from Golden Years were able to come to the
          Villages of St. Peter's to paint with the residents.`
  },
  2: {
    image: carouselImage2,
    text: `Vinay K and Jonathan N painting with the residents in Aubrey's Place at the Villages of St. Peter's`
  },
  3: {
    image: carouselImage3,
    text: "A resident finished with her watercolor flowers."
  },
  4: {
    image: carouselImage4,
    text: "A resident finished with her otter painting with watercolor."
  }
};

import Image from "next/image";

const LandingCarousel = () => (
  <Carousel
    orientation="horizontal"
    className="w-full max-w-xs md:max-w-lg bg-transparent items-center"
    opts={{
      align: "start",
      loop: true,
    }}
    plugins={[
      Autoplay({
        delay: 5000
      })
    ]}
  >
    <CarouselContent>
      {Array.from({ length: 4 }).map((_, index) => (
        <CarouselItem key={index}>
          <div className="p-1 flex flex-col">
            <Card>
              <CardContent className="flex aspect-video items-center justify-center p-6">
                <Image
                  src={items[index + 1].image}
                  alt={items[index + 1].text}
                  className="w-full border-gray-700 border-2"
                  width={1600}
                  height={1600}
                />
              </CardContent>
            </Card>
          </div>
          <div className="text-sm">
            {items[index + 1].text}
          </div>
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
);

export default LandingCarousel;
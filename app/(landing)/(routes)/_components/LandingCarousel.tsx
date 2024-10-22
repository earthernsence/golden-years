// Image carousel on the main page.

"use client";

import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/Card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/Carousel";

import image1 from "#/carousel/carousel_1.png";
import image2 from "#/carousel/carousel_2.png";
import image3 from "#/carousel/carousel_3.png";
import image4 from "#/carousel/carousel_4.png";
import image5 from "#/carousel/carousel_5.png";
import image6 from "#/carousel/carousel_6.png";
import image7 from "#/carousel/carousel_7.png";
import image8 from "#/carousel/carousel_8.png";
import image9 from "#/carousel/carousel_9.png";

interface CarouselItems {
  [key: number]: {
    image: typeof image1,
    text: string
  }
}

const items: CarouselItems = {
  1: {
    image: image1,
    text: `On October 5, Golden Years volunteers went to Breeze Park to help with their annual Walk to End Alzheimer's.`
  },
  2: {
    image: image2,
    text: `On September 15, we sent volunteers to play balloon racquetball with residents at the Villages of St. Peters.`
  },
  3: {
    image: image3,
    text: "One of our volunteers with his Breeze Park resident after doing some watercolour painting."
  },
  4: {
    image: image4,
    text: "A resident with her finish watercolour butterfly."
  },
  5: {
    image: image5,
    text: "On July 7, we hosted a watercolour painting event at the Villages of St. Peters."
  },
  6: {
    image: image6,
    text: "On October 5, Golden Years played bingo with residents at the Villages of St. Peters."
  },
  7: {
    image: image7,
    text: "On September 29, we arranged flowers with residents at the Villages of St. Peters."
  },
  8: {
    image: image8,
    text: "Through a fundraiser with Twisted Sugar, we delivered cookies to teachers at Francis Howell High School."
  },
  9: {
    image: image9,
    text: "One of our volunteers with his Breeze Park resident after doing some watercolour painting."
  }
};

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
        delay: 5000,
        stopOnInteraction: true,
      })
    ]}
  >
    <CarouselContent>
      {Array.from({ length: Object.keys(items).length }).map((_, index) => (
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
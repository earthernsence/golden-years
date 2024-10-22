// Component for the scrolling image reels on the side of the home page

"use client";

import holly from "#/holly.jpg";
import { Card, CardContent } from "@/components/ui/Card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/Carousel";

import Autoscroll from "embla-carousel-auto-scroll";
import Image from "next/image";
import React from "react";

interface ImageReelProps {
  images: (typeof holly)[],
  reelDirection: "forward" | "backward"
};

export const ImageReel = ({ images, reelDirection }: ImageReelProps) => {
  const plugin = React.useRef(
    Autoscroll({ startDelay: 1000, direction: reelDirection, playOnInit: true, speed: 1 })
  );

  return (
  <Carousel
    orientation="vertical"
    className="w-full bg-transparent items-center max-h-screen opacity-100 dark:opacity-75"
    opts={{
      align: "start",
      loop: true,
      watchSlides: true,
      slidesToScroll: 2,
    }}
    plugins={[plugin.current]}
  >
    <CarouselContent className="-mb-2 md:-mb-4 h-svh">
      {Array.from({ length: images.length }).map((_, index: number) => (
        <CarouselItem key={index} className="basis-1/2 pb-2 md:pb-4">
          <div className="p-1 flex flex-col">
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-6">
                <Image
                  src={images[index]}
                  alt={"Landing page image"}
                  className="w-full border-gray-700 border-2"
                  width={1600}
                  height={1600}
                />
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      ))}
    </CarouselContent>
  </Carousel>
)};
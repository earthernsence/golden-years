
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
    text: "Mariber"
  },
  2: {
    image: carouselImage2,
    text: "puget Sound"
  },
  3: {
    image: carouselImage3,
    text: "sunset"
  },
  4: {
    image: carouselImage4,
    text: "Lorem ipsum dolor sit amet"
  }
};

import Image from "next/image";

const LandingCarousel = () => {
  // Asdf

  console.log("Asdf");

  return (
    <Carousel orientation="horizontal" className="w-full max-w-xs md:max-w-2xl bg-transparent items-center">
      <CarouselContent>
        {Array.from({ length: 4 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1 flex flex-col">
              <Card>
                <CardContent className="flex aspect-video items-center justify-center p-6">
                  <Image
                    src={items[index + 1].image}
                    alt="Some volunteers"
                    className="w-full border-gray-700 border-2"
                    width={1600}
                    height={900}
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
};

export default LandingCarousel;
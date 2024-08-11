"use client";

import Image from "next/image";

import holly from "#/holly.jpg";

export const EventsNone = () => (
  <>
    <div className="flex text-4xl justify-center xs:text-center md:text-left pb-2">
      No future events planned!
    </div>
    <div className="flex text-2xl justify-center xs:text-center md:text-left">
      Contact an Event Organiser if you believe this is in error.
    </div>
    <div className="flex text-lg flex-col justify-center gap-y-2 items-center xs:text-center md:text-left">
      In the meantime, here is a picture of Holly.
      <Image
        src={holly}
        priority
        className="w-64"
        alt="Carissa's cat, Holly."
        width={2268}
        height={4032}
      />
    </div>
  </>
);
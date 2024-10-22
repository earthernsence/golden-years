/* @ignore */

import Image from "next/image";

export const Testimonials = () => (
  <div className="flex flex-col lg:flex-row gap-x-12">
    <div className="flex flex-col space-y-4 items-center">
      <div className="relative w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px]">
        <Image
          src="/testimonial_cc.png"
          fill
          className="object-contain block"
          alt="Carissa Choi"
        />
      </div>
      <div className="text-xs w-[200px] sm:w-[250px] md:w-[300px]">
        &quot;
        Golden Years helped me connect to my student volunteers
        more effectively than anywhere else.
        &quot;
      </div>
      <div className="text-sm w-[200px] sm:w-[250px] md:w-[300px]">
        <span className="font-semibold">Carissa Choi</span>, teacher
      </div>
    </div>
    <div className="flex flex-col space-y-4 items-center">
      <div className="relative w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px]">
        <Image
          src="/testimonial_jr.jpg"
          fill
          className="object-contain block"
          alt="Jace Royer"
        />
      </div>
      <div className="text-xs w-[200px] sm:w-[250px] md:w-[300px]">
        &quot;
        With Golden Years, we created a team of
        dedicated individuals who want to make the world
        better.
        &quot;
      </div>
      <div className="text-sm w-[200px] sm:w-[250px] md:w-[300px]">
        <span className="font-semibold">Jace Royer</span>, teacher
      </div>
    </div>
    <div className="flex flex-col space-y-4 items-center">
      <div className="relative w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px]">
        <Image
          src="/testimonial_mh.jpg"
          fill
          className="object-contain block"
          alt="Matthew Heering"
        />
      </div>
      <div className="text-xs w-[200px] sm:w-[250px] md:w-[300px]">
        &quot;
        Golden Years has done more for our community than
        we can thank it for.
        &quot;
      </div>
      <div className="text-sm w-[200px] sm:w-[250px] md:w-[300px]">
        <span className="font-semibold">Matthew Heering</span>, teacher
      </div>
    </div>
  </div>
);
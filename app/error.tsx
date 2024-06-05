"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/Button";

const Error = () => (
  <div className="h-full flex flex-col items-center justify-center space-y-4">
    <Image
      src="/no_image.png"
      height="300"
      width="300"
      alt="error"
      className="block dark:hidden"
    />
    <Image
      src="/no_image_dark.png"
      height="300"
      width="300"
      alt="error"
      className="hidden dark:block"
    />
    <div className="text-xl font-medium">
      something went wrong!
    </div>
    <Button asChild>
      <Link href="/">
        go back
      </Link>
    </Button>
  </div>
);

export default Error;
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import Image from "next/image";

import logoImage from "#/golden_years_logo.png";

// ESLint is awful with enums. Sorry.
enum LogoSizes {
  ExtraSmall = 100,
  Small = 200,
  Normal = 300,
}

interface LogoProps {
  size: keyof typeof LogoSizes
  className?: string,
}

export const Logo = ({
  size,
  className
}: LogoProps) => (
  <div className={className}>
    <Image
      src={logoImage}
      className="flex items-center"
      alt="Golden Years Logo"
      width={LogoSizes[size]}
      height={LogoSizes[size]}
    />
  </div>
);
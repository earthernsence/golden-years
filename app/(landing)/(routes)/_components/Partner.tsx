import Image from "next/image";

interface PartnerData {
  name: string,
  description: string,
  image?: string,
}

const Partner = ({ partner }: { partner: PartnerData }) => (
  <div className="flex rounded-lg md:space-x-4
   xs:flex-col md:flex-row w-full place-items-center md:h-auto">
    <div className="xs:flex md:hidden lg:flex md:w-1/4">
      <Image
        className="border-gray-300 border-2 xs:mb-4 md:mr-4 md:mb-0 flex xs:w-48 xs:h-48 md:w-32 md:h-32 object-cover"
        src={partner.image || "/no_image.png"}
        alt={`Image of ${partner.name}`}
        height={512} width={512}
      />
    </div>
    <div className="flex flex-col relative xs:w-5/6 md:w-full xs:mb-4 md:mb-0">
      <div className="text-xl xs:text-center md:text-left dark:text-white">
        { partner.name }
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300 md:text-left">{partner.description}</div>
    </div>
  </div>
);

export default Partner;
import Image from "next/image";
import Link from "next/link";

interface VolunteerMemberInformation {
  name: string,
  image: string,
  username: string
}

interface VolunteerCardProps {
  volunteer: VolunteerMemberInformation
}

export const VolunteerCard = ({ volunteer }: VolunteerCardProps) => (
  <figure className="bg-slate-100 rounded-xl p-6 dark:bg-slate-800 flex gap-y-2 flex-col">
    <Image
      className="flex size-24 md:w-48 md:h-48 rounded-lg object-cover
      border-2 place-self-center"
      src={volunteer.image || "/no_image.png"}
      alt={volunteer.name}
      height={1600}
      width={1600}
    />
    <figcaption className="font-medium xs:text-lg md:text-xl">
      <Link
        className="text-gy-light dark:text-gy-dark hover:underline"
        href={`/users/${volunteer.username}`}
      >
        {volunteer.name}
      </Link>
      <div className="text-slate-700 dark:text-slate-400">
        Member
      </div>
    </figcaption>
  </figure>
);
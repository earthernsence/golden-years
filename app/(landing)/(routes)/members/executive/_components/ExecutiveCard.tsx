import Image from "next/image";
import Link from "next/link";

interface ExecutiveMemberInformation {
  name: string,
  bio: string,
  exec: string,
  image: string,
  username: string
}

interface ExecutiveCardProps {
  exec: ExecutiveMemberInformation
}

export const ExecutiveCard = ({ exec }: ExecutiveCardProps) => (
  <figure className="bg-slate-100 rounded-xl p-6 dark:bg-slate-800">
    <div className="flex md:flex-row items-center justify-around">
      <Image
        className="w-24 h-24 md:w-48 md:h-48 md:rounded-lg rounded-full object-cover
        border-2"
        src={exec.image || "/no_image.png"}
        alt={exec.name}
        height={1600}
        width={1600}
      />
      <figcaption className="font-medium xs:text-lg md:text-xl">
        <Link
          className="text-gy-light dark:text-gy-dark hover:underline"
          href={`/users/${exec.username}`}
        >
          {exec.name}
        </Link>
        <div className="text-slate-700 dark:text-slate-400">
          {exec.exec}
        </div>
      </figcaption>
    </div>
    <div className="pt-6 md:p-8 text-center md:text-left space-y-4">
      <blockquote>
        <div className="text-lg font-medium h-auto text-justify">
          {exec.bio}
        </div>
      </blockquote>
    </div>
  </figure>
);
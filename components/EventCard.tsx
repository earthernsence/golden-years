import Image from "next/image";

import Icon from "./Icon";
import { Skeleton } from "./ui/Skeleton";

import { faUser } from "@fortawesome/free-solid-svg-icons";

interface EventCardProps {
  eventId: string,
  title: string,
  date: number,
  description: string,
  image?: string,
  location: string,
  organiser: {
    name: string,
    username: string
  }
}

const EventCard = ({
  eventId,
  title,
  date,
  description,
  image,
  location,
  organiser
}: EventCardProps) => {
  const something = true;

  return (
    <div className="border-4 border-gray-500 flex rounded-lg flex-row w-full place-items-center p-4 mb-2 md:h-40">
      <div className="flex w-1/4">
        <Image
          className="flex border-gray-300 border-2 mr-4"
          src={image || "/no_image.png"}
          alt={`Event image for ${title}`}
          height={128} width={128}
        />
      </div>
      <div className="flex flex-col relative w-1/2">
        <div className="text-2xl text-white">{ title }</div>
        <div className="text-md text-gray-400 truncate">{ description }</div>
        <div className="text-xs text-gray-500">{ location } on { date }</div>
      </div>
      <div className="flex xs:flex-col md:flex-row w-1/4 justify-center place-items-center">
        <div className="flex flex-col">
          <Icon
            icon={faUser}
            link={`/users/${organiser.username}`}
          />
          <div className="text-md text-white">Organised by { organiser.name }</div>
        </div>
      </div>
    </div>
  );
};

EventCard.Skeleton = function EventCardSkeleton() {
  return (
    <div className="border-4 border-gray-500 flex rounded-lg flex-row w-2/3 place-items-center p-4 mb-2 md:h-40">
      <Skeleton className="w-36 h-36 rounded-full" />
    </div>
  );
};

export default EventCard;
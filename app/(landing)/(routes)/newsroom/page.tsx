"use client";

import { Info } from "lucide-react";

import { Articles } from "./_components/Articles";
import { NewsroomHeader } from "./_components/NewsroomHeader";

import { useNewsroomInfoModal } from "@/hooks/use-newsroom-info-modal";

const NewsroomPage = () => {
  const infoModal = useNewsroomInfoModal();
  return (
    <div className="place-self-center max-w-full h-full md:w-3/4 xs:w-[95%] pt-0 pb-12 md:pl-16 md:pr-16
                    bg-gy-bg-light dark:bg-gy-bg-dark xs:text-left md:text-justify">
      <NewsroomHeader />
      <div
        className="inline-flex flex-row items-center xs:justify-center md:justify-normal
                  text-sm xs:text-center md:text-left opacity-50"
        onClick={infoModal.onOpen}
      >
        <Info role="button" className="mr-2 size-4" /> Click for info
      </div>
      <div className="font-extrabold xs:text-[28px] sm:text-gy-large-header border-b-2 border-black dark:border-white">
        Latest articles
      </div>
      <Articles />
    </div>
  );
};

export default NewsroomPage;
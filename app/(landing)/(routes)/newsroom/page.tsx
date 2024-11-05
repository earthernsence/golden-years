"use client";

import { Articles } from "./_components/Articles";
import { NewsroomHeader } from "./_components/NewsroomHeader";

const NewsroomPage = () => (
  <div className="place-self-center max-w-full h-full md:w-3/4 xs:w-11/12 pt-0 pb-12 md:pl-16 md:pr-16
                    bg-gy-bg-light dark:bg-gy-bg-dark xs:text-left md:text-justify">
    <NewsroomHeader />
    <div className="font-extrabold xs:text-[28px] sm:text-gy-large-header border-b-2 border-black dark:border-white">
      Latest articles
    </div>
    <Articles />
  </div>
);

export default NewsroomPage;
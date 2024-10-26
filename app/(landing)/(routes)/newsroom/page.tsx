"use client";

import { NewsroomHeader } from "./_components/NewsroomHeader";

const NewsroomPage = () => (
  <div className="place-self-center max-w-full h-full md:w-2/3 xs:w-11/12 pt-0 pb-12 md:pl-16 md:pr-16
                    bg-gy-bg-light dark:bg-gy-bg-dark xs:text-left md:text-justify">
    <NewsroomHeader />
  </div>
);

export default NewsroomPage;
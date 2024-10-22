"use client";

const SpecificEventPageLayout = ({
  children
}: {
  children: React.ReactNode
}) => (
  <div className="h-full w-full min-w-full bg-gy-bg-light dark:bg-gy-bg-dark">
    <main className="min-h-full flex flex-col justify-start items-center bg-gy-bg-light dark:bg-gy-bg-dark">
      { children }
    </main>
  </div>
);

export default SpecificEventPageLayout;
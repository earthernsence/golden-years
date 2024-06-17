/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-shadow
enum WordmarkSizes {
  Small = "text-sm",
  Medium = "text-md",
  Large = "text-lg",
  ExtraLarge = "text-xl"
}

interface WordmarkProps {
  "forceFull"?: boolean,
  size?: keyof typeof WordmarkSizes
}

export const Wordmark = ({
  forceFull,
  size = "Medium"
}: WordmarkProps) => {

  if (forceFull) {
    return (
      <div className={`inline-flex ${WordmarkSizes[size]}`}>
        <span className="text-gy-light dark:text-gy-dark ml-px">Golden</span> Years
      </div>
    );
  }

  return (
    <>
      <div className={`hidden ${WordmarkSizes[size]} md:inline-flex`}>
        <span className="text-gy-light dark:text-gy-dark ml-px">Golden</span> Years
      </div>
      <div className={`flex ${WordmarkSizes[size]} md:hidden`}>
        <span className="text-gy-light dark:text-gy-dark ml-px">G</span>Y
      </div>
    </>
  );
};
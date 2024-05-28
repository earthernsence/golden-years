import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-brands-svg-icons";

interface IconProps {
  icon: IconDefinition,
  link?: string,
  className?: string,
  onClick?: Function
}

export const Icon = ({ icon, link, className, onClick }: IconProps) => (
  <a
    href={link}
    onClick={onClick ? () => onClick() : undefined}
    target="_blank"
    className={`text-black dark:text-white opacity-50 mr-4 cursor-pointer
              transition-all duration-200 ease-in-out
              hover:opacity-100 hover:scale-110
              ${className}`}
  >
    <FontAwesomeIcon
      icon={icon}
      width={50}
      height={50}
      className="w-12 h-12"
    />
  </a>
);

export default Icon;
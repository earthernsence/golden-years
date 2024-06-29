"use client";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faMessage } from "@fortawesome/free-solid-svg-icons";

import { Button } from "@/components/ui/Button";
import Icon from "./Icon";
import { Wordmark } from "./Wordmark";

import { usePrivacyPolicyModal } from "@/hooks/use-privacy-policy-modal";
import { useTermsModal } from "@/hooks/use-terms-modal";

export const Footer = () => {
  const terms = useTermsModal();
  const privacy = usePrivacyPolicyModal();

  return (
    <div className="flex flex-row items-center w-full p-6 bg-background z-50 dark:bg-dark">
      <div className="font-semibold flex text-center mr-4 md:w-1/12">
        <Wordmark />
      </div>
      <br />
      {/* <div className="text-xs flex opacity-25 text-center items-center justify-end w-full mr-2">
        Website made with &#10084; by
        <Link className="underline" href={"https://github.com/earthernsence"}>Jace Royer</Link>
      </div> */}
      <br />
      <div className="ml-auto justify-end flex items-center gap-x-2 text-muted-foreground">
        <div className="flex flex-row w-full gap-x-2 items-center">
          <Icon
            icon={faInstagram}
            className="h-8 w-8"
            link={"https://www.instagram.com/goldenyearsfhhs/"}
          />
          <Icon
            icon={faMessage}
            className="h-8 w-8"
            link={"https://groupme.com/join_group/100192539/3CkxOnJA"}
          />
        </div>
        <Button variant="ghost" size="sm" onClick={privacy.onOpen}>
        Privacy
        </Button>
        <Button variant="ghost" size="sm" onClick={terms.onOpen}>
        Terms
        </Button>
      </div>
    </div>
  );
};
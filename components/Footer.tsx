"use client";

import { faInstagram, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import useSWR from "swr";

import { Button } from "@/components/ui/Button";
import Icon from "./Icon";
import Spinner from "./Spinner";
import { Wordmark } from "./Wordmark";

import { usePrivacyPolicyModal } from "@/hooks/use-privacy-policy-modal";
import { useTermsModal } from "@/hooks/use-terms-modal";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const Footer = () => {
  const terms = useTermsModal();
  const privacy = usePrivacyPolicyModal();

  const { data, error, isLoading } = useSWR(
    "https://api.github.com/repos/earthernsence/golden-years/commits?per_page=1",
    fetcher
  );

  if (error) throw new Error("Commit not found");
  if (isLoading) return <Spinner />;

  const commit: { sha: string, html_url: string } = data[0];

  return (
    <div className="flex xs:flex-col md:flex-row md:items-center
     w-full p-6 bg-gy-bg-light z-50 border-t dark:bg-gy-bg-dark">
      <div className="font-semibold flex text-center mr-4 md:w-3/12 flex-col">
        <Wordmark />
        <div className="text-xs font-medium text-center text-dark/75 dark:text-muted-foreground/75
        flex items-center justify-start w-full mr-2 flex-row space-x-1">
          <span>website made with &#10084; by</span>
          <Link
            className="hover:underline"
            href={"https://github.com/earthernsence"}
            target="_blank"
          >
            Jace Royer
          </Link>
          <Link
            className="hover:underline dark:text-muted-foreground/50"
            href={commit.html_url}
            target="_blank"
          >
            ({commit.sha.slice(0, 7)})
          </Link>
        </div>
      </div>
      <br />
      <div className="md:ml-auto md:justify-end flex items-center gap-x-2 text-muted-foreground">
        <div className="flex flex-row w-full gap-x-2 items-center">
          <Icon
            icon={faInstagram}
            className="size-8"
            link={"https://www.instagram.com/goldenyearsfhhs/"}
          />
          <Icon
            icon={faMessage}
            className="size-8"
            link={"https://groupme.com/join_group/100192539/3CkxOnJA"}
          />
          <Icon
            icon={faXTwitter}
            className="size-8"
            link={"https://x.com/goldenyearsfhhs"}
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
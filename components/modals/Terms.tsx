"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader
} from "@/components/ui/Dialog";

import { usePrivacyPolicyModal } from "@/hooks/use-privacy-policy-modal";
import { useTermsModal } from "@/hooks/use-terms-modal";

export const TermsModal = () => {
  const terms = useTermsModal();
  const privacy = usePrivacyPolicyModal();

  const openPrivacy = () => {
    terms.onClose();
    privacy.onOpen();
  };

  return (
    <Dialog open={terms.isOpen} onOpenChange={terms.onClose}>
      <DialogContent className="h-full max-h-[50%] overflow-y-auto">
        <DialogHeader className="border-b pb-3">
          <div className="text-lg font-medium">
          Terms & Conditions
          </div>
        </DialogHeader>
        <DialogDescription className="space-y-1">
          <div className="flex items-center text-xs">
            Golden Years is a simple, interactive way of connecting volunteers to opportunities
            in nursing and assisted living homes, created by Carissa Choi and Sydney Lewis.
          </div>
          <div className="flex items-center text-xs">
            Updated May 31, 2024
          </div>
        </DialogDescription>
        <div className="text-xs text-justify w-full">
          Access to the Site and the use of the Services is conditioned upon your acceptance of, and compliance with,
          these terms. By accessing or using the Services, you agree to be bound by these Terms. If you disagree with
          any part of these Terms, then you do not have permission to access the Services, and you must immediately
          cease accessing and/or using the Services.
          <br />
          You can view our Privacy Policy{" "}
          <span onClick={openPrivacy} className="underline text-sky-500 cursor-pointer">here</span>.
        </div>
        <span className="border-b flex h-2 justify-items-center mt-1 mb-2" />
        <div className="text-xs text-justify w-full">
          As the User, when signing up for an Event, you are entrusting the accuracy
          of the Event posted by the Event Organiser.
          <br />
          As the User, you are also entrusted to be completely and fully accurate, to the best of your abilities,
          the information on both your account and any Event you sign up for. Failure to provide accurate information
          as is necessitated by these Terms will result in the termination of the User&apos;s account.
          <br />
          The creation of a User account is optional, but is required for Users to sign up for Events.
        </div>
        <span className="border-b flex h-2 justify-items-center mt-1 mb-2" />
        <div className="text-xs text-justify w-full">
          As an Organiser, when creating an Event, you are faithfully and accurately reporting the
          details of your Event, in full, and are responsible for continuously monitoring your Event.
          Failure to report information quickly and directly can result in the termination of the
          Organiser&apos;s account.
          <br />
          As an Organiser, you are also entrusted to be completely and fully accurate, to the best of your abilities,
          the information on both your account and any Event you create. Failure to provide accurate information
          as is necessitated by these Terms will result in the termination of the Organiser&apos;s account.
        </div>
        <span className="border-b flex h-2 justify-items-center mt-1 mb-2" />
        <div className="text-xs text-justify w-full">
          We, the creators of Golden Years, will attempt to ensure the truthfulness of all Events posted.
          <br />
          We, the creators of Golden Years, are not responsible for any inaccuracies in the information on
          User or Organiser accounts or created Events.
          <br />
          We, the creators of Golden Years, reserve the right to modify or delete any Event or Account at any time
          in our sole discretion. We, therefore, reserve the right to change or update information and to correct
          errors, inaccuracies, or omissions at any time without prior notice.
          <br />
          We, the creators of Golden Years, reserve the right to refuse service, terminate accounts, remove or edit
          content at our sole discretion.
        </div>
        <span className="border-b flex h-2 justify-items-center mt-1 mb-2" />
        <div className="text-xs text-justify w-full">
          Therefore, you agree that you will not, under any circumstances:
          <ul className="flex flex-col list-disc list-inside">
            <li>
              use the Site to post any information that is abusive, threatening, obscene, defamatory, libelous, or
              racially, sexually, religiously, or otherwise objectionable and offensive;
            </li>
            <li>
              use the Site for any unlawful purpose or for the promotion of illegal activities or Events;
            </li>
            <li>
              use the Site to attempt to, or harass, abuse, or harm another person or group;
            </li>
            <li>
              use another User&apos;s account without permission;
            </li>
            <li>
              provide false or inaccurate information when registering an account via the Site;
            </li>
            <li>
              interfere or attempt to interfere with the proper functioning of the Site;
            </li>
            <li>
              make any automated use of the Site, or take any action that we deem to impose or to potentially
              impose an unreasonable or disproportionately large load on our servers or network infrastructure;
            </li>
            <li>
              publish or link to malicious content intended to damage or disrupt another user&apos;s browser or computer
            </li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};
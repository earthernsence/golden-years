"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader
} from "@/components/ui/Dialog";

import { usePrivacyPolicyModal } from "@/hooks/use-privacy-policy-modal";
import { useTermsModal } from "@/hooks/use-terms-modal";


export const PrivacyPolicyModal = () => {
  const privacy = usePrivacyPolicyModal();
  const terms = useTermsModal();

  const openTerms = () => {
    privacy.onClose();
    terms.onOpen();
  };

  return (
    <Dialog open={privacy.isOpen} onOpenChange={privacy.onClose}>
      <DialogContent className="h-full max-h-[50%] overflow-y-auto">
        <DialogHeader className="border-b pb-3">
          <div className="text-lg font-medium">
          Privacy Policy
          </div>
        </DialogHeader>
        <DialogDescription>
          <div className="flex items-center text-xs">
            Golden Years is a simple, interactive way of connecting volunteers to opportunities
            in nursing and assisted living homes, created by Carissa Choi and Sydney Lewis.
          </div>
          <div className="flex items-center text-xs">
            Updated August 9, 2024
          </div>
        </DialogDescription>
        <div className="text-xs text-justify w-full">
          Access to the Site and the use of the Services is conditioned upon your acceptance of, and compliance with,
          this Policy. By accessing or using the Services, you agree to be bound by these Terms. If you disagree with
          any part of these Policy, then you do not have permission to access the Services, and you must immediately
          cease accessing and/or using the Services.
          <br />
          You can view our Terms of Service{" "}
          <span onClick={openTerms} className="underline text-sky-500 cursor-pointer">here</span>.
        </div>
        <span className="border-b flex h-2 justify-items-center mt-1 mb-2" />
        <div className="text-xs text-justify w-full">
          <span className="font-bold">We do not knowingly add users to our website without permission.</span> A user
          is added to our site if and only if they register themselves as a User.
          <br />
          Golden Years does not and cannot control how Event Organisers use the information provided to them, such as
          your name, username, and email. If an Event Organiser adds your information to our Site and you do not wish
          to be a part of our service, contact us and our staff will delete you from our system.
          <br />
          <span className="underline">No information is collected</span> about you if you do not register an Account
          on Golden Years.
          <br />
          Below is a summary of the categories of information we collect, where we get it from, and why we collect it.
        </div>
        <span className="border-b flex h-2 justify-items-center mt-1 mb-2" />
        <div className="text-xs text-justify w-full">
          Golden Years collects two types of information: your provided User information and any information about an
          Event. Any information collected by Google or Apple, the service used on sign-up, aside from the information
          listed here, is <span className="italic">not</span> used by Golden Years, nor is Golden Years responsible
          for how that information is used.
          <br />
          <br />
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <span className="font-semibold text-lg">Your User Information</span>
              </AccordionTrigger>
              <AccordionContent className="text-xs text-justify w-full">
                Golden Years collects the following information about a User.
                Only Golden Years and Event Organisers receive this information for their own use.
                The information listed here, besides a User&apos;s email, is available on each User&apos;s page.
                All of this is provided by the User when they register for an Account:
                <br />
                <ul className="flex flex-col list-disc list-inside">
                  <li>
                    a name;
                  </li>
                  <li>
                    an email;
                  </li>
                  <li>
                    a username;
                  </li>
                  <li>
                    a location, such as a city or school (not required);
                  </li>
                  <li>
                    a biography (not required);
                  </li>
                  <li>
                    a profile image (from your Google or Apple account, whichever was used to sign in to Golden Years).
                    This can be changed from a User&apos;s profile, and old profile pictures are not stored anywhere.
                  </li>
                </ul>
                <br />
                This information is collected in order to fulfill your requests for services and information,
                improve our Site&apos;s functionality, improve our Services, and for other business purposes.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                <span className="font-semibold text-lg">Event Information</span>
              </AccordionTrigger>
              <AccordionContent className="text-xs text-justify w-full">
                Golden Years collects the following information about an Event.
                Only Golden Years receives this information for their own use.
                The information listed here, besides the Organiser&apos;s and the User&apos;s email, is available
                on each Event&apos;s page.
                All of this information, besides the Participant&apos;s emails, usernames, and names (which is given
                to Golden Years when a User signs up for an Event), is provided by the Event Organiser when they create
                an Event:
                <br />
                <ul className="flex flex-col list-disc list-inside">
                  <li>
                    a title;
                  </li>
                  <li>
                    an image;
                  </li>
                  <li>
                    a description;
                  </li>
                  <li>
                    a location;
                  </li>
                  <li>
                    the Organiser&apos;s information, as provided from their user account;
                  </li>
                  <li>
                    any Participant&apos;s information, as provided from their user account.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <br />
          As a reminder, it is of utmost importance that the information you share publicly on the Site is, well,
          public. Be sure to follow good internet safety practices and avoid oversharing. Golden Years is not liable
          for the misuse of information that you choose to place on the Site.
        </div>
      </DialogContent>
    </Dialog>
  );
};
"use client";

import { useForm } from "react-hook-form";
import { useQuery } from "convex/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import MultipleSelector from "@/components/ui/MultiSelector";
import { Option } from "@/components/groups";
import Spinner from "@/components/Spinner";
import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/Textarea";

import { api } from "@/convex/_generated/api";
import { usePrivacyPolicyModal } from "@/hooks/use-privacy-policy-modal";
import { useTermsModal } from "@/hooks/use-terms-modal";

function usernameTest(u: string) {
  const hasWhitespace = /\s/u.test(u);
  const hasSpecial = /[*|":<>.,[\]{}\\()';@&$]/u.test(u);
  const isAlphanumeric = /^[a-zA-Z0-9]{2,}$/u.test(u);

  if (hasWhitespace || hasSpecial) return false;
  return isAlphanumeric;
}

export const formSchema = z.object({
  name: z.string().min(2, {
    message: "Display name must be at least 2 characters."
  }).max(50, {
    message: "Display name cannot be more than 50 characters."
  }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters."
  }).max(50, {
    message: "Username cannot be more than 50 characters."
  }).refine(value => usernameTest(value), {
    message: "No spaces or special characters in usernames. Only alphanumeric characters allowed."
  }),
  email: z.string().email({
    message: "Not a valid email address."
  }),
  bio: z.string().min(2, {
    message: "Bio must be at least 2 characters."
  }).max(500, {
    message: "Bio cannot be more than 500 characters."
  }).optional().or(z.literal("")),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters."
  }).max(50, {
    message: "Location cannot be more than 50 characters."
  }).optional().or(z.literal("")),
  groups: z.array(z.object({
    label: z.string(),
    value: z.string(),
    group: z.string(),
    fixed: z.boolean().optional()
  })).min(1, { message: "You must select at least one group (try a \"Class of\" group!)" }),
  terms: z.boolean()
});

interface OnboardingFormProps {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (values: z.infer<typeof formSchema>) => void
}

export function OnboardingForm({
  onSubmit
}: OnboardingFormProps) {
  const terms = useTermsModal();
  const privacy = usePrivacyPolicyModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      bio: "",
      location: "",
      terms: false,
      groups: [],
    }
  });

  const formOptions = useQuery(api.groups.get, { type: "form" });

  // We need the formOptions to exist in order to populate the groups field on the form.
  // If it doesn't, we simply return a spinner while it loads.
  if (formOptions === undefined) {
    return <Spinner />;
  }

  // When retrieving things from Convex, they are given an _id and a creationTime field. Neither of these
  // are permitted inside the Option type, so we go ahead and strip these from the data for each option.
  const strippedOptions: Array<Option> = [];

  for (const option of formOptions) {
    if (!option) break;
    strippedOptions.push({ value: option.value, fixed: option.fixed, label: option.label, group: option.group });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-center items-center align-middle h-full w-screen space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="max-w-(--breakpoint-xs)">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="your displayed name" {...field} />
              </FormControl>
              <FormDescription>
                This is the name that will appear when you sign up for events and on your profile.
                It is <span className="italic">different</span> than your username.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="max-w-(--breakpoint-xs)">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your email" {...field} />
              </FormControl>
              <FormDescription>
                This email will not appear on your profile, but will instead be used to contact you
                about events you sign up for.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="max-w-(--breakpoint-xs)">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="your username" {...field} />
              </FormControl>
              <FormDescription>
                This is the name that will appear on your profile URL as a unique identifier.
                It is <span className="italic">different</span> than your display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="max-w-(--breakpoint-xs)">
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="a little about yourself" className="resize-none" {...field} />
              </FormControl>
              <FormDescription>
                Information about you that will appear on your profile.
                Be sure to follow good internet practices and avoid oversharing.
                This is not required.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="max-w-(--breakpoint-xs)">
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="your location or school" {...field} />
              </FormControl>
              <FormDescription>
                Use a city or the school that you attend. This is not required.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="groups"
          render={({ field }) => (
            <FormItem className="max-w-(--breakpoint-xs) text-left text-sm">
              <FormLabel className="text-lg font-semibold">Groups</FormLabel>
              <FormControl>
                <MultipleSelector
                  {...field}
                  className="bg-transparent"
                  badgeClassName="bg-white text-foreground border-muted-foreground
                  bg-gy-bg-light dark:bg-gy-bg-dark dark:text-muted-foreground
                  hover:bg-muted-foreground/50 dark:hover:bg-muted-foreground/25"
                  defaultOptions={strippedOptions}
                  placeholder="Select the groups you are a member of..."
                  groupBy="group"
                  emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                      No results found
                    </p>
                  }
                />
              </FormControl>
              <FormDescription>
                These groups will appear on your profile. If there is a group you are a member of that is
                not in this list, contact the website developer. If you are a member of the executive team,
                that group and your role can be added by a site Admin once you have completed onboarding.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="terms"
          // eslint-disable-next-line no-unused-vars
          render={({ field }) => (
            <FormItem
              className="max-w-(--breakpoint-xs) flex flex-row items-center justify-between rounded-lg border p-4"
            >
              <div className="space-y-0.5">
                <FormLabel>Terms and Privacy Policy</FormLabel>
                <br />
                <FormDescription>
                Visit our{" "}
                  <span onClick={terms.onOpen} className="underline text-sky-500 cursor-pointer">Terms of Service</span>
                  {" "}and our{" "}
                  <span
                    onClick={privacy.onOpen}
                    className="underline text-sky-500 cursor-pointer"
                  >
                    Privacy Policy
                  </span>.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="max-w-lg flex place-self-center flex-row"
          type="submit"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
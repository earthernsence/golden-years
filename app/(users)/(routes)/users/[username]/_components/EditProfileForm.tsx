"use client";

import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/Textarea";

import { FORM_OPTIONS, transformGroups } from "@/components/groups";
import { Doc } from "@/convex/_generated/dataModel";

export const formSchema = z.object({
  name: z.string().min(2, {
    message: "Display name must be at least 2 characters."
  }).max(50, {
    message: "Display name cannot be more than 50 characters."
  }),
  email: z.string().email({
    message: "Not a valid email address."
  }),
  bio: z.string().min(2, {
    message: "Bio must be at least 2 characters."
  }).max(200, {
    message: "Bio cannot be more than 200 characters."
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
  })).min(1, { message: "You must select at least one group (try a \"Class of\" group!)" })
});

interface EditProfileFormProps {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (values: z.infer<typeof formSchema>) => void,
  user: Doc<"users">
}

export function EditProfileForm({
  onSubmit,
  user
}: EditProfileFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      bio: user.bio,
      location: user.location,
      groups: transformGroups(user.groups),
    }
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-auto gap-y-1"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="max-w-screen-xs text-left text-sm">
              <FormLabel className="text-lg font-semibold">Name</FormLabel>
              <FormControl>
                <Input placeholder="your displayed name" className="dark:bg-dark" {...field} />
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
            <FormItem className="max-w-screen-xs text-left text-sm">
              <FormLabel className="text-lg font-semibold">Email</FormLabel>
              <FormControl>
                <Input placeholder="your email" className="dark:bg-dark" {...field} />
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
          name="bio"
          render={({ field }) => (
            <FormItem className="max-w-screen-xs text-left text-sm">
              <FormLabel className="text-lg font-semibold">Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="a little about yourself" className="resize-none dark:bg-dark" {...field} />
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
            <FormItem className="max-w-screen-xs text-left text-sm">
              <FormLabel className="text-lg font-semibold">Location</FormLabel>
              <FormControl>
                <Input placeholder="your location or school" className="dark:bg-dark" {...field} />
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
            <FormItem className="max-w-screen-xs text-left text-sm">
              <FormLabel className="text-lg font-semibold">Groups</FormLabel>
              <FormControl>
                <MultipleSelector
                  {...field}
                  className="bg-white dark:bg-dark"
                  badgeClassName="bg-white text-foreground border-muted-foreground
                  dark:bg-dark dark:text-muted-foreground
                  hover:bg-muted-foreground/50 dark:hover:bg-muted-foreground/25"
                  defaultOptions={FORM_OPTIONS}
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
                not in this list, contact the website developer.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex pt-2 justify-end">
          <Button className="max-w-lg w-36 flex place-self center" type="submit">Confirm edits</Button>
        </div>
      </form>
    </Form>
  );
}
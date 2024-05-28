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
import { Textarea } from "@/components/ui/Textarea";

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
  }).optional().or(z.literal(""))
});

interface OnboardingFormProps {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (values: z.infer<typeof formSchema>) => void
}

export function OnboardingForm({
  onSubmit
}: OnboardingFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      bio: "",
      location: "",
    }
  });

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
            <FormItem className="max-w-screen-xs">
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
            <FormItem className="max-w-screen-xs">
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
            <FormItem className="max-w-screen-xs">
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
            <FormItem className="max-w-screen-xs">
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
            <FormItem className="max-w-screen-xs">
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
        <Button className="max-w-lg flex place-self-center" type="submit">Submit</Button>
      </form>
    </Form>
  );
}
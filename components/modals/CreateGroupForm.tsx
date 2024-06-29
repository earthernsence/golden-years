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
import { Switch } from "@/components/ui/Switch";

// Does not check for whitespace
function isCleanString(u: string) {
  const hasSpecial = /[*|":<>.,[\]{}\\()';@&$]/u.test(u);
  const isAlphanumericWithSpaces = /^[\w\s]+$/u.test(u);

  if (hasSpecial) return false;
  return isAlphanumericWithSpaces;
}

// Checks for whitespace
function isStrictCleanString(u: string) {
  const hasWhitespace = /\s/u.test(u);
  const hasSpecial = /[*|":<>.,[\]{}\\()';@&$]/u.test(u);
  const isAlphanumeric = /^[a-zA-Z0-9-_]{2,}$/u.test(u);

  if (hasWhitespace || hasSpecial) return false;
  return isAlphanumeric;
}

export const formSchema = z.object({
  group: z.string().min(2, {
    message: "Header must be at least 2 characters."
  }).max(50, {
    message: "Header cannot be more than 50 characters."
  }).refine(value => isCleanString(value), {
    message: "Only alphanumeric characters allowed. Spaces can be used."
  }),
  value: z.string().min(2, {
    message: "Value must be at least 2 characters."
  }).max(50, {
    message: "Value cannot be more than 50 characters."
  }).refine(value => isStrictCleanString(value), {
    message: "Only alphanumeric characters allowed."
  }),
  label: z.string().min(2, {
    message: "Label must be at least 2 characters."
  }).max(50, {
    message: "Label cannot be more than 50 characters."
  }).refine(value => isCleanString(value), {
    message: "Only alphanumeric characters allowed. Spaces can be used."
  }),
  fixed: z.boolean(),
});

interface CreateGroupFormProps {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (values: z.infer<typeof formSchema>) => void;
}

// TODO: Explore autocompleting options here so that we can avoid the whole "this one already exists"
// errors.

export function CreateGroupForm({
  onSubmit,
}: CreateGroupFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      group: "",
      value: "",
      label: "New Group",
      fixed: false
    }
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-center items-center align-middle h-full w-full space-y-8"
      >
        <FormField
          control={form.control}
          name="group"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Header</FormLabel>
              <FormControl>
                <Input placeholder="Header" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                When selecting a group on the User Profile page, the groups are sorted into different piles,
                based on a given header, like &quot;Class&quot;. Use this field to either create a new header, or
                if you know what header to choose already, type that instead.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Value</FormLabel>
              <FormControl>
                <Input placeholder="Value" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                This is a backend code value that is stored on user data. It is only used for retreival.
                These must be alphanumeric.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input placeholder="Label" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                This is the actual value that will appear on a user page or when they search for a group
                to join on their profiles.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fixed"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>
                  Fixed group
                </FormLabel>
                <br />
                <FormDescription className="text-xs">
                  Determines whether or not the group is fixed. Only Admins can add fixed groups to users.
                  These groups cannot be removed by a user.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="max-w-lg flex place-self-center" type="submit">Submit</Button>
      </form>
    </Form>
  );
}
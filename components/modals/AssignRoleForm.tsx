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
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";

import { ElementType } from "@/lib/utils";

const ROLES = [
  "President",
  "Co-President",
  "Vice President",
  "Fundraising Specialist",
  "Social Media Specialist",
  "Secretary",
  "Vice Secretary",
  "Website Developer",
  "None"
] as const;

export const formSchema = z.object({
  role: z.enum([
    "President",
    "Co-President",
    "Vice President",
    "Fundraising Specialist",
    "Social Media Specialist",
    "Secretary",
    "Vice Secretary",
    "Website Developer",
    "None"
  ], {
    // eslint-disable-next-line camelcase
    required_error: "You must select a role.",
  }),
  isAdmin: z.boolean().optional(),
});

interface AssignRoleFormProps {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  role: ElementType<typeof ROLES>,
  isAdmin: Boolean
}

export function AssignRoleForm({
  onSubmit,
  isAdmin,
  role
}: AssignRoleFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isAdmin: Boolean(isAdmin),
      role,
    }
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-center items-center align-middle h-full w-full space-y-8">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Select a role for this user</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {ROLES.map((choice: string, index: number) => (
                    <FormItem className="flex items-center space-x-3 space-y-0" key={index}>
                      <FormControl>
                        <RadioGroupItem value={choice} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {choice}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isAdmin"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>
                  Make user Admin?
                </FormLabel>
                <br />
                <FormDescription className="text-xs">
                  You can make a user be considered an Admin.{" "}
                  <span className="text-red-500">This is a dangerous action!</span> Be careful who you
                  give this power to. Admins are able to create Events, alter User information, edit Events and Teams,
                  and view club statistics.
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
        <Button type="submit">Confirm</Button>
      </form>
    </Form>
  );
}
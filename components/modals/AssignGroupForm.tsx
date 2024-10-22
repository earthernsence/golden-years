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
import MultipleSelector from "@/components/ui/MultiSelector";
import { Option } from "@/components/groups";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import Spinner from "../Spinner";

export const formSchema = z.object({
  groups: z.array(z.object({
    label: z.string(),
    value: z.string(),
    group: z.string(),
    fixed: z.boolean().optional()
  })).min(1, { message: "You must select at least one group (try a \"Class of\" group!)" })
});

interface AssignGroupFormProps {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (values: z.infer<typeof formSchema>) => void,
  user: Doc<"users">
}

export function AssignGroupForm({
  onSubmit,
  user
}: AssignGroupFormProps) {
  const transformedGroups = useQuery(api.groups.transform, { groups: user.groups, unfixOptions: true });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groups: transformedGroups
    },
    // The value of transformedGroups is technically not asynchronous. What this values field does is
    // it populates once the value is received. It uses some black magic that not even I know.
    // Truth be told, this could be entirely awful code, but it *does* work, which is more than my three previous
    // attempts can say.
    values: {
      groups: transformedGroups?.map(o => ({
        value: o.value,
        group: o.group,
        label: o.label,
        fixed: o.fixed
      })) || []
    }
  });

  const allGroups = useQuery(api.groups.get, { type: "all" });

  // We need the formOptions to exist in order to populate the groups field on the form.
  // If it doesn't, we simply return a spinner while it loads.
  if (allGroups === undefined || transformedGroups === undefined) {
    return <Spinner />;
  }

  // When retrieving things from Convex, they are given an _id and a creationTime field. Neither of these
  // are permitted inside the Option type, so we go ahead and strip these from the data for each option.
  const strippedOptions: Array<Option> = [];

  for (const option of allGroups) {
    if (!option) break;
    // We make ALL groups not-fixed in order to allow admins to change all groups at any time.
    strippedOptions.push({ value: option.value, fixed: false, label: option.label, group: option.group });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-auto gap-y-1"
      >
        <FormField
          control={form.control}
          name="groups"
          render={({ field }) => (
            <FormItem className="max-w-screen-xs text-left text-sm gap-y-2">
              <FormLabel className="text-lg font-semibold">Groups</FormLabel>
              <FormControl>
                <MultipleSelector
                  {...field}
                  className="bg-gy-bg-light dark:bg-gy-bg-dark"
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
                These groups will appear on this profile. If one is missing, contact the website developer.
                As an admin, you can also create a group using the + symbol.
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
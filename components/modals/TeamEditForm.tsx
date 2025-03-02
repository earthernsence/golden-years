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
import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/Textarea";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

// Does not check for whitespace
function isCleanString(u: string) {
  const hasSpecial = /[*|":<>.,[\]{}\\()';@&$]/u.test(u);
  const isAlphanumericWithSpaces = /^[\w\s]+$/u.test(u);

  if (hasSpecial) return false;
  return isAlphanumericWithSpaces;
}

const urlRegex =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/u;

export const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name of Team must be at least 2 characters."
  }).max(50, {
    message: "Name of Team cannot be more than 50 characters."
  }).refine(value => isCleanString(value), {
    message: "Only alphanumeric characters allowed. Spaces can be used."
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters."
  }).max(500, {
    message: "Description cannot be more than 500 characters."
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters."
  }).max(100, {
    message: "Location cannot be more than 100 characters."
  }),
  lead: z.string().min(2, {
    message: "Leader Username must be at least 2 characters"
  }).max(50, {
    message: "Leader Username cannot be more than 50 characters"
  }),
  link: z.string().min(2, {
    message: "Link must be at least 2 characters",
  }).max(50, {
    message: "Link cannot be more than 50 characters"
  }).refine(value => urlRegex.test(value), {
    message: "Link must be a URL"
  }),
  hasSlotCap: z.boolean().optional(),
  slots: z.string().refine(value => parseInt(value, 10)).refine(value => parseInt(value, 10) >= 2).optional(),
  image: z.instanceof(File).optional()
});

interface TeamEditFormProps {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  team: Doc<"teams">
}

export function TeamEditForm({
  onSubmit,
  team
}: TeamEditFormProps) {
  const teamLead = useQuery(api.users.getUserById, { id: team.lead });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: team.name,
      description: team.description,
      location: team.location,
      lead: teamLead?.username || "",
      link: team.link,
      hasSlotCap: team.slots !== Number.MAX_VALUE,
      slots: team.slots === Number.MAX_VALUE ? `${Math.max(2, team.members.length)}` : `${team.slots}`
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-center items-center align-middle h-full w-full space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="max-w-(--breakpoint-xs)">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name of Team" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                This is the name of the Team you are creating. It will be used to automatically
                create the Group associated with this Team as well.
              </FormDescription>
              <br />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="max-w-(--breakpoint-xs)">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description of Team" className="resize-none" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Information about this Team. Include the kind of volunteering that will take place here.
                Provide the website and location of the facility in those respective fields.
              </FormDescription>
              <br />
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
                <Input placeholder="Location of Team" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                This will appear alongside the Team on the Teams page. It should be the exact address, including
                street, city, and ZIP code.
              </FormDescription>
              <br />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lead"
          render={({ field }) => (
            <FormItem className="max-w-(--breakpoint-xs)">
              <FormLabel>Leader Username</FormLabel>
              <FormControl>
                <Input placeholder="Username of Team Leader" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Provide the Username of the Team Leader here. Make sure it is exact, as this will be used
                to retrieve the &quot;Team Leader&quot; information on the Team card. They will be automatically
                assigned to this team.
              </FormDescription>
              <br />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem className="max-w-(--breakpoint-xs)">
              <FormLabel>Link to Website</FormLabel>
              <FormControl>
                <Input placeholder="Facility Website URL" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Provide the URL of the website of the facility here. This is simply for the convenience of the
                volunteers if they wish to check the website.
              </FormDescription>
              <br />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          // eslint-disable-next-line no-unused-vars
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem className="max-w-(--breakpoint-xs)">
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  type="file"
                  accept="image/*"
                  onChange={e => onChange(e.target.files && e.target.files[0])}
                />
              </FormControl>
              <FormDescription className="text-xs">
                Choose an image for this Team. It will appear alongside the Team on the Teams page. If you do not
                select an image while editing, it will not change.
              </FormDescription>
              <br />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hasSlotCap"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>
                  Cap members?
                </FormLabel>
                <br />
                <FormDescription className="text-xs">
                  This determines whether or not there should be a limit on the number of members on this team.
                  If this is selected, choose a number of slots in the following field.
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
        {form.getValues("hasSlotCap") && (
          <FormField
            control={form.control}
            name="slots"
            render={({ field }) => (
              <FormItem className="max-w-(--breakpoint-xs)">
                <FormLabel>Slots</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Number of Slots" {...field} />
                </FormControl>
                <FormDescription className="text-xs">
                Choose the maximum number of people who can participate in this Team.
                </FormDescription>
                <br />
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button className="max-w-lg flex place-self-center" type="submit">Submit</Button>
      </form>
    </Form>
  );
}

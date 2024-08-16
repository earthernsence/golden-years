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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import { Input } from "@/components/ui/Input";
import Spinner from "@/components/Spinner";
import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/Textarea";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

export const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters."
  }).max(50, {
    message: "Title cannot be more than 50 characters."
  }),
  date: z.date(),
  endDate: z.date(),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters."
  }).max(500, {
    message: "Description cannot be more than 500 characters."
  }),
  image: z.instanceof(File).optional(),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters."
  }).max(100, {
    message: "Location cannot be more than 100 characters."
  }),
  slots: z.string().refine(value => parseInt(value, 10)).refine(value => parseInt(value, 10) > 0),
  team: z.string().optional(),
  exclusive: z.boolean().optional(),
});

interface CreateEventFormProps {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (values: z.infer<typeof formSchema>) => void;
}

export function CreateEventForm({
  onSubmit
}: CreateEventFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "New Event",
      date: new Date(),
      endDate: new Date(),
      description: "",
      location: "",
      slots: "2"
    }
  });

  const availableTeams = useQuery(api.teams.get);

  if (availableTeams === null) return <Spinner />;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-center items-center align-middle h-full w-full space-y-8"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="max-w-screen-xs">
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title of Event" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                This is a small, one-line name for the event. Preferably, save the details for either the
                description or the Location field.
              </FormDescription>
              <br />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="max-w-screen-xs flex flex-col">
              <FormLabel>Start Date and Time (U.S. Central Time GMT-5)</FormLabel>
              <FormControl>
                <DateTimePicker
                  granularity="minute"
                  jsDate={field.value}
                  onJsDateChange={field.onChange}
                />
              </FormControl>
              <FormDescription className="text-xs">
                Select a start time for this Event. Hours will be calculated based on this value and your
                provided end time below.
              </FormDescription>
              <br />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="max-w-screen-xs flex flex-col">
              <FormLabel>End Date and Time (U.S. Central Time GMT-5)</FormLabel>
              <FormControl>
                <DateTimePicker
                  granularity="minute"
                  jsDate={field.value}
                  onJsDateChange={field.onChange}
                />
              </FormControl>
              <FormDescription className="text-xs">
                Select an end time for this Event. Hours will be calculated based on this value and your
                provided start time above.
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
            <FormItem className="max-w-screen-xs">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Some basic information about the event" className="resize-none" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Information about the event. Include information like the type of volunteering that will be
                done. Information like date and location should be in those respective fields.
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
            <FormItem className="max-w-screen-xs">
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
                Choose an image for this event. It will appear alongside the event on the sign-up page.
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
            <FormItem className="max-w-screen-xs">
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Location of Event" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Provide the location of this Event. A full address is preferred, including street, city, and ZIP
                code.
              </FormDescription>
              <br />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slots"
          render={({ field }) => (
            <FormItem className="max-w-screen-xs">
              <FormLabel>Slots</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Number of Slots" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Choose the maximum number of people who can participate in this event.
              </FormDescription>
              <br />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="team"
          render={({ field }) => (
            <FormItem className="max-w-screen-xs">
              <FormLabel>Team</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team (Optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableTeams?.map((team: Doc<"teams">, index: number) => (
                    <SelectItem
                      value={team.teamId}
                      key={index}
                    >
                      {team.name}
                    </SelectItem>
                  ))}
                  <SelectItem value={"-1"}>No Team</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="text-xs">
                It is possible to assign certain Events to Teams. Events can either be Team-exclusive
                or available to all members of Golden Years. This is to ensure that members of Teams have access
                to as many Events at their preferred location as possible.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="exclusive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>
                  Team Exclusive
                </FormLabel>
                <br />
                <FormDescription className="text-xs">
                  Determines whether or not only Members of the Team you selected above can join, or if all
                  of Golden Years can join this event. This switch has no effect if you do not select a Team.
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
        <Button className="max-w-lg flex place-self-center" type="submit">Submit</Button>
      </form>
    </Form>
  );
}
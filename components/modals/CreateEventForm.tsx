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

import { DateTimePicker } from "../ui/DateTimePicker";

export const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters."
  }).max(50, {
    message: "Title cannot be more than 50 characters."
  }),
  date: z.date(),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters."
  }).max(500, {
    message: "Description cannot be more than 500 characters."
  }),
  image: z.instanceof(File).optional(),
  imageURL: z.any(),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters."
  }).max(100, {
    message: "Location cannot be more than 100 characters."
  }),
  slots: z.string().refine(value => parseInt(value, 10)),
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
      description: "",
      location: "",
      slots: "2"
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
              <FormLabel>Date</FormLabel>
              <FormControl>
                <DateTimePicker
                  granularity="minute"
                  jsDate={field.value}
                  onJsDateChange={field.onChange}
                />
              </FormControl>
              <FormDescription className="text-xs">
                Select a date for the event.
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
                Give the location of the event.
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
        <Button className="max-w-lg flex place-self-center" type="submit">Submit</Button>
      </form>
    </Form>
  );
}
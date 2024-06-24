"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
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
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

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
  removeImage: z.boolean().optional(),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters."
  }).max(100, {
    message: "Location cannot be more than 100 characters."
  }),
  slots: z.string().refine(value => parseInt(value, 10)),
});

interface Event {
  eventId: string,
  title: string,
  date: number,
  description: string,
  image?: string,
  location: string,
  slots: number,
  participants: Array<string>,
  organiser: string,
}

interface EditEventFormProps {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  event: Event
}

export function EditEventForm({
  onSubmit,
  event
}: EditEventFormProps) {
  const [checked, setChecked] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: event.title,
      date: new Date(event.date),
      description: event.description,
      location: event.location,
      slots: `${event.slots}`,
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
              <FormLabel>Date and Time (U.S. Central Time GMT-5)</FormLabel>
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
                Choose an image for this event. It will appear alongside the event on the sign-up page. If you have
                already selected an image for this event, it will still appear if you do not upload one here.
              </FormDescription>
              <br />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="removeImage"
          // eslint-disable-next-line no-unused-vars
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem className="max-w-screen-xs">
              <FormLabel>Remove image</FormLabel>
              <FormControl>
                <Input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={checked}
                  onChange={e => {
                    setChecked(e.target.checked);
                    onChange(e.target.checked);
                  }}
                  {...fieldProps}
                />
              </FormControl>
              <FormDescription className="text-xs">
                There isn&apos;t really a nice way of doing this code-wise, so use this checkbox if you would like
                to remove the image from the event. This takes precedent over any other previous options, so leave it
                unchecked if you wish to keep the picture or change it to whatever you chose above.
              </FormDescription>
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
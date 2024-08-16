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

function isStrictCleanString(u: string) {
  const hasWhitespace = /\s/u.test(u);
  const hasSpecial = /[*|":<>.,[\]{}\\()';@&$]/u.test(u);
  const isAlphanumeric = /^[a-zA-Z0-9-_]{2,}$/u.test(u);

  if (hasWhitespace || hasSpecial) return false;
  return isAlphanumeric;
}

export const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }).refine(value => isStrictCleanString(value), {
    message: "Only alphanumeric characters allowed."
  })
});

interface AddEventParticipantFormProps {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (values: z.infer<typeof formSchema>) => void;
}

export function AddEventParticipantForm({
  onSubmit
}: AddEventParticipantFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: ""
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
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Type any user&apos;s username here to add them to this event.
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
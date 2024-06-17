"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { formSchema } from "./OnboardingForm";
import { z } from "zod";

// We have to update some general metadata here when our users complete the onboarding process.
// This way, all of the user's data is still associated with the account before the changes are made
// in the actual database.
export const completeOnboarding = async(values: z.infer<typeof formSchema>) => {
  const { userId } = auth();

  if (!userId) {
    return { message: "No Logged In User" };
  }

  try {
    const res = await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        name: values.name.trim(),
        username: values.username.trim(),
        email: values.email.trim(),
        signupTime: Date.now(),
        admin: false,
        bio: values.bio?.trim() || "",
        location: values.location?.trim() || "",
        groups: values.groups.map(group => group.value)
      },
    });
    return { message: res.publicMetadata };
  } catch (err) {
    return { error: "There was an error updating the user metadata." };
  }
};
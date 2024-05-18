"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { formSchema } from "./OnboardingForm";
import { z } from "zod";

export const completeOnboarding = async(values: z.infer<typeof formSchema>) => {
  const { userId } = auth();

  if (!userId) {
    return { message: "No Logged In User" };
  }

  try {
    const res = await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        name: values.name,
        username: values.username,
        signupTime: Date.now(),
        admin: false,
        bio: values.bio || "",
        location: values.location || "",
      },
    });
    return { message: res.publicMetadata };
  } catch (err) {
    return { error: "There was an error updating the user metadata." };
  }
};
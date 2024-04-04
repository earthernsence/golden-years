"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export const completeOnboarding = async(formData: FormData) => {
  const { userId } = auth();

  if (!userId) {
    return { message: "No Logged In User" };
  }

  try {
    const res = await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        name: formData.get("name")?.toString() || "",
        username: formData.get("username")?.toString() || "",
        signupTime: new Date().toLocaleString(),
        admin: false,
        bio: formData.get("bio")?.toString() || "",
        location: formData.get("location")?.toString() || "",
      },
    });
    return { message: res.publicMetadata };
  } catch (err) {
    return { error: "There was an error updating the user metadata." };
  }
};
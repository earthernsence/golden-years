"use client";

import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { z } from "zod";

import { api } from "@/convex/_generated/api";
import { completeOnboarding } from "./_actions";

import { formSchema, OnboardingForm } from "./OnboardingForm";

export default function OnboardingPage() {
  const [error, setError] = useState("");
  const { user } = useUser();
  const router = useRouter();
  const create = useMutation(api.users.create);
  const usernames = useQuery(api.users.usernames);

  const onSubmit = async(values: z.infer<typeof formSchema>) => {
    if (usernames?.includes(values.username)) {
      setError("That username is taken!");
      return;
    }

    const res = await completeOnboarding(values);

    if (res?.message) {
      await user?.reload();
      router.push("/");

      if (!user) return;

      create({
        userId: user.id,
        name: user.publicMetadata.name,
        email: user.publicMetadata.email,
        username: user.publicMetadata.username,
        signupTime: Date.now(),
        admin: false,
        image: user.imageUrl,
        bio: user.publicMetadata.bio,
        location: user.publicMetadata.location
      });
    }

    if (res?.error) {
      setError(res?.error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center align-middle">
      <div className="text-2xl text-center">one last thing...</div>
      <OnboardingForm onSubmit={onSubmit} />
      <div className="text-red-500">{ error }</div>
    </div>
  );
}
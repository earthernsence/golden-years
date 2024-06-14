"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

import { api } from "@/convex/_generated/api";
import { completeOnboarding } from "./_actions";

import { formSchema, OnboardingForm } from "./OnboardingForm";

export default function OnboardingPage() {
  const [error, setError] = useState("");
  const { user } = useUser();
  const { userId } = useAuth();
  const router = useRouter();
  const create = useMutation(api.users.create);
  const usernames = useQuery(api.users.usernames);

  const dbUser = useQuery(api.users.getUserById, { id: `${userId}` });

  const onSubmit = async(values: z.infer<typeof formSchema>) => {
    if (usernames?.includes(values.username)) {
      setError("That username is taken!");
      return;
    }

    if (!values.terms) {
      setError("You must accept the Terms of Services and the Privacy Policy to register for an account.");
      return;
    }

    const res = await completeOnboarding(values);

    if (res?.message) {
      await user?.reload();
      router.push("/");

      if (!user) return;

      if (dbUser) return;

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
    <div className="flex flex-col justify-center items-center align-middle h-auto">
      <div className="text-2xl text-center">one last thing...</div>
      <div className="text-red-500">{ error }</div>
      <OnboardingForm onSubmit={onSubmit} />
    </div>
  );
}
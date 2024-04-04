"use client";


import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

import { api } from "@/convex/_generated/api";
import { completeOnboarding } from "./_actions";
import { useMutation } from "convex/react";

export default function OnboardingPage() {
  const [error, setError] = useState("");
  const { user } = useUser();
  const router = useRouter();
  const create = useMutation(api.users.create);

  const handleSubmit = async(formData: FormData) => {
    const res = await completeOnboarding(formData);

    if (res?.message) {
      await user?.reload();
      router.push("/");

      if (!user) return;

      create({
        userId: user.id,
        name: `${user.fullName}`,
        username: user.publicMetadata.username,
        signupTime: new Date().toLocaleString(),
        admin: false,
        bio: user.publicMetadata.bio,
        location: user.publicMetadata.location,
      });
    }
    if (res?.error) {
      setError(res?.error);
    }
  };

  return (
    <div>
      <div className="text-xl">Let&apos;s finish setting up your account</div>
      <form action={handleSubmit}>
        <div>
          <label>Your name</label>
          <p>This name will be what&apos;s displayed on the site</p>
          <input type="text" name="name" required />
        </div>
        <div>
          <label>Username</label>
          <p>This is not displayed anywhere, but is used to link to your account</p>
          <input type="text" name="username" required />
        </div>
        <div>
          <label>Biography</label>
          <p>Add an optional biography to be displayed on your profile</p>
          <input type="text" name="bio" />
        </div>
        <div>
          <label>Location</label>
          <p>Your location, displayed on your profile</p>
          <input type="text" name="location" />
        </div>
        {error && <p className="text-red-600">Error: {error}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function OnboardingLayout({
  children
}: {
  children: React.ReactNode
}) {
  if (auth().sessionClaims?.metadata.onboardingComplete) {
    redirect("/");
  }

  return <>{children}</>;
}
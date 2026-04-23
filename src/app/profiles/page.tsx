import { redirect } from "next/navigation";
import { isAuthenticated } from "@/features/auth/simple-auth";
import { ProfileSelectionClient } from "@/features/profile/profile-selection-client";
import { getProfiles } from "@/features/profile/profile-service";

export default async function ProfileSelectionPage() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/");
  }

  const profiles = await getProfiles();

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-10 md:px-10">
      <ProfileSelectionClient profiles={profiles} />
    </main>
  );
}

import { redirect } from "next/navigation";
import { isAuthenticated } from "@/features/auth/simple-auth";
import { ProfileEditorClient } from "@/features/profile/profile-editor-client";
import { profiles } from "@/features/profile/profile-data";

export default async function ProfileEditPage() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/");
  }

  return <ProfileEditorClient baseProfiles={profiles} />;
}

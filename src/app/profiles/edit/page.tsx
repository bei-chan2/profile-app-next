import { redirect } from "next/navigation";
import { isAuthenticated } from "@/features/auth/simple-auth";
import { ProfileEditorClient } from "@/features/profile/profile-editor-client";

export default async function ProfileEditPage() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/");
  }

  return <ProfileEditorClient />;
}

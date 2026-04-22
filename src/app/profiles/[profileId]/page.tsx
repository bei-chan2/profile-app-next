import { redirect } from "next/navigation";
import { isAuthenticated } from "@/features/auth/simple-auth";
import { ProfileDetailView } from "@/features/profile/profile-detail-view";
import { profiles } from "@/features/profile/profile-data";

type ProfileDetailPageProps = {
  params: Promise<{
    profileId: string;
  }>;
};

export default async function ProfileDetailPage({ params }: ProfileDetailPageProps) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/");
  }

  const { profileId } = await params;
  return <ProfileDetailView profileId={profileId} baseProfiles={profiles} />;
}

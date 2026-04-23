import { notFound, redirect } from "next/navigation";
import { isAuthenticated } from "@/features/auth/simple-auth";
import { ProfileDetailView } from "@/features/profile/profile-detail-view";
import { getProfile } from "@/features/profile/profile-service";

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
  const profile = await getProfile(profileId);
  if (!profile) {
    notFound();
  }

  return <ProfileDetailView profile={profile} />;
}

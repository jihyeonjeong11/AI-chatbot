import { Profile } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import Image from "next/image";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserProfileLoader } from "./page";
import { getProfileImageUrl } from "@/use-cases/users";
import { ConfigurationPanel } from "@/components/configuration-panel";
import { ProfileImageForm } from "./profile-image-form";

export function getProfileImageFullUrl(profile: Profile) {
  return profile.imageId
    ? getProfileImageUrl(profile.userId, profile.imageId)
    : profile.image
    ? profile.image
    : "/profile.png";
}

export async function ProfileImage() {
  return (
    <ConfigurationPanel title="Profile Image">
      <Suspense fallback={<Skeleton className="w-full h-[200px] rounded" />}>
        <ProfileImageContent />
      </Suspense>
    </ConfigurationPanel>
  );
}

async function ProfileImageContent() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const profile = await getUserProfileLoader(user.id);

  return (
    <div className="flex flex-col sm:items-center">
      <Image
        src={getProfileImageFullUrl(profile)}
        width={200}
        height={200}
        className="h-[200px] sm:h-[100px] w-full object-cover rounded-xl mb-4 sm:mb-6"
        alt="Profile image"
      />
      <ProfileImageForm />
    </div>
  );
}

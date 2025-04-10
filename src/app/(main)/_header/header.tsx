import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/session";
import { Suspense } from "react";
import { HeaderActionsFallback } from "./header-actions-fallback";
import { getUserProfileUseCase } from "@/use-cases/users";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings2Icon } from "lucide-react";
import { SignOutItem } from "./sign-out-item";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { HeaderLinks } from "./header-links";
import { History } from "../(landing)/_sections/history";

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <div className="px-5 md:px-6">
      <div className="mx-auto flex w-full max-w-7xl py-4 justify-between">
        <div className="flex justify-between gap-10 items-center">
          {user && <History user={user} />}
          <Link href="/" className="flex items-center justify-center gap-2">
            <span className="text-sm md:text-base lg:text-2xl font-bold">
              Gemini Chatbot
            </span>
          </Link>
          <HeaderLinks isAuthenticated={!!user} />
        </div>
        <div className="flex items-center justify-between gap-5">
          <Suspense fallback={<HeaderActionsFallback />}>
            <HeaderActions />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function HeaderActions() {
  const user = await getCurrentUser();
  const isSignedIn = !!user;
  return (
    <>
      {isSignedIn ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Suspense
                fallback={
                  <div className="bg-gray-800 rounded-full h-10 w-10 shrink-0 flex items-center justify-center">
                    ..
                  </div>
                }
              >
                <ProfileAvatar userId={user.id} />
              </Suspense>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="space-y-2">
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/settings"
                  className="flex gap-2 items-center cursor-pointer"
                >
                  <Settings2Icon className="w-4 h-4" /> Settings
                </Link>
              </DropdownMenuItem>
              <SignOutItem />
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <>
          <Button data-testid={"sign-in-button"} asChild variant="secondary">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </>
      )}
    </>
  );
}

async function ProfileAvatar({ userId }: { userId: number }) {
  const profile = await getUserProfileUseCase(userId);

  return (
    <Avatar>
      <AvatarFallback>
        {profile.displayName?.substring(0, 2).toUpperCase() ?? "AA"}
      </AvatarFallback>
    </Avatar>
  );
}

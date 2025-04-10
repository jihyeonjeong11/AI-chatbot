"use client";

import { Button } from "@/components/ui/button";
import { pageTitleStyles } from "@/styles/common";
import Link from "next/link";
import { AUTHENTICATION_ERROR_MESSAGE } from "./utils";

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const isAuthenticationError = error.message.includes(
    AUTHENTICATION_ERROR_MESSAGE
  );

  return (
    <div className="container mx-auto py-12 min-h-screen space-y-8">
      {isAuthenticationError ? (
        <>
          <h1 className={pageTitleStyles}>Oops! You Need to Be Logged In</h1>
          <p className="text-lg">To access this page, please log in first.</p>

          <Button asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </>
      ) : (
        <>
          <h1 className={pageTitleStyles}>Oops! Something went wrong</h1>
          <p className="text-lg">{error.message}</p>
        </>
      )}
    </div>
  );
}

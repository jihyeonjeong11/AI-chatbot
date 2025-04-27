import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import NextTopLoader from "nextjs-toploader";
import { BreakpointOverlay } from "@/components/breakpoint-overlay";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/providers/providers";
import PostHogPageView from "@/components/posthog-page-view";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Gemini Chatbot",
//   description: "Gemini chatbot powered by Google and Vercel ai sdk",
//   keywords: "Gemini, chatbot, Google, Vercel, ai, sdk",
//   authors: [{ name: "JIHYEON JEONG", url: "https://jihyeonjeong.com" }],
//   creator: "JIHYEON JEONG",
//   icons: {
//     icon: "/favicon.ico",
//   },

//   //openGraph:
// };

export const metadata: Metadata = {
  title: "Gemini Chatbot",
  description: "Gemini chatbot powered by Google and Vercel ai sdk",
  keywords: "Gemini, chatbot, Google, Vercel, ai, sdk",
  authors: [{ name: "JIHYEON JEONG", url: "https://jihyeonjeong.com" }],
  creator: "JIHYEON JEONG",
  icons: {
    icon: "/favicon.ico",
  },
  themeColor: "hsl(222.2 47.4% 11.2%)",
  openGraph: {
    url: "https://ai-gemini-chatbot-pearl.vercel.app/",
    title: "Gemini Chatbot",
    type: "website",
    locale: "en_US",
    description: "Gemini chatbot powered by Google and Vercel ai sdk",
    images: [
      // need this.
      {
        url: "/public/AIBuilds.jpg",
        type: "image/png",
        width: 1920,
        height: 1080,
        alt: "Two AI Bot building walls.",
      },
    ],
    siteName: "Gemini Chatbot",
  },
  twitter: {
    card: "summary",
    creator: "JIHYEONJEONG",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Suspense>
            <PostHogPageView />
          </Suspense>
          <NextTopLoader />
          <div>{children}</div>
        </Providers>
        <Toaster />
        <BreakpointOverlay />
      </body>
    </html>
  );
}

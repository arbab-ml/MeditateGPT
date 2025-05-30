/*
<ai_context>
The root server layout for the app.
</ai_context>
*/

import {
  createProfileAction,
  getProfileByUserIdAction
} from "@/actions/db/profiles-actions"
import { Nav } from "@/components/ui/nav"
import { PostHogPageview } from "@/components/utilities/posthog/posthog-pageview"
import { PostHogUserIdentify } from "@/components/utilities/posthog/posthog-user-identity"
import { Providers } from "@/components/utilities/providers"
import { TailwindIndicator } from "@/components/utilities/tailwind-indicator"
import { cn } from "@/lib/utils"
import { ClerkProvider } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MeditateGPT - AI-Powered Meditation Guide",
  description:
    "Experience personalized meditation sessions generated by AI based on your emotional state. MeditateGPT creates custom scripts and calming audio meditations tailored just for you."
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (userId) {
    const profileRes = await getProfileByUserIdAction(userId)
    if (!profileRes.isSuccess) {
      await createProfileAction({ userId })
    }
  }

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className="light">
        <head>
          <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        </head>
        <body
          className={cn(
            "bg-background min-h-screen font-sans antialiased",
            inter.className
          )}
        >
          <Providers
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <PostHogUserIdentify />
            <PostHogPageview />

            <Nav />

            <main className="flex min-h-screen flex-col">{children}</main>

            <TailwindIndicator />

            <Toaster />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}

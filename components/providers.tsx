'use client'

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'

/**
 * Initializes the PostHog client on mount and provides it to descendant components.
 *
 * @param children - React nodes to be wrapped by the PostHog provider
 * @returns A React element that supplies the PostHog client to its children
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_exceptions: true,
      debug: process.env.NODE_ENV === 'development',
    })
  }, [])

  return (
    <PHProvider client={posthog}>
      {children}
    </PHProvider>
  )
}
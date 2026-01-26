import posthog from 'posthog-js';

// PostHog initialization is handled by PostHogProvider in components/providers.tsx
// This file is kept for potential future instrumentation needs
// Only initialize if not already initialized by the provider
if (typeof window !== 'undefined' && !posthog.__loaded) {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

  if (key && key.trim() !== '') {
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_exceptions: true,
      debug: process.env.NODE_ENV === 'development',
    });
  }
}
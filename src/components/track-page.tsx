"use client";

// Ref: https://github.com/spliit-app/spliit-web/blob/main/src/components/track-page.tsx

import { usePlausible } from "next-plausible";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

type Event = { event: "pageview"; props: {} };

type Props = {
  path: string;
};

export function TrackPageWithPlausible(props: Props) {
  return (
    <Suspense>
      <TrackPage {...props} />
    </Suspense>
  );
}

function TrackPage({ path }: Props) {
  const sendEvent = useAnalytics();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  useEffect(() => {
    sendEvent(
      { event: "pageview", props: {} },
      `${path}${ref ? `?ref=${ref}` : ""}`
    );
  }, [path, ref, sendEvent]);

  return null;
}

function useAnalytics() {
  const plausible = usePlausible();

  const sendEvent = ({ event, props }: Event, path = "/") => {
    const url = `${window.location.origin}${path}`;
    if (process.env.NODE_ENV !== "production")
      console.log("Analytics event:", event, props, url);
    plausible(event, { props, u: url });
  };

  return sendEvent;
}

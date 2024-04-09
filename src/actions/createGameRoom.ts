"use server";

import { PARTYKIT_URL } from "@/lib/env";
import { redirect } from "next/navigation";

const randomId = () => Math.random().toString(36).substring(2, 15);

export async function createGameRoom() {
  const id = randomId();

  await fetch(`${PARTYKIT_URL}/parties/main/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  redirect(`/play/${id}`);
}

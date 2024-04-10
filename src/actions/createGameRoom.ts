"use server";

import { PARTYKIT_URL } from "@/lib/env";
import { redirect } from "next/navigation";
import { nanoid } from "nanoid";
import { createGameSchema } from "@/app/_components/createGameSchema";

// Inspired from: https://github.com/ProNextJS/forms-management-yt/blob/main/forms-mgmt-finished/src/app/formSubmit.ts
export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function createGameRoom(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = createGameSchema.safeParse(formData);

  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(formData)) {
      fields[key] = formData[key].toString();
    }
    return {
      message: "Invalid form data",
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
    };
  }

  const id = nanoid(10);

  await fetch(`${PARTYKIT_URL}/parties/main/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parsed.data),
  });

  redirect(`/play/${id}`);
}

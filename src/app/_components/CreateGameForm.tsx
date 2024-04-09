"use client";

import { createGameRoom } from "@/actions/createGameRoom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, Play } from "lucide-react";
import { useFormStatus } from "react-dom";

function CreateGameButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      aria-disabled={pending}
      className={cn(
        "bg-green-500 hover:bg-green-500/90",
        pending && "opacity-50"
      )}
    >
      {!pending && (
        <div className="flex items-center">
          <Play size={22} className="mr-2" /> Play Now
        </div>
      )}
      {pending && (
        <div className="flex items-center">
          <Loader2 size={22} className="mr-2 animate-spin" /> Creating game...
        </div>
      )}
    </Button>
  );
}

export function CreateGameForm() {
  return (
    <form action={createGameRoom}>
      <CreateGameButton />
    </form>
  );
}

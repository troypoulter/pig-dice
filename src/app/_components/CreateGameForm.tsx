"use client";

import { createGameRoom } from "@/actions/createGameRoom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
        "w-full bg-green-500 hover:bg-green-500/90",
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
    <Card className="w-[560px]">
      <CardHeader className="items-center">
        <CardTitle>Create Game</CardTitle>
        <CardDescription>
          Quickly customise the game to your liking - then dive into the dice
          duel!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={createGameRoom}>
          <CreateGameButton />
        </form>
      </CardContent>
    </Card>
  );
}

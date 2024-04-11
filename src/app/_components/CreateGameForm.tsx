"use client";

import { createGameRoom } from "@/actions/createGameRoom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Dices, Loader2, PiggyBank, Play, X } from "lucide-react";
import { useFormState, useFormStatus } from "react-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createGameSchema } from "./createGameSchema";
import { useRef } from "react";
import { Separator } from "@/components/ui/separator";

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
  const [state, formAction] = useFormState(createGameRoom, {
    message: "",
  });
  const form = useForm<z.output<typeof createGameSchema>>({
    resolver: zodResolver(createGameSchema),
    defaultValues: {
      numberOfPlayers: 2,
      targetScore: 100,
      ...(state?.fields ?? {}),
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Card className="w-[560px]">
      <CardHeader className="items-center pb-4">
        <div className="flex flex-row gap-x-1 items-baseline">
          <Dices size={30} />
          <X size={22} />
          <PiggyBank size={30} />
        </div>
        <CardTitle>Create Game</CardTitle>
        <CardDescription>
          Quickly customise the game to your liking - then dive into the dice
          duel!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Separator className="mb-4" />
        <Form {...form}>
          {state?.message !== "" && !state.issues && (
            <div className="text-red-500">{state.message}</div>
          )}
          {state?.issues && (
            <div className="text-red-500">
              <ul>
                {state.issues.map((issue) => (
                  <li key={issue} className="flex gap-1">
                    <X fill="red" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <form
            ref={formRef}
            className="space-y-4"
            action={formAction}
            // Removing client-side validation until can work out how
            // to show pending state when submitting the server action.
            // onSubmit={(evt) => {
            //   evt.preventDefault();
            //   form.handleSubmit(() => {
            //     formAction(new FormData(formRef.current!));
            //   })(evt);
            // }}
          >
            <FormField
              control={form.control}
              name="numberOfPlayers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Players (2-6)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Score</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <CreateGameButton />
          </form>
        </Form>
        {/* <form action={createGameRoom}>
        </form> */}
      </CardContent>
    </Card>
  );
}

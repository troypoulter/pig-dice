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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface CreateGameFormProps {
  gamesPlayed: number;
}

export function CreateGameForm({ gamesPlayed }: CreateGameFormProps) {
  const [state, formAction] = useFormState(createGameRoom, {
    message: "",
  });
  const form = useForm<z.output<typeof createGameSchema>>({
    resolver: zodResolver(createGameSchema),
    defaultValues: {
      numberOfPlayers: 2,
      targetScore: 100,
      isBotGame: "true",
      ...(state?.fields ?? {}),
    },
  });

  const isBotGame = form.watch("isBotGame");

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Card className="w-[560px]">
      <CardHeader className="items-center pb-0">
        <div className="flex flex-row gap-x-1 items-baseline">
          <Dices size={30} />
          <X size={22} />
          <PiggyBank size={30} />
        </div>
        <CardTitle>Create Game</CardTitle>
        {/* <CardDescription>
          Quickly customise the game to your liking - then dive into the dice
          duel!
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        {/* <Separator className="mb-4" /> */}
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
              name="isBotGame"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Choose your opponent</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="true" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Challenge Mr. PiggleWiggle (Computer)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="false" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Play with friends online
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                  <input type="hidden" name={field.name} value={field.value} />
                </FormItem>
              )}
            />
            {isBotGame === "false" && (
              // <FormField
              //   control={form.control}
              //   name="numberOfPlayers"
              //   render={({ field }) => (
              //     <FormItem>
              //       <FormLabel>Number of Players (2-6)</FormLabel>
              //       <FormControl>
              //         <Input {...field} />
              //       </FormControl>
              //       <FormMessage />
              //     </FormItem>
              //   )}
              // />
              <FormField
                control={form.control}
                name="numberOfPlayers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Players</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      defaultValue={String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select number of players (2-6)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[2, 3, 4, 5, 6].map((number) => (
                          <SelectItem key={number} value={String(number)}>
                            {number} Players
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    <input
                      type="hidden"
                      name={field.name}
                      value={field.value}
                    />
                  </FormItem>
                )}
              />
            )}
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
            <div className="text-sm text-muted-foreground text-center">
              {gamesPlayed ? gamesPlayed.toLocaleString() : 0} games played so
              far!
            </div>
          </form>
        </Form>
        {/* <form action={createGameRoom}>
        </form> */}
      </CardContent>
    </Card>
  );
}

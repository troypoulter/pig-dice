import { Dices, Target, Trophy } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";

export function Instructions() {
  return (
    <div className="flex flex-col text-wrap items-center gap-4">
      <h3 className="text-4xl font-semibold text-center">
        How to play in three steps
      </h3>
      <Alert className="max-w-[600px]">
        <Target className="h-4 w-4" />
        <AlertTitle>Step 1: Set a target</AlertTitle>
        <AlertDescription>
          Choose a target score to reach, usually 100 points, then start the
          game!
        </AlertDescription>
      </Alert>
      <Alert className="max-w-[600px]">
        <Dices className="h-4 w-4" />
        <AlertTitle>Step 2: Time to roll</AlertTitle>
        <AlertDescription>
          <ul className="ml-3 list-disc [&>li]:mt-2">
            <li>Take turns rolling the dice.</li>
            <li>Keep rolling to add more points to your score for the turn.</li>
            <li>
              Stop rolling whenever you feel like it and add the points you
              rolled to your total score.
            </li>
            <li>
              But watch out! If you roll a 1, your turn ends and you score zero
              for that turn.
            </li>
          </ul>
        </AlertDescription>
      </Alert>
      <Alert className="max-w-[600px]">
        <Trophy className="h-4 w-4" />
        <AlertTitle>Step 3: Race to the finish!</AlertTitle>
        <AlertDescription className="space-y-2">
          Play continues until someone hits the target score first. Have fun and
          good luck!
        </AlertDescription>
      </Alert>
    </div>
  );
}

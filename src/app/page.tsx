"use server";

import {
  PageHeader,
  PageHeaderHeading,
  PageHeaderDescription,
  PageActions,
} from "@/components/page-header";
import { CreateGameForm } from "./_components/CreateGameForm";

export default async function Home() {
  return (
    <div>
      <PageHeader>
        <PageHeaderHeading>Pig: The Ultimate Dice Duel</PageHeaderHeading>
        <PageHeaderDescription>
          Risk it all or play it safe in a game of strategy and luck - where
          every roll can lead to victory or defeat!
        </PageHeaderDescription>
        <PageActions>
          <CreateGameForm />
        </PageActions>
      </PageHeader>
    </div>
  );
}

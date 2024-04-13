import { createGameSchema } from "@/app/_components/createGameSchema";
import { db } from "@/lib/db";
import { rooms } from "@/lib/db/schema";
import { GameState } from "@/lib/types/GameState";
import { eq, sql } from "drizzle-orm";
import type * as Party from "partykit/server";

export default class PigGameServer implements Party.Server {
  constructor(readonly room: Party.Room) {}

  async onError(connection: Party.Connection, error: Error) {}

  async onConnect(connection: Party.Connection) {
    let gameState = await this.room.storage.get<GameState>("gameState");
    if (
      !gameState ||
      Object.keys(gameState.players).length >= gameState.maxPlayers
    ) {
      await connection.send(JSON.stringify({ message: "Game is full" }));
      connection.close();
      return;
    }

    // Increment this each time a new player connects, so if
    // someone joins after another person leaves, it keeps increasing the number.
    gameState.totalJoinedPlayers += 1;

    gameState.players[connection.id] = {
      // Trying out generating a unique fun name instead of named player.
      // Keeping this here for easy reference later.
      // name: `Player ${gameState.totalJoinedPlayers}`,
      name: generateFunName(),
      wins: 0,
      totalScore: 0,
      currentScore: 0,
    };

    gameState.playerOrder.push(connection.id);

    if (Object.keys(gameState.players).length === 1) {
      gameState.currentPlayerId = connection.id;
      console.log(`First player connected: ${connection.id}`);
    }

    await this.room.storage.put("gameState", gameState); // Persist game state changes

    this.room.broadcast(
      JSON.stringify({ message: "Game has started!", gameState })
    );

    connection.send(
      JSON.stringify({
        message: "Connected players id",
        gameState,
        connectedPlayerId: connection.id,
      })
    );
  }

  async onClose(connection: Party.Connection) {
    let gameState = await this.room.storage.get<GameState>("gameState");
    if (!gameState) return; // Exit if game state is not found

    // Check if the disconnecting player is part of the game
    if (gameState.players[connection.id]) {
      console.log(`Player has disconnected: ${connection.id}`);
      delete gameState.players[connection.id]; // Remove the player from the game state

      // Remove the player from the order array if it exists and update currentPlayerIndex
      if (gameState.playerOrder) {
        const indexToRemove = gameState.playerOrder.indexOf(connection.id);
        gameState.playerOrder = gameState.playerOrder.filter(
          (id) => id !== connection.id
        );

        // Adjust the currentPlayerIndex if necessary
        if (indexToRemove > -1) {
          if (gameState.currentPlayerIndex > indexToRemove) {
            gameState.currentPlayerIndex -= 1;
          } else if (gameState.currentPlayerIndex === indexToRemove) {
            // If the disconnecting player was the current player, adjust the index and switch player
            gameState.currentPlayerIndex %= gameState.playerOrder.length;
            this.switchPlayer(gameState);
          }
        }
      }

      if (Object.keys(gameState.players).length <= 1) {
        // If there are no more players, the game is over
        console.log("only one player left, select the winner!");
        gameState.hasGameStarted = false;
        if (gameState.winnerId === undefined) {
          gameState.winnerId = Object.keys(gameState.players)[0]; // Automatically declare the remaining player as the winner
        }
      }

      await this.room.storage.put("gameState", gameState); // Persist the updated game state

      // Notify remaining players about the update
      this.room.broadcast(
        JSON.stringify({ message: "Player left the game", gameState })
      );
    }
  }

  async onRequest(req: Party.Request) {
    if (req.method === "POST") {
      const body = await req.json();
      const newGame = createGameSchema.safeParse(body);

      if (!newGame.success) {
        console.log(
          "Invalid request - Game creation failed",
          newGame.error.message
        );
        return new Response(
          `Invalid request - Game creation failed: ${newGame.error.message}`,
          {
            status: 400,
          }
        );
      }

      let gameState = await this.room.storage.get<GameState>("gameState");
      if (!gameState) {
        gameState = {
          hasGameStarted: false,
          targetAmount: newGame.data.targetScore,
          maxPlayers: newGame.data.numberOfPlayers,
          gamesPlayed: 0,
          totalJoinedPlayers: 0,
          players: {},
          playerOrder: [],
          currentPlayerIndex: 0,
          currentPlayerId: "",
          lastRoll: undefined,
          winnerId: undefined,
        }; // Initialize the game state
        console.log("New game room created");
        await this.room.storage.put("gameState", gameState); // Persist the new game state

        await db
          .insert(rooms)
          .values({
            roomId: this.room.id,
            maxPlayers: gameState.maxPlayers,
            targetScore: gameState.targetAmount,
          })
          .onConflictDoNothing();

        return new Response("New game room created.", { status: 200 });
      } else {
        console.log("Game is already in progress.");
        return new Response(JSON.stringify(gameState), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    const gameState = await this.room.storage.get<GameState>("gameState");
    if (gameState) {
      console.log("Returning current game state.");
      return new Response(JSON.stringify(gameState), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Invalid request - No current game state available.");
    return new Response("Invalid request - No current game state available.", {
      status: 400,
    });
  }

  async onMessage(message: string, sender: Party.Connection) {
    let gameState = await this.room.storage.get<GameState>("gameState");
    if (!gameState) return; // Exit if game state is not found

    const event = JSON.parse(message);

    if (event.type === "start") {
      if (gameState.hasGameStarted) return; // Exit if the game is already started
      gameState.hasGameStarted = true;
      gameState.gamesPlayed += 1;

      await this.incrementRoomGamesPlayed(this.room.id);
      await this.room.storage.put("gameState", gameState); // Persist game state changes

      this.room.broadcast(
        JSON.stringify({ message: "Game has started!", gameState })
      );
    }

    if (event.type === "roll" && sender.id === gameState.currentPlayerId) {
      if (gameState.winnerId) return; // Exit if the game is already over.

      const roll = Math.floor(Math.random() * 6) + 1;
      gameState.lastRoll = roll;
      if (roll === 1) {
        gameState.players[gameState.currentPlayerId].currentScore = 0;
        this.switchPlayer(gameState);
      } else {
        gameState.players[gameState.currentPlayerId].currentScore += roll;

        if (
          gameState.players[gameState.currentPlayerId].currentScore +
            gameState.players[gameState.currentPlayerId].totalScore >=
          gameState.targetAmount
        ) {
          gameState.winnerId = gameState.currentPlayerId;
          gameState.players[gameState.currentPlayerId].wins += 1;
        }
      }

      await this.room.storage.put("gameState", gameState); // Persist game state changes
      this.room.broadcast(JSON.stringify({ message: "Turn done!", gameState }));
    }

    if (event.type === "hold" && sender.id === gameState.currentPlayerId) {
      if (gameState.winnerId) return; // Exit if the game is already over.

      gameState.players[gameState.currentPlayerId].totalScore +=
        gameState.players[gameState.currentPlayerId].currentScore;
      gameState.players[gameState.currentPlayerId].currentScore = 0;

      if (
        gameState.players[gameState.currentPlayerId].totalScore >=
        gameState.targetAmount
      ) {
        gameState.winnerId = gameState.currentPlayerId;
        gameState.players[gameState.currentPlayerId].wins += 1;
      } else {
        this.switchPlayer(gameState);
      }

      await this.room.storage.put("gameState", gameState); // Persist game state changes
      this.room.broadcast(
        JSON.stringify({ message: "Turn done - hold!", gameState })
      );
    }

    if (event.type == "restart") {
      if (!gameState.winnerId) return; // No winner yet.

      // Reset the game state for a new round, with the winner starting
      Object.keys(gameState.players).forEach((playerId) => {
        gameState.players[playerId].totalScore = 0;
        gameState.players[playerId].currentScore = 0;
      });
      gameState.currentPlayerId = gameState.winnerId;
      gameState.winnerId = undefined; // Reset the winner
      gameState.lastRoll = undefined; // Reset the last roll
      gameState.gamesPlayed += 1;

      await this.incrementRoomGamesPlayed(this.room.id);
      await this.room.storage.put("gameState", gameState); // Persist the reset game state

      this.room.broadcast(
        JSON.stringify({ message: "Game restarted", gameState })
      );
    }
  }

  private async switchPlayer(gameState: GameState) {
    // Increment the current player index.
    gameState.currentPlayerIndex =
      (gameState.currentPlayerIndex + 1) % gameState.playerOrder.length;

    // Update the current player ID using the playerOrder array.
    gameState.currentPlayerId =
      gameState.playerOrder[gameState.currentPlayerIndex];

    // Persist the updated game state with the new current player.
    await this.room.storage.put("gameState", gameState);
  }

  private async incrementRoomGamesPlayed(roomId: string) {
    await db
      .update(rooms)
      .set({
        gamesPlayed: sql`${rooms.gamesPlayed} + 1`,
      })
      .where(eq(rooms.roomId, roomId));
  }
}

const adjectives = [
  "Crazy",
  "Happy",
  "Silly",
  "Lazy",
  "Jumpy",
  "Wild",
  "Quick",
  "Brave",
];
const nouns = [
  "Panda",
  "Banana",
  "Rocket",
  "Wizard",
  "Ninja",
  "Pirate",
  "Robot",
  "Monster",
];

function generateFunName() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj} ${noun}`;
}

PigGameServer satisfies Party.Worker;

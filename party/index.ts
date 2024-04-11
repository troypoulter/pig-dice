import { createGameSchema } from "@/app/_components/createGameSchema";
import { GameState } from "@/lib/types/GameState";
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

    gameState.players[connection.id] = {
      name: `Player ${Object.keys(gameState.players).length + 1}`,
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

      if (gameState.currentPlayerId === connection.id) {
        // If the disconnecting player was the current player, switch to the next player
        this.switchPlayer(gameState);
      }

      if (Object.keys(gameState.players).length <= 1) {
        // If there are no more players, the game is over
        gameState.hasGameStarted = false;
        gameState.winnerId = Object.keys(gameState.players)[0];
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
          players: {},
          playerOrder: [],
          currentPlayerIndex: 0,
          currentPlayerId: "",
          lastRoll: undefined,
          winnerId: undefined,
        }; // Initialize the game state
        console.log("New game room created");
        await this.room.storage.put("gameState", gameState); // Persist the new game state
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
      }

      this.switchPlayer(gameState);

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
}

PigGameServer satisfies Party.Worker;

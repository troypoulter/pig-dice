import { GameState } from "@/lib/types/GameState";
import type * as Party from "partykit/server";

export default class PigGameServer implements Party.Server {
  constructor(readonly room: Party.Room) {}

  async onConnect(connection: Party.Connection) {
    let gameState = await this.room.storage.get<GameState>("gameState");
    if (!gameState || Object.keys(gameState.players).length >= 2) {
      connection.close();
      return;
    }

    gameState.players[connection.id] = {
      name: `Player ${Object.keys(gameState.players).length + 1}`,
      totalScore: 0,
      currentScore: 0,
    };

    if (Object.keys(gameState.players).length === 1) {
      gameState.currentPlayerId = connection.id;
      console.log(`First player connected: ${connection.id}`);
    }

    await this.room.storage.put("gameState", gameState); // Persist game state changes

    this.room.broadcast(
      JSON.stringify({ message: "Player joined the game", gameState })
    );

    if (Object.keys(gameState.players).length === 2) {
      console.log("Game has started with 2 players.");
      this.room.broadcast(
        JSON.stringify({ message: "Game has started!", gameState })
      );
    }

    connection.send(
      JSON.stringify({
        message: "Connected players id",
        gameState,
        connectedPlayerId: connection.id,
      })
    );
  }

  async onRequest(req: Party.Request) {
    if (req.method === "POST") {
      let gameState = await this.room.storage.get<GameState>("gameState");
      if (!gameState) {
        gameState = { players: {}, currentPlayerId: "" }; // Initialize the game state
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

      if (gameState.players[gameState.currentPlayerId].totalScore >= 20) {
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
    const playerIds = Object.keys(gameState.players);
    gameState.currentPlayerId = playerIds.find(
      (id) => id !== gameState.currentPlayerId
    )!;
    await this.room.storage.put("gameState", gameState); // Ensure to persist any changes made during the switch
  }
}

PigGameServer satisfies Party.Worker;

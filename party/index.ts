import { GameState } from "@/lib/types/GameState";
import type * as Party from "partykit/server";

export default class PigGameServer implements Party.Server {
  private gameState: GameState | null = null;

  constructor(readonly room: Party.Room) {}

  async onConnect(connection: Party.Connection) {
    // If the gameState does not exist or already has 2 players, reject new connections
    if (!this.gameState || Object.keys(this.gameState.players).length >= 2) {
      connection.close();
      return;
    }

    // Add the player to the game state
    this.gameState.players[connection.id] = {
      totalScore: 0,
      currentScore: 0,
    };

    // If this is the first player, set them as the currentPlayerId
    if (Object.keys(this.gameState.players).length === 1) {
      this.gameState.currentPlayerId = connection.id;
      console.log(`First player connected: ${connection.id}`);
    }

    // Broadcast the game state to all connected clients
    this.room.broadcast(
      JSON.stringify({
        message: "Player joined the game",
        gameState: this.gameState,
      })
    );

    // If this is the second player, the game can start
    if (Object.keys(this.gameState.players).length === 2) {
      console.log("Game has started with 2 players.");
      this.room.broadcast(
        JSON.stringify({
          message: "Game has started!",
          gameState: this.gameState,
        })
      );
    }
  }

  async onRequest(req: Party.Request) {
    if (req.method === "POST" && !this.gameState) {
      // Initialize the game state with an empty players object and no currentPlayerId
      this.gameState = {
        players: {},
        currentPlayerId: "", // This will be set when the first player connects
      };
      return new Response("New game room created.", { status: 200 });
    }

    if (this.gameState) {
      // If a game is already in progress or waiting for players
      return new Response(JSON.stringify(this.gameState), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Invalid request", { status: 400 });
  }

  async onMessage(message: string | ArrayBuffer, sender: Party.Connection) {
    if (!this.gameState || typeof message !== "string") return;

    // Parse the incoming message
    const event = JSON.parse(message);

    // Handle dice roll event
    if (event.type === "roll") {
      // Ensure it's the current player's turn
      if (sender.id !== this.gameState.currentPlayerId) {
        sender.send(JSON.stringify({ error: "Not your turn" }));
        return;
      }

      const roll = Math.floor(Math.random() * 6) + 1; // Simulate a dice roll (1-6)
      this.gameState.lastRoll = roll;

      if (roll === 1) {
        // Switch to the next player and reset current score
        this.gameState.players[this.gameState.currentPlayerId].currentScore = 0;
        this.switchPlayer();
      } else {
        // Add roll to current score
        this.gameState.players[this.gameState.currentPlayerId].currentScore +=
          roll;
      }

      // Broadcast the updated game state to all players
      this.room.broadcast(JSON.stringify(this.gameState));
    }
  }

  // Utility method to switch the current player
  private switchPlayer() {
    const playerIds = Object.keys(this.gameState!.players);
    this.gameState!.currentPlayerId = playerIds.find(
      (id) => id !== this.gameState!.currentPlayerId
    )!;
  }
}

PigGameServer satisfies Party.Worker;

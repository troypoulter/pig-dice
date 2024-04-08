import { type ClassValue, clsx } from "clsx";
import {
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  LucideIcon,
  Square,
} from "lucide-react";
import { twMerge } from "tailwind-merge";

type DiceIconsType = {
  [key: string]: LucideIcon;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const drawPigConfetti = (context: CanvasRenderingContext2D) => {
  // Scale factor to make the pig face larger
  const scale = 1;
  const size = 10 * scale;
  const earSize = size / 4;
  const eyeSize = size / 20;
  const noseWidth = size / 2; // Increase nose width
  const noseHeight = size / 3; // Increase nose height

  // Head
  context.beginPath();
  context.arc(0, 0, size, 0, Math.PI * 2, true); // Head

  // Ears
  context.moveTo(-size / 2, -size / 2); // Left ear
  context.lineTo(-size / 2 - earSize, -size / 2 - earSize);
  context.lineTo(-size / 2, -size / 2 - earSize / 2);

  context.moveTo(size / 2, -size / 2); // Right ear
  context.lineTo(size / 2 + earSize, -size / 2 - earSize);
  context.lineTo(size / 2, -size / 2 - earSize / 2);

  // Fill head and ears
  context.fillStyle = "#FFC0CB"; // Light pink
  context.fill();

  // Nose
  context.fillStyle = "#FF69B4"; // Darker pink
  context.fillRect(-noseWidth / 2, 0, noseWidth, noseHeight); // Nose; adjust position as needed

  // Nostrils
  context.fillStyle = "black";
  context.fillRect(-noseWidth / 4, noseHeight / 4, eyeSize, noseHeight / 4); // Left nostril; adjust position as needed
  context.fillRect(
    noseWidth / 4 - eyeSize / 2,
    noseHeight / 4,
    eyeSize,
    noseHeight / 4
  ); // Right nostril; adjust position as needed

  // Eyes
  context.beginPath();
  context.arc(-size / 3, -size / 3, eyeSize, 0, Math.PI * 2, true); // Left eye
  context.arc(size / 3, -size / 3, eyeSize, 0, Math.PI * 2, true); // Right eye
  context.fill();
};

export const drawGGConfetti = (ctx: CanvasRenderingContext2D) => {
  ctx.beginPath(); // Begin a new path for the "GG" shape
  ctx.font = "bold 30px Comic Sans MS"; // Set the font size and style
  ctx.fillStyle = "#FFC0CB"; // Set a nice shade of pink for the letters
  ctx.fillText("GG", 0, 10); // Draw the "GG" at the desired position
  ctx.closePath(); // Close the path
};

type DiceIconProps = {
  lastRoll?: number;
};

export const DiceIcon: React.FC<DiceIconProps> = ({ lastRoll }) => {
  if (!lastRoll) return <Square size={96} />;

  const diceIcons: DiceIconsType = {
    "1": Dice1,
    "2": Dice2,
    "3": Dice3,
    "4": Dice4,
    "5": Dice5,
    "6": Dice6,
  };

  const DiceIcon = diceIcons[lastRoll.toString()] || Square;

  return <DiceIcon size={96} />;
};

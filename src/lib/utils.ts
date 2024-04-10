import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const drawPigConfetti = (context: CanvasRenderingContext2D) => {
  // Scale factor to make the pig face larger
  const scale = 2.5;
  const size = 10 * scale;
  const earSize = size / 2;
  const eyeSize = size / 10;
  const noseWidth = size / 1; // Increase nose width
  const noseHeight = size / 2; // Increase nose height

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

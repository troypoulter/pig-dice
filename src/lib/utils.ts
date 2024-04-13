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

const winMessages = [
  "You're on a roll! Another win in the pigpen!",
  "Pigs might not fly, but your score just did!",
  "Squeal with victory! You've outrolled them all!",
  "Hog the spotlight, it's a well-deserved win!",
  "Looks like you've got the golden snout today!",
  "You rolled your way to the top! Pure swine-artistry!",
  "You're the cream of the crop in this pig sty!",
  "Unbelievable! You've outsnouted the competition!",
  "King of the Pig Pen - wear your crown proudly!",
  "You've got the magic touch, or should I say trotter?",
  "That's some fine swine strategy you've got!",
  "You've bacon your opponents cry with that score!",
  "Rolling like a true hog boss!",
  "This little piggy went to the winner's circle!",
  "You've pork-barreled past everyone else!",
  "Con-grunt-ulations, you've earned this win!",
  "That was some sty-lish rolling!",
  "Pigtacular performance there!",
  "You've hammed it up magnificently!",
  "Rolling high, you're the big pig on campus!",
];

const loseMessages = [
  "Looks like you're bacon now - better luck next roll!",
  "This little piggy got roasted!",
  "Not every pig finds the truffles, try again!",
  "Even the best rollers hit the mud sometimes.",
  "Keep rolling; even a blind pig finds an acorn sometimes!",
  "You got outsnouted this time!",
  "You're just a piglet in a pen of big rollers!",
  "Someone's bacon got saved, and it wasn't yours!",
  "That roll would make a pig squeal in agony!",
  "Maybe next time don't roll with the piglets!",
  "Looks like you hit a pork patch!",
  "You're just a ham in a game of big rollers!",
  "Don't go bacon my heart with those rolls!",
  "Mud in your eyes! Tough loss today!",
  "Even a prize hog has its off days!",
  "You've been out-grunted and out-rolled!",
  "Keep your snout up; it's just one game!",
  "Looks like you were playing in the mud this time.",
  "Roll like a pig, end up in the pen!",
  "That game was a real pig's ear of an effort!",
];

export function getRandomWinMessage(): string {
  return winMessages[Math.floor(Math.random() * winMessages.length)];
}

export function getRandomLoseMessage(): string {
  return loseMessages[Math.floor(Math.random() * loseMessages.length)];
}

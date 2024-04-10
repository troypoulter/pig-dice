import {
  BoxSelect,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  LucideIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "./utils";

type DiceIconsType = {
  [key: string]: LucideIcon;
};

type DiceIconProps = {
  lastRoll?: number;
  increment: number;
};

export const DiceIcon: React.FC<DiceIconProps> = ({ lastRoll, increment }) => {
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (lastRoll) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 600); // Match this duration with your CSS animation
      return () => clearTimeout(timer);
    }
  }, [lastRoll, increment]);

  if (!lastRoll) return <BoxSelect size={96} />;

  const diceIcons: DiceIconsType = {
    "1": Dice1,
    "2": Dice2,
    "3": Dice3,
    "4": Dice4,
    "5": Dice5,
    "6": Dice6,
  };

  const SelectedDiceIcon = diceIcons[lastRoll.toString()] || BoxSelect;

  return (
    <div className={shake ? "animate-shake" : ""}>
      <SelectedDiceIcon
        size={96}
        className={cn(lastRoll === 1 && "text-[#FFC0CB]")}
      />
    </div>
  );
};

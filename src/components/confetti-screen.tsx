"use client";

import { useIsMounted } from "@/lib/use-is-mounted";
import { useWindowSize } from "@/lib/use-window-size";

import Confetti from "react-confetti";
import { createPortal } from "react-dom";

export const ConfettiScreen = ({
  numberOfPieces: numberOfPiecesProp = 200,
  ...props
}: React.ComponentPropsWithoutRef<typeof Confetti>) => {
  const isMounted = useIsMounted();
  const { width, height } = useWindowSize();

  if (!isMounted) {
    return null;
  }

  return createPortal(
    <Confetti
      {...props}
      className="w-full"
      numberOfPieces={numberOfPiecesProp}
      width={width}
      height={height}
    />,
    document.body
  );
};

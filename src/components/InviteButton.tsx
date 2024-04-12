import { useState } from "react";
import { Button } from "./ui/button";
import { Check, Link } from "lucide-react";

export default function InviteButton() {
  const [buttonText, setButtonText] = useState("Invite");

  const handleCopy = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          setButtonText("Copied!");
          setTimeout(() => setButtonText("Invite"), 3000);
        })
        .catch((err) => console.error("Failed to copy URL: ", err));
    }
  };

  return (
    <Button size="sm" variant="outline" onClick={handleCopy}>
      {buttonText === "Copied!" ? (
        <Check size={22} className="mr-2" />
      ) : (
        <Link size={22} className="mr-2" />
      )}
      {buttonText}
    </Button>
  );
}

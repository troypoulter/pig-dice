import { PiggyBank } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0 bg-white shadow-sm">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="flex flex-row text-center text-sm leading-loose text-muted-foreground md:text-left">
            <PiggyBank size={28} color="#007DFC" className="mr-2" />
            <span>
              Built by{" "}
              <a
                href="https://www.troypoulter.com/"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                troypoulter
              </a>
              . The source code is available on{" "}
              <a
                href="https://github.com/troypoulter/pig-dice"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                GitHub
              </a>
              . Version:{" "}
              <a
                href={`https://github.com/troypoulter/pig-dice/commit/${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}`}
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA!.substring(0, 7)}
              </a>
              .
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

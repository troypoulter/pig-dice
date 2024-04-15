# Pig Dice

The classic game of Pig re-made in the web!

> [!TIP]
> You can play it live here [pig-dice.troypoulter.com](https://pig-dice.troypoulter.com/)!

![hero_image](public/opengraph.jpg)

## Features

- Play with up to 6 friends online with realtime multiplayer in the browser
- Challenge PiggleWiggle, a computer that will give you a run for your money
- Responsive on mobile

## Motivation

I haven't worked with websockets before and my friends and I did a hackathon one weekend to learn them, I decided to make this game as it touched all the key things I wanted to learn.

The main new technology I learnt was using websockets via [Partykit](https://www.partykit.io/), which was great to use, especially with their good local DX.

Over the course of a week, I put it all together for its first release! I'm planning to add more over time and address feedback, though in its current state it should serve as an example of using all the technologies below well!

## Tech Stack

- [Next.js](https://nextjs.org/)
- [Partykit](https://www.partykit.io/) for websockets
- [TailwindCSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- [SQLite](https://www.sqlite.org/index.html) hosted via [Turso](https://turso.tech/)
- [DrizzleORM](https://orm.drizzle.team/)
- [Vercel](https://vercel.com/) for hosting and deployment
- [Plausible](https://plausible.io/) for analytics

## Contributing

Contributions are always welcome!

See [CONTRIBUTING.md](CONTRIBUTING.md) for ways to get started.

## Feedback

Feedback is appreciated! Reach out on [Twitter](https://twitter.com/troypoulterr) or submit a new issue!

## License

Licensed under the [MIT license](LICENSE.md).

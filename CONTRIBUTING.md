# Contributing

First off, thank you for considering to contribute to Pig Dice! I welcome any and all contributions!

Please feel free to raise an issue, start a discussion or reach out to me at [@troypoulterr](https://twitter.com/troypoulterr).

## Development

### Fork this repo

Fork the repository by clicking the fork button in the top-right corner of this page.

### Clone locally

```bash
git clone https://github.com/your-username/pig-dice.git
```

### Go to project directory

```bash
cd pig-dice
```

### Install dependencies

```bash
npm install
```

### Setup environment variables

Make a copy of `.env.example` and name it `.env`, so that the `.gitignore` won't commit anything.

If you're running the Partykit server locally (recommended), you can keep `NEXT_PUBLIC_PARTYKIT_HOST` commented out.

### Run Turso

We use [Turso](https://turso.tech/) for the SQLite database, you can choose to either connect to a live database hosted by them or run it locally using their CLI. Running it locally is recommended for dev work.

#### Connect to a live database

Follow their fantastic [Quickstart guide](https://docs.turso.tech/quickstart) and copy the URL and token into the environment variables.

#### Connect to a local database

Start by reading their [CLI installation](https://docs.turso.tech/cli/installation) guide, then their [Local development - Turso CLI](https://docs.turso.tech/local-development#turso-cli) for the most up-to-date approach on setting it up!

### Start the server

```bash
npm run dev
```

This will start Next.js as the full-stack app, as well as Partykit for the websockets, that's it!

# ohShield Development Guide

## Project Structure

```
ohShield/
├── src/
│   ├── commands/          # Slash commands (Discord.js CommandBuilder)
│   ├── prefixCommands/    # Text-based prefix commands (%, !)
│   ├── events/            # Discord event handlers (ready, messageCreate, etc.)
│   ├── middleware/        # Request/message processing middleware
│   ├── utils/             # Helper functions and utilities
│   ├── config/            # Configuration management
│   ├── database/          # Database connection and models
│   ├── types/             # TypeScript type definitions
│   └── index.ts           # Bot entry point
├── dist/                  # Compiled JavaScript (generated)
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── .env.example           # Environment variables template
└── .gitignore             # Git ignore rules
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env and add your Discord bot token and other settings
   ```

3. **Build and run:**
   ```bash
   npm run build
   npm start
   ```

   Or for development with hot reload:
   ```bash
   npm run dev
   ```

## Key Features to Implement

- [ ] Global Rules detection (scam links, impersonation, etc.)
- [ ] Image Drop Detection
- [ ] Scam Reporting (`!scam` / `%scam`)
- [ ] AutoMod integration
- [ ] User Verification (emoji, captcha, 2048)
- [ ] Security Reminders (recurring notifications)
- [ ] Full History Check (`%check`)
- [ ] Channel Access Overview (`%checkchannels`)
- [ ] Role Hierarchy Check (`%checkroles`)
- [ ] Onboarding Wizard (`%start`)
- [ ] Configuration commands (`%set`, `%setreport`, etc.)

## Database Models

The database will need collections for:

- `guildConfigs` - Per-server configuration
- `securityEvents` - Log of all security actions
- `scamReports` - Scam report records
- `verificationSessions` - Active verification challenges
- `imageStorageIndex` - Metadata for stored images

## Environment Variables

See `.env.example` for all required and optional environment variables.

## Commands

- **Development:** `npm run dev` - Run with ts-node
- **Build:** `npm run build` - Compile TypeScript
- **Start:** `npm start` - Run compiled bot
- **Lint:** `npm run lint` - Check code style
- **Format:** `npm run format` - Format code with Prettier

## Adding a New Prefix Command

Create a file in `src/prefixCommands/`:

```typescript
import { Message } from 'discord.js';
import { PrefixCommand } from '../types/index.js';

export const command: PrefixCommand = {
  name: 'commandName',
  description: 'Brief description',
  execute: async (message: Message, args: string[]) => {
    // Command logic here
  },
};

export default command;
```

## Adding a New Event

Create a file in `src/events/`:

```typescript
import { Client } from 'discord.js';
import { Event } from '../types/index.js';

export const event: Event = {
  name: 'eventName',
  once: false,
  execute: async (client: Client) => {
    // Event logic here
  },
};

export default event;
```

## Notes

- All code should be written in TypeScript
- Follow the type definitions in `src/types/index.ts`
- Database operations go in `src/database/`
- Utility functions go in `src/utils/`
- Configuration is managed centrally in `src/config/index.ts`

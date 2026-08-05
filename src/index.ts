import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { config } from './config/index.js';
import { Command, PrefixCommand, Event } from './types/index.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
  ],
});

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_TOKEN: string;
    }
  }
}

// Extend Client to store commands and prefixCommands
declare module 'discord.js' {
  interface Client {
    commands: Collection<string, Command>;
    prefixCommands: Collection<string, PrefixCommand>;
  }
}

client.commands = new Collection();
client.prefixCommands = new Collection();

async function start() {
  try {
    console.log('Starting ohShield bot...');

    if (!config.discord.token) {
      throw new Error('DISCORD_TOKEN is not set in environment variables');
    }

    // TODO: Load events
    // TODO: Load commands
    // TODO: Load prefix commands
    // TODO: Connect to database

    await client.login(config.discord.token);
    console.log('ohShield bot is ready!');
  } catch (error) {
    console.error('Failed to start bot:', error);
    process.exit(1);
  }
}

start();

export default client;

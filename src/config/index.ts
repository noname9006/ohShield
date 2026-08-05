import dotenv from 'dotenv';

dotenv.config();

export const config = {
  discord: {
    token: process.env.DISCORD_TOKEN || '',
    prefix: process.env.COMMAND_PREFIX || '%',
    botId: process.env.BOT_ID || '',
  },
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ohshield',
    name: process.env.DATABASE_NAME || 'ohshield',
  },
  web: {
    publicUrl: process.env.WEB_PUBLIC_URL || 'http://localhost:3000',
    port: parseInt(process.env.WEB_PORT || '3000'),
  },
  features: {
    testMode: process.env.TEST_MODE === 'true',
    enableVerification: process.env.ENABLE_VERIFICATION !== 'false',
    enableGlobalRules: process.env.ENABLE_GLOBAL_RULES !== 'false',
  },
  rateLimits: {
    reportGuildCooldown: parseInt(process.env.REPORT_GUILD_COOLDOWN || '10'),
    reportUserCooldown: parseInt(process.env.REPORT_USER_COOLDOWN || '60'),
    reportHourlyLimit: parseInt(process.env.REPORT_HOURLY_LIMIT || '5'),
  },
  checks: {
    globalCooldownDays: parseInt(process.env.CHECK_GLOBAL_COOLDOWN || '30'),
  },
  imageStorage: {
    retentionHours: parseInt(process.env.IMAGE_STORAGE_RETENTION_HOURS || '24'),
    enabled: process.env.ENABLE_IMAGE_STORAGE === 'true',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

export default config;

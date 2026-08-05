import { CommandInteraction, Message, Client, GuildMember } from 'discord.js';

export interface GuildConfig {
  guildId: string;
  logChannel?: string;
  scamAlertChannel?: string;
  automodChannel?: string;
  verificationChannel?: string;
  verificationLogChannel?: string;
  verificationRole?: string;
  scamReportRoles: string[];
  imageThreshold?: number;
  imageThresholdType: 'exact' | 'greaterThan';
  imageTimeout?: string;
  imageExcludedRoles: string[];
  globalRulesEnabled: boolean;
  globalRulesTimeout?: string;
  notificationChannels: NotificationChannel[];
  notificationInterval: number;
  notificationMinMessages: number;
  verificationModes: VerificationMode[];
  verificationRounds?: number;
  verificationTasks?: number;
  verificationThreshold?: number;
  verificationRetries?: number;
  verificationCooldown?: number;
  verificationKickAfter?: number;
  reportImmunityRoles: string[];
  reportDeleteRoles: string[];
  reportTimeoutRoles: string[];
  reportKickRoles: string[];
  reportBanRoles: string[];
  reportModeratorRoles: string[];
  reportGuildCooldown?: number;
  reportUserCooldown?: number;
  reportHourlyLimit?: number;
  reportTimeout?: string;
  testMode: boolean;
}

export interface NotificationChannel {
  channelId: string;
  lastNotified: Date;
  messageCount: number;
}

export type VerificationMode = 'emoji' | 'captcha' | 'game2048';

export interface SecurityEvent {
  guildId: string;
  timestamp: Date;
  type: 'image_drop' | 'scam_report' | 'automod' | 'global_rules' | 'verification';
  userId: string;
  userName: string;
  action?: string;
  details?: Record<string, unknown>;
}

export interface ScamReport {
  guildId: string;
  reporterId: string;
  reporterName: string;
  reportedUserId: string;
  reportedUserName: string;
  messageContent: string;
  messageLink: string;
  timestamp: Date;
  status: 'reported' | 'reviewed' | 'resolved';
}

export interface Command {
  data: {
    name: string;
    description: string;
  };
  execute: (interaction: CommandInteraction) => Promise<void>;
}

export interface PrefixCommand {
  name: string;
  description: string;
  execute: (message: Message, args: string[]) => Promise<void>;
}

export interface Event {
  name: string;
  once?: boolean;
  execute: (client: Client, ...args: unknown[]) => Promise<void>;
}

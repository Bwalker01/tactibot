import type { ChatInputCommandInteraction, Interaction } from "discord.js";

export function isChatInputCommand(event: Interaction): event is ChatInputCommandInteraction {
    return event.isChatInputCommand();
}
import type { Interaction } from "discord.js";
import { isChatInputCommand } from "../util/interactionTypeGuard.js";

export async function routeInteraction(event: Interaction) {
    if (isChatInputCommand(event)) {
        // TODO: Handle chat input command
    }
}
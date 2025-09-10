import { Client, Events, GatewayIntentBits } from 'discord.js';
import { routeInteraction } from '../interactions/router';

export function setupClient() {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  client.on(Events.ClientReady, event => {
    console.log(`Logged in as ${event.user.tag}.`);
  });

  client.on(Events.InteractionCreate, async event => {
    routeInteraction(event);
  });

  return client;
}

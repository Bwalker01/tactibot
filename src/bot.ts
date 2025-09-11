import 'dotenv/config';
import { setupClient } from './utils/setup';
import { loadCommands } from './utils/loadCommands';

const client = setupClient();
loadCommands(client);
const token = process.env.TOKEN;

client.login(token);

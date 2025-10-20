import 'dotenv/config';
import { setupClient } from './utils/setup';
import { portCommands } from './utils/portCommands';

const client = setupClient();
const token = process.env.TOKEN;

if (!token) {
	throw new Error('TOKEN is not set');
}

portCommands({ token, clientId: client.user?.id ?? '' });

client.login(token);

import 'dotenv/config';
import { setupClient } from './utils/setup';

const token = process.env.TOKEN;

if (!token) {
	throw new Error('TOKEN is not set');
}

const client = setupClient(token);
client.login(token);

import 'dotenv/config';
import { setupClient } from './util/setup';

const client = setupClient();

const token = process.env.TOKEN;

client.login(token);
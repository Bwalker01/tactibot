import { Pool, QueryResultRow } from 'pg';

/**
 * A simple controller for the database.
 * This class is responsible for querying the database and returning the results.
 * It is also responsible for closing the connection pool when the application exits.
 * Uses the Singleton pattern to ensure only one connection pool is created.
 */
export class DatabaseController {
	private static instance: DatabaseController | null = null;
	private readonly pool: Pool;

	private constructor() {
		console.log(process.env.DATABASE_URL);
		this.pool = new Pool({
			connectionString: process.env.DATABASE_URL,
		});
	}

	public static getInstance(): DatabaseController {
		if (!DatabaseController.instance) {
			DatabaseController.instance = new DatabaseController();
		}
		return DatabaseController.instance;
	}

	public async queryAll<T extends QueryResultRow>(
		queryString: string,
		params?: any[]
	): Promise<{ rows: T[] }> {
		const result = await this.pool.query<T>(queryString, params);
		return { rows: result.rows };
	}

	public async queryOne<T extends QueryResultRow>(
		queryString: string,
		params?: any[]
	): Promise<T | null> {
		const result = await this.pool.query<T>(queryString, params);
		if (result.rows.length > 1) {
			throw new Error('Multiple rows returned for a query expecting one.');
		}
		return result.rows[0] || null;
	}

	public async close() {
		await this.pool.end();
	}
}

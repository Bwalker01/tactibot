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
		this.pool = new Pool({
			connectionString: process.env.DATABASE_URL,
			user: process.env.DATABASE_USER,
			password: process.env.DATABASE_PASSWORD,
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
		try {
			const result = await this.pool.query<T>(queryString, params);
			return { rows: result.rows };
		} catch (error) {
			throw new Error(`Database error: ${error}`);
		}
	}

	public async queryOne<T extends QueryResultRow>(
		queryString: string,
		params?: any[]
	): Promise<T | null> {
		try {
			const result = await this.pool.query<T>(queryString, params);
			if (result.rows.length > 1) {
				throw new Error('Multiple rows returned for a query expecting one.');
			}
			return result.rows[0] || null;
		} catch (error) {
			throw new Error(`Database error: ${error}`);
		}
	}

	public async execute(queryString: string, params?: any[]): Promise<boolean> {
		try {
			const result = await this.pool.query(queryString, params);
			if (result) {
				return true;
			}
			return false;
		} catch (error) {
			throw new Error(`Database error ${error}`);
		}
	}

	public async close() {
		await this.pool.end();
	}
}

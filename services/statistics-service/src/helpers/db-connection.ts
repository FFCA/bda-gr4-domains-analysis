import { Client, ClientConfig, QueryResult } from 'pg';
import dotenv from 'dotenv';

/**
 * Loads the dotenv config on initially loading this file.
 */
dotenv.config();

/**
 * Class for managing database connection / configuration.
 */
class DbConnection {
    /**
     * Postgres Client instance.
     * @private
     */
    private client!: Client;

    /**
     * @param config Client configuration to be used.
     */
    constructor(private readonly config: ClientConfig) {}

    /**
     * Creates a new client and connects to it.
     */
    connect(): Promise<void> {
        this.client = new Client(this.config);
        return this.client.connect();
    }

    /**
     * Executes a given query and returns the result.
     * @param query
     */
    executeQuery(query: string): Promise<QueryResult> {
        return this.client.query(query);
    }
}

/**
 * Database connection as singleton.
 */
export default module.exports = new DbConnection({
    user: 'postgres',
    host: process.env.DB_HOST ?? 'bda_gr4_database',
    database: 'domainanalysis',
    password: 'postgres',
    port: 5432,
});

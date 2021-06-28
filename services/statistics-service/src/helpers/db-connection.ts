import { Client, ClientConfig, Notification, QueryResult } from 'pg';
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
     * Initializes a listener for "watch_domain" and sets the function to be executed
     * in case of insertions, updates or deletions.
     *
     * @param channel Channel to subscribe to.
     * @param notificationFn Function to be executed in case of a notification on the subscribed channel.
     */
    async registerNotificationListener(
        channel: string,
        notificationFn: () => void
    ): Promise<void> {
        await this.client.query(`LISTEN ${channel}`);
        this.client.on('notification', notificationFn);
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

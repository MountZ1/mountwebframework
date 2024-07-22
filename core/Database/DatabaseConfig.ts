import { Pool } from "pg";
import { createPool } from "mysql2";
import { Kysely, PostgresDialect, MysqlDialect } from "kysely";

export default class DatabaseIdentifier{
    private db : any;
    private dbConfig={
        DB_TYPE: process.env.DB_TYPE,
        DB_HOST: process.env.DB_HOST,
        DB_PORT: Number(process.env.DB_PORT),
        DB_USERNAME: process.env.DB_USERNAME,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_NAME: process.env.DB_NAME,
    }
    constructor(){
        // console.log(this.dbConfig.DB_TYPE);
        this.validateConfig();

        switch (this.dbConfig.DB_TYPE) {
            case "mysql":
                this.ifMysql().then(db => this.db = db);
                break;
            case "pgsql":
                this.ifPostgres().then(db => this.db = db);
                break;
            default:
                throw new Error(`Unsupported database type: ${this.dbConfig.DB_TYPE}`);
        }
    }

    private validateConfig(){
        for (const [key, value] of Object.entries(this.dbConfig)) {
            if (value === undefined) {
                throw new Error(`Missing environment variable: ${key}`);
            }
        }
    }

    private async ifMysql(){
        const config = new MysqlDialect({
            pool: createPool({
                host: this.dbConfig.DB_HOST,
                port: this.dbConfig.DB_PORT,
                user: this.dbConfig.DB_USERNAME,
                password: this.dbConfig.DB_PASSWORD,
                database: this.dbConfig.DB_NAME,
                connectionLimit: 10
            })
        })

        // return await Knex(knexConfig);
        return await new Kysely({dialect: config});
    }

    private async ifPostgres(){
        const config = new PostgresDialect({
            pool: new Pool({
                host: this.dbConfig.DB_HOST,
                port: this.dbConfig.DB_PORT,
                user: this.dbConfig.DB_USERNAME,
                password: this.dbConfig.DB_PASSWORD,
                database: this.dbConfig.DB_NAME,
                max: 10
            })
        });

        return await new Kysely({ dialect: config });
    }

    conn(){
        return this.db;
    }
}
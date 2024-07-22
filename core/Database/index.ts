import { Kysely, sql } from "kysely";
import DatabaseIdentifier from "./DatabaseConfig";

export default class Model{
    protected static db = new DatabaseIdentifier();
    // protected static db: Kysely<any> = ne;
    // protected coba: string | undefined;

    constructor() {
        if (new.target === Model) {
            throw new Error("Cannot instantiate abstract class Model directly");
        }
    }

    static get tableName() {
        return this.name.toLowerCase() + 's'; // Simple pluralization, e.g., User -> users
    }

    static GET(){
        return this.db.conn().selectFrom(this.tableName);
    }
    
    static STORE(val : {[key: string] : any}){
        return this.db.conn().insertInto(this.tableName).values(val);
    }

    static UPDATE(val: {[key: string] : any} | ((builder : any) => any)){
        return this.db.conn().updateTable(this.tableName).set(val);
    }

    static DESTROY(column : string, op : string = '=', val: string){
        return this.db.conn().deleteFrom(this.tableName).where(column, op, val);
    }

    static TRANSACT(callback : (builder : any) => any){
        return this.db.conn().execute(callback);
    }

    static JOIN(onTable: any, onColumn: string, against: string = 'id'){
        // console.log(onTable.tableName, `${onTable.tableName}.${onColumn}`, `${this.tableName}.${against}`);
        return this.GET().innerJoin(onTable.tableName, `${onTable.tableName}.${onColumn}`, `${this.tableName}.${against}`);
    }

    static RAW(query: string){
        return sql.raw(query).execute(this.db.conn());
    }
}
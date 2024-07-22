import DatabaseIdentifier from "./DatabaseConfig";

export class Migrations{
    protected static db = new DatabaseIdentifier();

    static run(){
        return this.db.conn()
    }
}
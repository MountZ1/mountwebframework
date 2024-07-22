import { Migrations } from "../../core/Database/migrations";

export async function up() {
    await Migrations.run().schema
        .createTable('cobas')
        .addColumn('id', 'serial', (col : any) => col.primaryKey())
        .addColumn('name', 'text', (col : any) => col.notNull())
        .execute();
}

export async function down() {
    await Migrations.run().schema
        .dropTable('cobas')
        .execute();
}

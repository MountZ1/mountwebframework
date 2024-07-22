import { file, fileURLToPath, write} from "bun"
import path from "path"
import { readdir } from "node:fs/promises";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MakeMigrations = async (name: string) => {
    const filePath = path.join(__dirname, "../../database/migrations", `create_${name}_table.ts`);
    const content = `import { Migrations } from "../../core/Database/migrations";

export async function up() {
    await Migrations.run().schema
        .createTable('${name}s')
        .addColumn('id', 'serial', (col : any) => col.primaryKey())
        .execute();
}

export async function down() {
    await Migrations.run().schema
        .dropTable('${name}s')
        .execute();
}
`

    try{
        await write(filePath, content);
        console.log(`Migration ${name} successfully created at ${filePath}`);
    } catch (error : any) {
        console.error(`Failed to create migration: ${error.message}`);
    }
}

const RunMigrations = async (name? : string) => {
    const filePath = path.join(__dirname, "../../database/migrations");
    if (name) {
        const table = await path.join(filePath, `create_${name}_table.ts`);
        try {
            const migrations = await import(table);
            console.log(`Running migration ${name}`);
            await migrations.up()
            console.log(`Migration ${name} successfully run`)
        } catch (error) {
            throw new Error(`Failed to run migration ${name}: ${error}`);
        } finally {
            await process.exit(0);
        }
    } else{
        const tables = await readdir(filePath);
        for (const table of tables){
            if (table.endsWith(".ts")){
                try {
                    const migrations = await import(path.join(filePath, table));
                    console.log(`Running migration ${table}`);
                    await migrations.up()
                    console.log(`Migration ${table} successfully run`)
                } catch (error) {
                    throw new Error(`Failed to run migration ${table}: ${error}`);
                } finally {
                    await process.exit(0);
                }
            }
        }
    }
}

const RoolbackMigrations = async (name? : string) => {
    const filePath = path.join(__dirname, "../../database/migrations");
    if (name) {
        const table = await path.join(filePath, `create_${name}_table.ts`);
        try {
            const migrations = await import(table);
            console.log(`Rolling back migration ${name}`);
            await migrations.down()
            console.log(`Rollback ${name} successfully run`)
        } catch (error) {
            throw new Error(`Failed to run migration ${name}: ${error}`);
        } finally {
            await process.exit(0);
        }
    } else{
        const tables = await readdir(filePath);
        for (const table of tables){
            if (table.endsWith(".ts")){
                try {
                    const migrations = await import(path.join(filePath, table));
                    console.log(`Rolling back migration ${table}`);
                    await migrations.down()
                    console.log(`Rollback ${table} successfully run`)
                } catch (error) {
                    throw new Error(`Failed to run migration ${table}: ${error}`);
                } finally {
                    await process.exit(0);
                }
            }
        }
    }
}
export {
    MakeMigrations, 
    RunMigrations,
    RoolbackMigrations
}
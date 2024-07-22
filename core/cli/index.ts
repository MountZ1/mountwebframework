import MakeController from "./controller";
import { MakeMigrations, RunMigrations, RoolbackMigrations} from "./migrations";
import MakeModel from "./model";

const argv = process.argv.slice(2);

if (argv.length === 0) {
    console.log(`Usage: bun run cli.ts <command> [options]`);
    process.exit(1);
}

const command = argv[0];
const option = argv.slice(1);

const commandHandler : {[key: string] : (args: string[]) => void } ={
    'make:controller': (args: string[]) =>{
        if (args.length === 0) {
            console.log(`Usage: bun run cli.ts make:controller <controller_name>`);
            process.exit(1);
        }
        MakeController(args[0]);
    },
    'make:model': (args: string[]) =>{
        if (args.length === 0) {
            console.log(`Usage: bun run cli.ts make:model <model_name>`);
            process.exit(1);
        }
        MakeModel(args[0]);
    },
    'make:migration': (args: string[]) =>{
        if (args.length === 0) {
            console.log(`Usage: bun run cli.ts make:migration <migration_name>`);
            process.exit(1);
        }
        MakeMigrations(args[0]);
    },
    'run:migration': (args: string[]) =>{
        if (args.length === 0) {
            RunMigrations();
        } else{
            RunMigrations(args[0]);
        }
    },
    'rollback:migration': (args: string[]) =>{
        if (args.length === 0) {
            RoolbackMigrations();
        } else{
            RoolbackMigrations(args[0]);
        }
    }
}

if (commandHandler[command]) {
    commandHandler[command](option);
} else{
    console.log(`Unknown command: ${command}`);
    console.log(`Usage: bun run cli.ts <command> [options]`);
}
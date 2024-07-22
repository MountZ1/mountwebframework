import { write, fileURLToPath } from "bun";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MakeController = async (name: string) => {
    const filePath = path.join(__dirname, "../../controller", `${name}.ts`);

    const content = `import type { request, response } from "../core/Router/RouterConfig";

export class ${name} {
    static async index(req: request, res : response){
        res.send("hello world");
    }
}`;

    try {
        await write(filePath, content);
        console.log(`Controller ${name} successfully created at ${filePath}`);
    } catch (error : any) {
        console.error(`Failed to create controller: ${error.message}`);
    }
};

export default MakeController;
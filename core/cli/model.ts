import { write, fileURLToPath  } from "bun";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MakeModel = async (name: string) => {
    const filePath = path.join(__dirname, "../../model", `${name}.ts`);

    const content = `import Model from "../core/Database";
export class ${name} extends Model{
    // Model attributes and methods here
}`;

    try {
        await write(filePath, content);
        console.log(`Model ${name} successfully created at ${filePath}`);
    } catch (error : any) {
        console.error(`Failed to create model: ${error.message}`);
    }
};

export default MakeModel;

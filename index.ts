import { Mountz } from "./core/index.ts";

console.log('Server is running on http://localhost:3000');
/**
 * by default app port is 3000,
 * if you want to change the port, you can just change the syntax below to "new Mountz().createApp(portnumber)"
 * createApp only take number as argument.
*/
new Mountz().CreateApp()

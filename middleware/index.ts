import type { request, response } from "../core/Router/RouterConfig";

function middleware(handler: (req: request, res: response)=> void){
   return async (req: request, res: response) => {
       await handler(req, res)
   }
}

export default middleware
import { setHeader } from "../middleware/header";
import api from "../router/api";
import router from "../router/web";
import { response, type request } from "./Router/RouterConfig";
import serveStatic from "./fileserver";

export class Mountz{
    private async callRoutes(req : request): Promise<Response> {
        const url = await new URL(req.url);
        const res = new response();
        if (url.pathname.startsWith("/asset")){
            const staticServer = await serveStatic(req);
            if (staticServer.status != 404) {
                return staticServer;
            }
        }
        
        
        if (url.pathname.startsWith("/api")) {
            if (req.method === "OPTIONS") {
                setHeader(res);  // Set headers for OPTIONS request
                return new Response(null, {
                    status: 200,
                    headers: res.headers
                });
            }

            const apiResponse = await api.handleRequest(req);
            if (apiResponse) {
                setHeader(res);  // Set headers for API response
                return new Response(apiResponse.body, {
                    status: apiResponse.status,
                    headers: res.headers
                });
            }
        }

        // Handle other routes
        const routerResponse = await router.handleRequest(req);
        return routerResponse || new Response("Not Found", { status: 404 })
    }

    public async CreateApp(port : number = 3000){
        if (typeof port != "number") throw new Error("port must be a number");
        await Bun.serve({
            port:port,
            fetch: this.callRoutes
        })
    }
}
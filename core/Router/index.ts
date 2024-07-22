import type { request } from "./RouterConfig";
import { response } from "./RouterConfig";

const routes = new Map<string, { path: string, handler: (req: request, res: response) => void }>();

export default class Router {
    private methods = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;
    private basePath: string;

    constructor(basePath: string = "") {
        this.basePath = basePath;
        this.methods.forEach((method) => {
            (this as any)[method.toLowerCase()] = (path: string, handler: (req: request, res: response) => void) => {
                this.addRoutes(method, this.basePath + path, handler);
            };
        });
    }

    private addRoutes(method: string, path: string, handler: (req: request, res: response) => void) {
        routes.set(`${method.toUpperCase()} ${path}`, { path, handler });
    }

    private matchRoute(method: string, path: string): { handler?: (req: request, res: response) => void, params?: { [key: string]: string } } {
        for (const [key, route] of routes) {
            const [routeMethod, routePath] = key.split(" ");
            if (method !== routeMethod) continue;

            const routeSegments = route.path.split("/").filter(Boolean);
            const pathSegments = path.split("/").filter(Boolean);

            if (routeSegments.length !== pathSegments.length) continue;

            const params: { [key: string]: string } = {};
            let match = true;

            for (let i = 0; i < routeSegments.length; i++) {
                const routeSegment = routeSegments[i];
                const pathSegment = pathSegments[i];

                if (routeSegment.startsWith(":")) {
                    const paramName = routeSegment.slice(1);
                    params[paramName] = pathSegment;
                } else if (routeSegment !== pathSegment) {
                    match = false;
                    break;
                }
            }

            if (match) {
                return { handler: route.handler, params };
            }
        }

        return {};
    }

    public async handleRequest(req: Request): Promise<Response> {
        const url = new URL(req.url);
        const { handler, params } = this.matchRoute(req.method.toUpperCase(), url.pathname);

        if (handler) {
            const customReq = req as request;
            if (params){
                customReq.params = params;
            }
            const res = new response();
            await handler(customReq, res);
            return new Response(res.body, { status: res.statusCode, headers: res.headers });
        } else {
            return new Response("Not Found", { status: 404 });
        }
    }

    public get!: (path: string, handler: (req: request, res: response) => void) => void;
    public post!: (path: string, handler: (req: request, res: response) => void) => void;
    public put!: (path: string, handler: (req: request, res: response) => void) => void;
    public patch!: (path: string, handler: (req: request, res: response) => void) => void;
    public delete!: (path: string, handler: (req: request, res: response) => void) => void;

}

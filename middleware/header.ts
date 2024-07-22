import type { request, response } from "../core/Router/RouterConfig";

export const setHeader = (res: response) => {
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Accept, credentials")
    res.headers.set("Access-Control-Allow-Credentials", "true")
}
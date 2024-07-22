import { UserController } from "../controller/UserController";
import Router from "../core/Router";
import middleware from "../middleware";


const api = new Router("/api");

api.get("/user", middleware(UserController.getJson));
api.get("/coba/:name", middleware(UserController.coba))

export default api;
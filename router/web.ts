import { UserController } from "../controller/UserController";
import Router from "../core/Router";


const router = new Router();

router.get("/", (req, res) => res.send("hello Mountz"));
router.get('/user', UserController.index);
router.post('/user', UserController.create);
router.get("/user/:id", UserController.show);
router.patch("/user/:id", UserController.update);
router.delete("/user/:id", UserController.destroy);
router.get("/coba/:name", UserController.coba)
// router.get("/coba/:name", (req, res) => res.send(`hello ${req.params?.name}`));

export default router;
<h1 align="center">WebFramework</h1>

> I make this code only for fun and i am not planning to maintenance it

# Documentation
- [Getting Started](#getting-started)
- [Basic](#basic)
  - [Handler](#handler)
  - [Controller](#controller)
  - [Database](#database)
  - [Model](#model)
  - [Query Builder](#query-builder)
  - [Middleware](#middleware)


## Getting Started

- Copy this repository
  ```bash
  git clone https://github.com/MountZ1/mountwebframework.git
  ```
- Install dependencies
  ```bash
  bun install
  ```
- Copy .env.example into .env and set up the database configuration
- Run the Project
  ```bash
  bun run dev
  ```

## Basic

### Folder Structure and Fle

This project is inspired by the Laravel framework. The folder structure and some architectural patterns are similar to Laravel to provide a familiar and organized setup.
  - controller
    this folder houses the controller classes, responsible for handling HTTP requests and returning responses. Controllers manage the flow of data between the model and the view, and they contain the           business logic for processing requests.
  - core
    this folder contains the core logic and configurations. It includes essential files and settings that are crucial for the application's operation.
  - database
    This folder manages database migrations. It helps in setting up and maintaining the database schema and initial data.
  - middleware
    This folder used to write your own custom middleware (i dont set up special middleware except for return http option oke for api router in header.ts)
  - model
    This folder contains the model classes, which represent the data structure and handle database interactions. Models define the properties and behaviors of the application's data entities.
  - node_modules
    This folder contains all the dependencies installed via bun. It is automatically generated and should not be modified manually.
  - public
    This folder serves static files such as HTML, CSS, JavaScript, images, and other assets. It is the root directory for serving static content.
  - resource
    This folder holds the application's views, templates, and other resource files. It typically contains HTML or template files that are rendered by the controllers.
  - router
    This folder defines the application's routing configuration. It contains files `api.ts` and `web.ts` that map HTTP requests to specific controller actions.
    - **`api.ts`**: Used to specify routing in `/api` for handling API-related endpoints.
      ```ts
      import { UserController } from "../controller/UserController";
      import Router from "../core/Router";
      import middleware from "../middleware";
      
      
      const api = new Router("/api");
      
      api.get("/user", middleware(UserController.getJson));
      api.get("/coba/:name", middleware(UserController.coba))
      
      export default api;
      ```
    - **`web.ts`**: Used to specify routing for web pages and general web-related endpoints
      ```ts
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
      ```
  - index.ts
    This is the main entry point for the application. It typically sets up the application, configures middleware, and starts the server.
    - you can also change the app port in here by adding port number createapp()
      ```ts
      import { Mountz } from "./core";
      
      console.log('Server is running on http://localhost:3000');
      /**
       * by default app port is 3000,
       * if you want to change the port, you can just change the syntax below to "new Mountz().createApp(portnumber)"
       * createApp only take number as argument.
      */
      new Mountz().CreateApp()
      ```

### Handler
  handler are used to receiving request and return respon by controller.
  #### #req
  req method are support dynamic routing by declare the parameter in router
  ```ts
  router.get("/hello/:name", (req, res) => {
    const name = req.params.name;
    res.send(`Hello ${name}`)
  }
  ```

  #### #res
  res method support several responses:
  - status
    for response in status code
  - setHeaders
    for response header only
  - json
    for response in json
  - send
    for response in single string
  - render
    for render a html view using ejs.
### Controller
  #### #Writing controller
  you can easily generating controller file by running **`make:controller`** with command line
  ```bash
  bun run artisan make:controller NameController
  ```
  now, here is the NameController looks like
  ```ts
  import type { request, response } from "../core/Router/RouterConfig";

  export class NameController {
      static async index(req: request, res : response){
          res.send("hello world");
      }
  }
  ```
  ### #Use Controller
  after write the controller you need to call the controller on your routes in `api.ts` or `web.ts`
  ```ts
  router.get("/path", NameController.index);
  ```

  you can also declare your controller in route file
  ```ts
  router.get("/path", (req, res) => res.send("hello world");
  ```
### Database
  #### #Create Migration
  you can easily generating migration file by running **`make:migration`** with command line
  ```bash
  bun run artisan make:migration name
  ```
  the code will automaticall generated this code
  ```ts
  import { Migrations } from "../../core/Database/migrations";

  export async function up() {
    await Migrations.run().schema
        .createTable('names')
        .addColumn('id', 'serial', (col : any) => col.primaryKey())
        .addColumn('name', 'text', (col : any) => col.notNull())
        .execute();
  }

  export async function down() {
    await Migrations.run().schema
        .dropTable('cobas')
        .execute();
  }
  ```
  #### # Run the migration
  running migration can be done easyly by running command
  ```bash
  bun run artisan run:migration name
  ```
  #### # Rollback the migraion
  rollback migration can be done easyly by running command
  ```bash
  bun run artisan rollback:migration name
  ```
### Model
  #### #Create Model
  for generating model you can use command
  ```bash
  bun run artisan make:model name
  ```
  and here is the generated model look like 
  ```ts
  import Model from "../core/Database";

  export class User extends Model{
    
  }
  ```
### Query Builder
  this framework are using [kysely](https://kysely.dev) as query builder. to use query builder you can just declare in model and call it in controller or declare it inside controller by calling the model    using import.
  The recipes for using query builder are call the method and declare specify function you want and then then use execute.
  #### #GET
  ```ts
  #for getting all the column
  static async getall(req: request, res : response){
        const result = await Friendlist.GET().selectAll().execute();
        res.json(result);
  }

  #couple column only
  static async getCOlumn(req: request, res : response){
        const result = await Friendlist.GET().select(['id', 'name', 'nomor_hp', 'email']).execute();
        res.json(result);
  }
  ```
  #### #STORE
  ```ts
  static async create(req: request, res : response){
        const { name, nohp, email } = await req.json();
        // console.log(name, nohp, email);
        await Friendlist.STORE({
            name: name,
            nomor_hp: nohp,
            email: email
        }).execute();
  }
  ```
  #### #UPDATE
  ```ts
  static async update(req: request, res : response){
        const id = await req.params.id;
        const { name, nohp, email } = await req.json();
        await Friendlist.UPDATE({ name, nomor_hp: nohp, email }).where('id', '=', id).execute();
  }
  ```
  #### #DESTROY
  ```ts
  static async destroy(req: request, res : response){
        const id = await req.params.id;
        await Friendlist.DESTROY('id', '=', id).execute();
  }
  ```
  #### #TRANSACT
  > Not tested yet
  #### #JOIN
  ```ts
  static async index(req: request, res : response){
        const contacts = await Friendlist.JOIN(Provider, 'id', 'provider').select(['friendlists.id', 'friendlists.name', 'friendlists.nomor_hp', 'friendlists.email', 'providers.name as   provider']).execute();
        // console.log(contatcs);
        res.render('index', { contacts });
    }
  ```
  for join you need to add the model you want then call the model(Provider) and column table. if you not declare the second parameter by default it gonna use "id" 
  #### #RAW
  ```ts
  static async coba(req: request, res : response){
        const name = await req.params.name;
        const contacts = await Friendlist.RAW(`SELECT * FROM friendlists WHERE name = '${name}' `);
        res.json(await contacts);
  }
  ```
  for more information you may want to check [this](https://kysely.dev/docs/category/examples)

### Middleware
for using middleware you just need to wrap the controller in you custom middleware
```ts
import middleware from "../middleware";
      
      
const api = new Router("/api");
      
api.get("/user", middleware(UserController.getJson));
```

This project was created using `bun init` in bun v1.1.18. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

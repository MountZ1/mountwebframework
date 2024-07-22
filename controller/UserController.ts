// import DatabaseIdentifier from "../core/config/DatabaseConfig";
import type { request, response } from "../core/Router/RouterConfig";
import { Friendlist } from "../model/Friendlist";
import { Provider } from "../model/Provider";
import { User } from "../model/User";

export class UserController {
    static async index(req: request, res : response){
        const contacts = await Friendlist.JOIN(Provider, 'id', 'provider').select(['friendlists.id', 'friendlists.name', 'friendlists.nomor_hp', 'friendlists.email', 'providers.name as provider']).execute();
        // console.log(contatcs);
        res.render('index', { contacts });
    }

    
    static async create(req: request, res : response){
        const { name, nohp, email } = await req.json();
        // console.log(name, nohp, email);
        await Friendlist.STORE({
            name: name,
            nomor_hp: nohp,
            email: email
        }).execute();
    }
    
    static async show(req: request, res : response){
        const id = await req.params.id;
        // console.log(id);
        const contact = await Friendlist.GET().select(['id', 'name', 'nomor_hp', 'email']).where('id','=', id).execute();
        // console.log(contact);
        res.json(contact);
    }

    static async update(req: request, res : response){
        const id = await req.params.id;
        const { name, nohp, email } = await req.json();
        await Friendlist.UPDATE({ name, nomor_hp: nohp, email }).where('id', '=', id).execute();
    }
    static async destroy(req: request, res : response){
        const id = await req.params.id;
        await Friendlist.DESTROY('id', '=', id).execute();
    }

    static async getJson(req: request, res : response){
        const result = await Friendlist.GET().selectAll().execute();
        res.json(result);
    }

    static async coba(req: request, res : response){
        const name = await req.params.name;
        const contacts = await Friendlist.RAW(`SELECT * FROM friendlists WHERE name = '${name}' `);
        res.json(await contacts);
    }
}
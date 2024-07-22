import * as ejs from 'ejs'
// import '../../resource/views'

export interface request extends Request {
    params: { [key: string]: string };
}

export class response{
    statusCode: number;
    headers: Headers;
    body: any;

    constructor() {
        this.statusCode = 200;
        this.headers = new Headers();
        this.body = null;
    }

    status(code: number) {
        this.statusCode = code;
        return this;
    }

    setHeader(name: string, value: string) {
        this.headers.set(name, value);
        return this;
    }

    json(data: any) {
        this.body = JSON.stringify(data);
        this.setHeader('Content-Type', 'application/json');
        return this;
    }

    send(data: any) {
        this.body = data;
        return this;
    }

    async render(views : string, data? : any, options? : ejs.Options) {
        try {
            const render = await ejs.renderFile(`./resource/views/${views}.ejs`, data, options) as string;
            this.body = render;
            this.setHeader('Content-Type', 'text/html');
        } catch (error) {
            this.status(500).send(error)
        }

        return this
    }
}
import { resolve } from "path";

export default async function serveStatic(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const decodedPathname = decodeURIComponent(url.pathname.replace('/assets', ''));
    const filePath = await resolve(`./public${decodedPathname}`);
    const file = await Bun.file(filePath);
    if (await file.exists()) {
        return new Response(file.stream(), {
            headers: { "Content-Type": Bun.file(filePath).type },
            status: 200,
        })
    } else{
        return new Response("File Not Found", { status: 404 });
    }
}

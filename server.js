import Fastify from "fastify";
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import dotenv from "dotenv";
import autoLoad from "@fastify/autoload";
import fastifyMultipart from "@fastify/multipart";
dotenv.config();

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 4000;
const HOST = "0.0.0.0";

const server = Fastify({
    ignoreTrailingSlash: true,
    logger: true,
});

server.register(fastifyMultipart, {
    limits: {
        fieldNameSize: 20,
        fileSize: 1000000
    }
});
server.register(autoLoad, { dir: join(__dirname, 'src', 'routes') });
server.register(autoLoad, { dir: join(__dirname, 'src', 'config') });

server.listen({ host: HOST, port: +PORT }, (err, address) => {
    if (err) {
        server.log.error(err);
        console.log(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`)
});
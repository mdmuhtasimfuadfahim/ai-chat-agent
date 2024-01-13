import optionsController from "../controllers/option.controller.js";
import schemaFormatter from "../schemas/schema.formatter.js";
import replySehema from "../schemas/response/reply.schema.js";
import optionsSchema from "../schemas/request/option.schema.js";
import serviceSchema from "../schemas/request/service.schema.js";
import siteSchema from "../schemas/request/site.schema.js";
import siteController from "../controllers/site.controller.js";
import conversationSchema from "../schemas/request/conversation.schema.js";
import conversationController from "../controllers/conversation.controller.js";

export default (fastify, options, done) => {

    const updateOptions = async (req, reply) => {
        return {
            schema: {
                tags: [{
                    name: 'Update Service Options'
                }],
                description: 'Update / Add Service Options',
                response: {
                    200: schemaFormatter(replySehema)
                },
                body: optionsSchema,
            },
            handler: await new optionsController(req, reply).updateOptions(),
        }
    };

    const findOptions = async (req, reply) => {
        return {
            schema: {
                tags: [{
                    name: 'Find Service Options'
                }],
                description: 'Find Service Options',
                response: {
                    200: schemaFormatter(replySehema)
                },
                body: optionsSchema,
            },
            handler: await new optionsController(req, reply).findOptions(),
        }
    };

    const deleteOptions = async (req, reply) => {
        return {
            schema: {
                tags: [{
                    name: 'Delete Service Options'
                }],
                description: 'Delete Service Options',
                response: {
                    200: schemaFormatter(replySehema)
                },
                body: optionsSchema,
            },
            handler: await new optionsController(req, reply).deleteOptions(),
        }
    };

    const updateService = async (req, reply) => {
        return {
            schema: {
                tags: [{
                    name: 'Update Service'
                }],
                description: 'Update Service',
                response: {
                    200: schemaFormatter(replySehema)
                },
                body: serviceSchema,
            },
            handler: await new siteController(req, reply).updateService(),
        }
    };

    const updatePDF = async (req, reply) => {
        return {
            schema: {
                tags: [{
                    name: 'Update Site'
                }],
                description: 'Update Service',
                response: {
                    200: schemaFormatter(replySehema)
                },
                body: siteSchema,
            },
            handler: await new siteController(req, reply).updatePDF(),
        }
    };

    const conversation = async (req, reply) => {
        return {
            schema: {
                tags: [{
                    name: 'Conversational Agent'
                }],
                description: 'Conversational Agent',
                response: {
                    200: schemaFormatter(replySehema)
                },
                body: conversationSchema,
            },
            handler: await new conversationController(req, reply).conversation(),
        }
    };

    fastify.get("/pool", async (req, res) => {
        res.status(200).send("OK ;) " + "VERSION: " + process.env.VERSION);
    });

    /**
     * Options APIs
     */

    fastify.post("/api/update-options", async (req, reply) => {
        await updateOptions(req, reply);
    });

    fastify.post("/api/get-options", async (req, reply) => {
        await findOptions(req, reply);
    });

    fastify.post("/api/delete-options", async (req, reply) => {
        await deleteOptions(req, reply);
    });

    /**
     * Site & Service APIs
     */

    fastify.post("/api/update-service", async (req, reply) => {
        await updateService(req, reply);
    });

    fastify.post("/api/update-pdf", async (req, reply) => {
        await updatePDF(req, reply);
    });

    /**
     * Conversation API
     */
    fastify.post("/api/conversation", async (req, reply) => {
        await conversation(req, reply);
    });

    done();
}
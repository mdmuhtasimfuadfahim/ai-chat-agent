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

    const updateOptions = {
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
        handler: async (req, reply) => {
            return await new optionsController(req, reply).updateOptions();
        }
    };

    const findOptions = {
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
        handler: async (req, reply) => {
            return await new optionsController(req, reply).findOptions();
        }
    };

    const deleteOptions = {
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
        handler: async (req, reply) => {
            return await new optionsController(req, reply).deleteOptions();
        }
    };

    const updateService = {
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
        handler: async (req, reply) => {
            return await new siteController(req, reply).updateService();
        }
    };

    const updatePDF = {
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
        handler: async (req, reply) => {
            return await new siteController(req, reply).updatePDF();
        }
    };

    const conversation = {
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
        handler: async (req, reply) => {
            return await new conversationController(req, reply).conversation();
        }
    };

    fastify.get("/pool", async (req, res) => {
        res.status(200).send("OK ;) " + "VERSION: " + process.env.VERSION);
    });

    /**
     * Options APIs
     */

    fastify.post("/api/update-options", updateOptions);

    fastify.post("/api/get-options", findOptions);

    fastify.post("/api/delete-options", deleteOptions);

    /**
     * Site & Service APIs
     */

    fastify.post("/api/update-service", updateService);

    fastify.post("/api/update-pdf", updatePDF);

    /**
     * Conversation API
     */
    fastify.post("/api/conversation", conversation);

    done();
}
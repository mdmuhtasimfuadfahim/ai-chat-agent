import siteService from "../services/site.service.js";
export default class siteController {

    constructor(req, reply) {
        this.req = req;
        this.reply = reply;
    }

    updateService = async () => {
        if (this.req.validationError) {
            const message = [`${this.req.validationError.message}`]
            this.req.validationError.message = message;
            return reply.code(400).send(this.req.validationError);
        }

        const output = new siteService(this.req.body);
        const result = await output.updateService();

        this.reply.status(200).send(result);
    }

    updatePDF = async () => {
        if (this.req.validationError) {
            const message = [`${this.req.validationError.message}`]
            this.req.validationError.message = message;
            return reply.code(400).send(this.req.validationError);
        }
        const output = new siteService(this.req.body);
        const result = await output.updatePDF();

        this.reply.status(200).send(result);
    }
}
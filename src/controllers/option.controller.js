import optionsService from "../services/option.service.js";
export default class optionsController {

    constructor(req, reply) {
        this.req = req;
        this.reply = reply;
    }

    updateOptions = async () => {
        if (this.req.validationError) {
            const message = [`${this.req.validationError.message}`]
            this.req.validationError.message = message;
            return reply.code(400).send(this.req.validationError);
        }

        const output = new optionsService(this.req.body);
        const result = await output.updateOptions();

        this.reply.status(200).send(result);
    }

    findOptions = async () => {
        const output = new optionsService(this.req.body);
        const result = await output.findOptions();

        this.reply.status(200).send(result);
    }

    deleteOptions = async () => {
        const output = new optionsService(this.req.body);
        const result = await output.deleteOptions();

        this.reply.status(200).send(result);
    }
}
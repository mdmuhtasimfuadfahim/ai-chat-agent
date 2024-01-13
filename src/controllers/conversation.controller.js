import conversationService from "../services/conversation.service.js";
export default class conversationController {

    constructor(req, reply) {
        this.req = req;
        this.reply = reply;
    }

    conversation = async () => {
        if (this.req.validationError) {
            const message = [`${this.req.validationError.message}`]
            this.req.validationError.message = message;
            return reply.code(400).send(this.req.validationError);
        }

        const output = new conversationService(this.req.body);
        const result = await output.conversation();

        this.reply.status(200).send(result);
    }
}
import siteService from "../services/site.service.js";
export default class siteController {

    constructor(req, reply) {
        this.req = req;
        this.reply = reply;
    }

    updatePDF = async () => {

        const data = await this.req.file();

        const output = new siteService(data);
        const result = await output.updatePDF();

        this.reply.status(200).send(result);
    }
}
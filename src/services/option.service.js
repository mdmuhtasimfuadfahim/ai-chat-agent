import crypto from "crypto";
import Option from "../models/option.js";

export default class optionsService {

    constructor(data) {
        this.data = data;
    }

    traceCode = () => {
        return crypto.randomBytes(16).toString("hex");
    }

    findOptions = async () => {
        let response = {};
        let message = "Options found successfully !!";

        let result = await Option.find({
            ...this.data.siteId && { siteId: this.data.siteId }
        });

        if (result.length === 0) {
            message = "Couldn't find any options !!"
        }

        response.message = message;
        response.data = result;

        return response;
    }

    createOption = async (data) => {
        const option = new Option(data);
        return await option.save();;
    }

    update = async (siteId, data) => {
        return await Option.findOneAndUpdate({ siteId: siteId }, data, { new: true });
    }

    updateOptions = async () => {
        let response = {};
        let message = "Options updated successfully !!";
        let result;

        const option = await this.findOptions();
        if (!option.data || option.data.length === 0) {
            result = await this.createOption(this.data);
        } else {
            let siteId = this.data.siteId;
            delete this.data.siteId;
            result = await this.update(siteId, this.data);
        }

        if (!result) {
            message = "Error while updating";
        }

        response.message = message;
        response.data = result;
        response.traceCode = this.traceCode();

        return response;
    }

    deleteOptions = async () => {
        let response = {};
        let message = "Options deleted successfully !!";
        let result;

        const option = await this.findOptions();
        if (!option.data || option.data.length === 0) {
            message = option.message;;
        }

        result = await Option.deleteOne({
            siteId: this.data.siteId
        });

        response.message = message;
        response.data = result;
        response.traceCode = this.traceCode();

        return response;
    }
}
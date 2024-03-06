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
        response.traceCode = this.traceCode();
        response.message = "Options found successfully !!";

        let result = await Option.find(
            { ...this.data.siteId && { siteId: this.data.siteId } },
            { _id: 0, __v: 0 }
        );

        if (result.length === 0) {
            response.message = "Couldn't find any options !!";
            return response;
        }

        response.data = result;
        return response;
    }

    createOption = async (data) => {
        const { _id, __v, openAIKey, ...savedOption } = await new Option(data).save().then(o => o.toObject());
        return savedOption;
    }

    update = async (siteId, data) => {
        const { _id, __v, openAIKey, ...updatedOption } = await Option.findOneAndUpdate({ siteId }, data, { new: true }).then(o => o.toObject());
        return updatedOption;
    }

    updateOptions = async () => {
        let response = {};
        response.traceCode = this.traceCode();
        response.message = "Options updated successfully !!";
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
            response.message = "Error while updating / creating";
            return response;
        }

        response.data = result;
        return response;
    }

    deleteOptions = async () => {
        let response = {};
        response.traceCode = this.traceCode();
        response.message = "Options deleted successfully !!";
        let result;

        const option = await this.findOptions();
        if (!option.data || option.data.length === 0) {
            response.message = option.message;
            return response;
        }

        result = await Option.deleteOne({
            siteId: this.data.siteId
        });

        response.data = result;
        return response;
    }
}
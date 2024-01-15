import crypto from "crypto";
import { v4 as uuid } from "uuid";
import { MongoClient } from "mongodb";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MongoDBAtlasVectorSearch } from "langchain/vectorstores/mongodb_atlas";
const mongo_uri = `mongodb+srv://${process.env.MONGODB_USER}:${encodeURIComponent(process.env.MONGODB_PASS)}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}`

const client = new MongoClient(mongo_uri || "");
const namespace = `${process.env.MONGODB_DATABASE}.${process.env.VECTOR_DB}`;
const [dbName, collectionName] = namespace.split(".");
const collection = client.db(dbName).collection(collectionName);
import Site from "../models/site.js";

export default class siteService {

    constructor(data) {
        this.data = data;
    }

    traceCode = () => {
        return crypto.randomBytes(16).toString("hex");
    }

    storeInDB = async () => {
        const service = new Site(this.data);
        return await service.save();
    }

    storeInVectorDB = async () => {
        await MongoDBAtlasVectorSearch.fromTexts(
            [this.data.serviceDataText],
            [
                {
                    id: uuid(),
                    siteId: this.data.siteId,
                    serviceId: this.data.serviceId,
                    tags: this.data.tags,
                    serviceDataJson: this.data.serviceDataJson,
                    categoryId: this.data.categoryId
                }
            ],
            new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
            {
                collection,
                indexName: process.env.INDEX_NAME,
                textKey: process.env.TEXT_KEY,
                embeddingKey: process.env.EMBEDDING_KEY,
            }
        );
        return true;
    }

    updateService = async () => {
        let response = {};
        let message = "Data saved successfully !!";

        // store data to vector db
        const vectorStore = await this.storeInVectorDB();
        if (!vectorStore) {
            message = "Something went wrong when store data in vector db";
        }

        response.traceCode = this.traceCode();
        response.data = vectorStore;
        response.message = message;

        return response;
    }

    updatePDF = async () => {
        let response = {};
        let message = "Data saved successfully !!";

        const storeData = await this.storeInDB();
        if (!storeData) {
            message = "Something went wrong when store data in db";
        }

        response.traceCode = this.traceCode();
        response.data = storeData;
        response.message = message;

        return response;
    }
}
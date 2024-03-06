import fs from "fs";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import crypto from "crypto";
import { v4 as uuid } from "uuid";
import { MongoClient } from "mongodb";
import os from 'os';
import { pipeline } from 'stream';
import { promisify } from 'util';;
import path from 'path';
const pdfParse = require('pdf-parse');
const pipelineAsync = promisify(pipeline);
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MongoDBAtlasVectorSearch } from "langchain/vectorstores/mongodb_atlas";
const mongo_uri = `mongodb+srv://${process.env.MONGODB_USER}:${encodeURIComponent(process.env.MONGODB_PASS)}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}`

const client = new MongoClient(mongo_uri || "");
const namespace = `${process.env.MONGODB_DATABASE}.${process.env.SITE_VECTOR_DB}`;
const [dbName, collectionName] = namespace.split(".");
const collection = client.db(dbName).collection(collectionName);

export default class siteService {

    constructor(data) {
        this.data = data;
    }

    traceCode = () => {
        return crypto.randomBytes(16).toString("hex");
    }

    readPDF = async (fileStream) => {
        const tempFilePath = path.join(os.tmpdir(), uuid());
        await pipelineAsync(fileStream, fs.createWriteStream(tempFilePath));
        const fileData = await fs.promises.readFile(tempFilePath);
        const data = await pdfParse(fileData);
        await fs.promises.unlink(tempFilePath);
        return data.text;
    }

    storeInSiteVector = async (siteDataText) => {
        const { fields } = this.data || {};

        const siteId = fields?.siteId?.value;
        const pdfId = fields?.pdfId?.value;
        const relatedTo = fields?.relatedTo?.value;
        const tags = fields?.tags?.value;
        const categoryId = fields?.categoryId?.value;

        await MongoDBAtlasVectorSearch.fromTexts(
            [siteDataText || ""],
            [
                {
                    id: uuid(),
                    siteId: siteId || "",
                    pdfId: pdfId || "",
                    relatedTo: relatedTo || "",
                    tags: tags ? (typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : [tags]) : [],
                    categoryId: categoryId || ""
                }
            ],
            new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
            {
                collection,
                indexName: process.env.SITE_INDEX_NAME,
                textKey: process.env.SITE_TEXT_KEY,
                embeddingKey: process.env.SITE_EMBEDDING_KEY,
            }
        );

        return true;
    }

    updatePDF = async () => {
        let response = {};
        response.traceCode = this.traceCode();
        response.message = "Data saved successfully !!";

        if (!this.data || !this.data.file || !this.data.filename) {
            response.message = "Something went wrong with uploading your file";
            return response;
        }

        if (!this.data.fields || typeof this.data.fields.siteId?.value !== 'string' || !this.data.fields.siteId.value.trim()) {
            response.message = "Site Id is required and must be a non-empty string";
            return response;
        }

        const siteDataText = await this.readPDF(this.data.file);
        const siteDataTextWithoutBlankLines = siteDataText.replace(/^\s*[\r\n]/gm, '');

        const storeData = await this.storeInSiteVector(siteDataTextWithoutBlankLines);
        if (!storeData) {
            response.message = "Something went wrong when store data in db";
            return;
        }

        response.data = storeData;
        return response;
    }
}
import fs from "fs";
import crypto from "crypto";
import util from "util";
import path from "path";
import { v4 as uuid } from "uuid";
import { MongoClient } from "mongodb";
import { pipeline } from "stream";
const pump = util.promisify(pipeline);
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
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

    storeInSiteVector = async (uniqueName) => {
        let siteDataTextString;
        const { fields } = this.data || {};

        const siteId = fields?.siteId?.value;
        const pdfId = fields?.pdfId?.value;
        const relatedTo = fields?.relatedTo?.value;
        const tags = fields?.tags?.value;
        const categoryId = fields?.categoryId?.value;

        const loader = new PDFLoader(path.resolve('./src/uploads/', uniqueName), {
            splitPages: false,
        });

        const siteDataText = await loader.loadAndSplit();
        if (siteDataText) {
            siteDataText.forEach((doc) => {
                doc.metadata['siteId'] = siteId || "";
            });
            siteDataTextString = siteDataText.map(doc => JSON.stringify(doc));
        }

        await MongoDBAtlasVectorSearch.fromTexts(
            [siteDataTextString || ""],
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
                embeddingKey: process.env.EMBEDDING_KEY,
            }
        );

        return true;
    }

    updatePDF = async () => {
        let response = {};
        response.traceCode = this.traceCode();
        let message = "Data saved successfully !!";

        if (!this.data || !this.data.file || !this.data.filename) {
            message = "Something went wrong with uploading your file";
            response.message = message;
            return response;
        }

        if (!this.data.fields || !this.data.fields.siteId || !this.data.fields.siteId.value) {
            message = "Site Id is required";
            response.message = message;
            return response;
        }

        let uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(this.data?.filename)}`
        await pump(this.data.file, fs.createWriteStream(path.resolve('./src/uploads/', uniqueName)));

        const storeData = await this.storeInSiteVector(uniqueName);
        if (!storeData) {
            message = "Something went wrong when store data in db";
            response.message = message;
            return;
        }

        response.data = storeData;
        response.message = message;

        fs.unlink(path.resolve('./src/uploads/', uniqueName), (err) => {
            if (err) {
                console.error(`Error deleting file: ${err}`);
            } else {
                console.log('File deleted successfully');
            }
        });

        return response;
    }
}
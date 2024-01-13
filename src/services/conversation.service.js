import crypto from "crypto";
import Site from "../models/site.js";
import Option from "../models/option.js";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
import { ChainTool } from "langchain/tools";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { MongoDBAtlasVectorSearch } from "langchain/vectorstores/mongodb_atlas";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";
const mongo_uri = `mongodb+srv://${process.env.MONGODB_USER}:${encodeURIComponent(process.env.MONGODB_PASS)}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}`

const client = new MongoClient(mongo_uri || "");
const namespace = `${process.env.MONGODB_DATABASE}.${process.env.VECTOR_DB}`;
const [dbName, collectionName] = namespace.split(".");
const collection = client.db(dbName).collection(collectionName);
// const model = new ChatOpenAI({
//     openAIApiKey: process.env.OPENAI_API_KEY,
//     temperature: 0,
//     verbose: true
// });

export default class conversationService {

    constructor(data) {
        this.data = data;
    }

    API_KEY = process.env.OPENAI_API_KEY;

    traceCode = () => {
        return crypto.randomBytes(16).toString("hex");
    }

    findOptionData = async () => {
        return await Option.find({
            siteId: this.data.siteId
        });
    }

    findSiteData = async () => {
        return await Site.find({
            siteId: this.data.siteId,
            relatedTo: this.data.serviceId
        });
    }

    connectWithVectorStore = async () => {
        return new MongoDBAtlasVectorSearch(
            new OpenAIEmbeddings({ openAIApiKey: this.API_KEY }), {
            collection,
            indexName: process.env.INDEX_NAME,
            textKey: process.env.TEXT_KEY,
            embeddingKey: process.env.EMBEDDING_KEY,
        });
    }

    chatModel = async () => {
        return new ChatOpenAI({
            openAIApiKey: this.API_KEY,
            temperature: 0,
            verbose: true
        });
    }

    conversation = async () => {
        let response = {};
        let message = 'Got output successfully !!';

        const siteData = await this.findSiteData();
        const optionData = await this.findOptionData();

        if (this.data.openAIKey && this.data.openAIKey !== "") {
            this.API_KEY = this.data.openAIKey;
        }

        const model = await this.chatModel();
        const vectorStore = await this.connectWithVectorStore();

        const chain = ConversationalRetrievalQAChain.fromLLM(
            model,
            vectorStore.asRetriever(1, {
                text: {
                    query: "El123",
                    path: "siteId"
                }
            }),
            {
                memory: new BufferMemory({
                    humanPrefix: `I want you to act by following ${optionData[0].instruction} and your main goal is ${optionData[0].goal} that I am having a conversation with. You will provide me with answers if you find anything from the vectorDB. If you do not find any data regarding question, you will simply return ${optionData[0].invalidQueryMgs} with a conversational way. If the user ask for Human Assistance you will directly return the ${optionData[0].needAssistanceQueryMgs}. Never break character.`,
                    memoryKey: "chat_history",
                }),
            }
        );

        const agentsTool = new ChainTool({
            name: "chatbot addon",
            description: `I want you to act by following ${optionData[0].instruction} and your main goal is ${optionData[0].goal} that I am having a conversation with. You will provide me with answers if you find anything from the vectorDB. If you do not find any data regarding question, you will simply return ${optionData[0].invalidQueryMgs} with a conversational way. If the user ask for Human Assistance you will directly return the ${optionData[0].needAssistanceQueryMgs}. Never break character.`,
            chain: chain,
        });

        const tools = [agentsTool];
        const executor = await initializeAgentExecutorWithOptions(tools, model, {
            agentType: "chat-conversational-react-description",
            handleParsingErrors: true
        });

        const input = this.data.Mgs?.visitorMessage;
        const result = await executor.call({ input });

        response.traceCode = this.traceCode();
        response.data = result;
        response.message = message;

        return response;
    }
}
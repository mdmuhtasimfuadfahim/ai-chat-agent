import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

import { SerpAPI } from "langchain/tools";
import { PlanAndExecuteAgentExecutor } from "langchain/experimental/plan_and_execute";
import { DynamicTool, ChainTool } from "langchain/tools";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { MongoDBAtlasVectorSearch } from "langchain/vectorstores/mongodb_atlas";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { Calculator } from "langchain/tools/calculator";
const mongo_uri = `mongodb+srv://${process.env.MONGODB_USER}:${encodeURIComponent(process.env.MONGODB_PASS)}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}`
mongoose.connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
}).then(() => {
    console.log("MongoDB connected");
});

let name = "Muhtasim"

const client = new MongoClient(mongo_uri || "");
const namespace = `${process.env.MONGODB_DATABASE}.${process.env.VECTOR_DB}`;
const [dbName, collectionName] = namespace.split(".");
const collection = client.db(dbName).collection(collectionName);
const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0,
    verbose: true
});

import Site from "../src/models/site.js";
import Option from "../src/models/option.js";

const option = await Option.find({
    siteId: "El123"
});

const site = await Site.find({
    siteId: "El123",
    relatedTo: "El123"
});


const vectorStore = new MongoDBAtlasVectorSearch(
    new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }), {
    collection,
    indexName: process.env.INDEX_NAME,
    textKey: process.env.TEXT_KEY,
    embeddingKey: process.env.EMBEDDING_KEY,
});

const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorStore.asRetriever(1, {
        text: {
            query: "El123",
            path: "siteId"
        },
        text: {
            query: "El123",
            path: "serviceId"
        }
    }),
    {
        memory: new BufferMemory({
            humanPrefix: `I want you to act by following ${option[0].instruction} and your main goal is ${option[0].goal} that I am having a conversation with. You will provide me with answers if you find anything from the vectorDB otherwise you will reply ${option[0].invalidQueryMgs} with a conversational way. If the user ask for Human Assistance you will directly return the ${option[0].needAssistanceQueryMgs}. Never break character.`,
            memoryKey: "chat_history",
            returnMessages: true
        }),
    }
);

const agentsTool = new ChainTool({
    name: "conversational chatbot",
    description: `I want you to act by following ${option[0].instruction} and your main goal is ${option[0].goal} that I am having a conversation with. You will provide me with answers if you find anything from the vectorDB otherwise you will reply ${option[0].invalidQueryMgs} with a conversational way. If the user ask for Human Assistance you will directly return the ${option[0].needAssistanceQueryMgs}. Never break character.`,
    chain: chain,
});

const tools = [agentsTool];

// const tools = [
//     agentsTool,
//     new SerpAPI(process.env.SERPAPI_API_KEY, {
//         location: "Austin,Texas,United States",
//         hl: "en",
//         gl: "us",
//     }),
//     new Calculator(),
// ];

const executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: "chat-conversational-react-description",
    handleParsingErrors: true
});
// const executor = PlanAndExecuteAgentExecutor.fromLLMAndTools({
//     llm: model,
//     tools,
// });

console.log("Loaded agent.");

const input = `Hi!`;

console.log(`Executing with input "${input}"...`);

const result = await executor.call({ input });

console.log(`Got output ${result.output}`);
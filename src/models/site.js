import mongoose from "mongoose";
import { v4 as uuid } from "uuid";

const siteSchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
        default: () => uuid(), // generate a new UUID for each document
        unique: true,
    },
    siteId: {
        type: String,
        required: true,
    },
    pdfId: {
        type: String,
        required: true,
        trim: true
    },
    relatedTo: {
        type: String,
        trim: true
    },
    tags: {
        type: Array
    },
    categoryId: {
        type: String,
        trim: true
    }
});

export default mongoose.model("Site", siteSchema);
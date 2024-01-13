import mongoose from "mongoose";

const optionSchema = mongoose.Schema({
    siteId: {
        type: String,
        required: true,
        unique: true,
    },
    instruction: {
        type: String,
        trim: true
    },
    goal: {
        type: String,
        trim: true
    },
    conversationScopes: {
        type: String,
        trim: true
    },
    invalidQueryMgs: {
        type: String,
        trim: true
    },
    needAssistanceQueryMgs: {
        type: String,
        trim: true
    }
});

export default mongoose.model("Option", optionSchema);
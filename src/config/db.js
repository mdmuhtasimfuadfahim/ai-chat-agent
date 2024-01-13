import mongoose from "mongoose";

export default function db(fastify, options, done) {
    const mongo_uri = `mongodb+srv://${process.env.MONGODB_USER}:${encodeURIComponent(process.env.MONGODB_PASS)}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}`
    mongoose.connect(mongo_uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
    }).then(() => {
        console.log("MongoDB connected");
    });

    done();
}
import s from "fluent-json-schema";

export default (input) => {
    const schema = s.object()
        .prop("data", s.object()
            .extend(input)
        ).default({})
        .prop("message", s.string()
        ).default("")
        .prop("traceCode", s.string()).default("");
    return schema;
}
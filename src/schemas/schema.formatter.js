import s from "fluent-json-schema";

export default (input) => {
    const schema = s.object()
        .prop("message", s.string().default(""))
        .prop("traceCode", s.string().default(""))
        .prop("data", s.anyOf([
            s.object().additionalProperties(true),
            s.array().items(s.object().additionalProperties(true))
        ]));

    return schema;
}
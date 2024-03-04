import s from "fluent-json-schema";

export default s.object()
    .prop("message", s.string())
    .prop("data", s.anyOf([
        s.object().additionalProperties(true),
        s.array().items(s.object().additionalProperties(true))
    ]))
    .prop("traceCode", s.string());
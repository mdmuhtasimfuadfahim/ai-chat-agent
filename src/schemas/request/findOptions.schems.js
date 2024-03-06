import s from "fluent-json-schema";

export default s.object()
    .prop("siteId", s.string().minLength(1)).required()
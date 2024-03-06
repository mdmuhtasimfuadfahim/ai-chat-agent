import s from "fluent-json-schema";

export default s.object()
    .prop("siteId", s.string().minLength(1)).required()
    .prop("serviceId", s.string().minLength(1)).required()
    .prop("tags", s.array())
    .prop("serviceDataText", s.string())
    .prop("serviceDataJson", s.object())
    .prop("categoryId", s.string());
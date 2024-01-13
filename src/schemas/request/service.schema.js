import s from "fluent-json-schema";

export default s.object()
    .prop("siteId", s.string()).required()
    .prop("serviceId", s.string())
    .prop("tags", s.array())
    .prop("serviceDataText", s.string())
    .prop("serviceDataJson", s.object())
    .prop("categoryId", s.string());
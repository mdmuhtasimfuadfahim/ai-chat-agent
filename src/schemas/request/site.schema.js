import s from "fluent-json-schema";

export default s.object()
    .prop("siteId", s.string()).required()
    .prop("pdfId", s.string()).required()
    .prop("tags", s.array())
    .prop("relatedTo", s.string())
    .prop("categoryId", s.string());
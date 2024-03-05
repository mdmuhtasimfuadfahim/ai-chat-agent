import s from "fluent-json-schema";

const pdfFileNamePattern = /^.*\.(pdf|PDF)$/;
const pdfMimeType = 'application/pdf';

export default s.object()
    .prop("siteId", s.string()).required()
    .prop("pdfId", s.string()).required()
    .prop("tags", s.array())
    .prop("relatedTo", s.string())
    .prop("categoryId", s.string())
    .prop("file", s.array().items(
        s.object()
            .prop("filename", s.string().pattern(pdfFileNamePattern)).required()
            .prop("mimetype", s.string().enum([pdfMimeType])).required()
    )).required();
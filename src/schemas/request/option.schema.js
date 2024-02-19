import s from "fluent-json-schema";

export default s.object()
    .prop("siteId", s.string()).required()
    .prop("instruction", s.string())
    .prop("welcomeMgs", s.string())
    .prop("goal", s.string())
    .prop("conversationScopes", s.string())
    .prop("invalidQueryMgs", s.string())
    .prop("needAssistanceQueryMgs", s.string());
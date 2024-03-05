import s from "fluent-json-schema";

const openAIKeyPattern = /^sk-[a-zA-Z0-9]{32,}$/;

export default s.object()
    .prop("siteId", s.string()).required()
    .prop("openAIKey", s.string().pattern(openAIKeyPattern)).required()
    .prop("instruction", s.string())
    .prop("welcomeMgs", s.string())
    .prop("goal", s.string())
    .prop("conversationScopes", s.string())
    .prop("invalidQueryMgs", s.string())
    .prop("needAssistanceQueryMgs", s.string());
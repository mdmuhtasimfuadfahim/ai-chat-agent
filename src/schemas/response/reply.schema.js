import s from "fluent-json-schema";

export default s.object()
    .prop("content", s.array()
        .items(s.string()).default("")
    ).default([""]);
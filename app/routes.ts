import { type RouteConfig, index } from "@react-router/dev/routes";
import { route } from "@react-router/dev/routes";

export default [
    index("routes/_index.tsx"),
    route("api/telegram/webhook", "routes/api.telegram.webhook.tsx"),
    route("api/stream/:fileId", "routes/api.stream.$fileId.ts"),
] satisfies RouteConfig;

import { createFileRoute } from "@tanstack/react-router";
import { SeraApp } from "@/components/sera-app";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "YZI Admin Command Center — SERA" }, { name: "description", content: "The YZI mediator command center for pool, campaigns, approvals, and audit." }, { property: "og:title", content: "YZI Admin Command Center — SERA" }, { property: "og:description", content: "Control every sensitive recruitment action from one secure desk." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <SeraApp initialPortal="admin" />,
});

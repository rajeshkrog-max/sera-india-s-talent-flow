import { createFileRoute } from "@tanstack/react-router";
import { SeraApp } from "@/components/sera-app";

export const Route = createFileRoute("/candidate")({
  head: () => ({ meta: [{ title: "Candidate Desk — SERA / YZI" }, { name: "description", content: "A safe candidate desk for progressing through matched roles." }, { property: "og:title", content: "Candidate Desk — SERA / YZI" }, { property: "og:description", content: "Review roles, upload documents, and message YZI Admin." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <SeraApp initialPortal="candidate" />,
});

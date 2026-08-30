import { createFileRoute } from "@tanstack/react-router";
import { SeraApp } from "@/components/sera-app";

export const Route = createFileRoute("/recruiter")({
  head: () => ({ meta: [{ title: "Recruiter Desk — SERA / YZI" }, { name: "description", content: "File requirements and review vetted candidates without contact details." }, { property: "og:title", content: "Recruiter Desk — SERA / YZI" }, { property: "og:description", content: "Pool-first recruiting for Eventrics, mediated by YZI." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <SeraApp initialPortal="recruiter" />,
});

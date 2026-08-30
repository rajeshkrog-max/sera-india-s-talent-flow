// CLAUDE: matchPool
export async function matchPool(requirementId: string) {
  return { requirementId, candidates: ["CAND-0417", "CAND-0501"], source: "YZI pool" as const };
}

// CLAUDE: startCampaign
export async function startCampaign(brief: { role: string; city: string; skills: string[] }) {
  return { id: "CMP-014", status: "draft" as const, ...brief };
}

// CLAUDE: sendSpec
export async function sendSpec(candidateId: string, requirementId: string) {
  return { candidateId, requirementId, sent: true };
}

// CLAUDE: shareDocs
export async function shareDocs(candidateId: string) {
  return { candidateId, shared: true };
}

// CLAUDE: confirmEmail
export async function confirmEmail(candidateId: string) {
  return { candidateId, confirmed: true };
}

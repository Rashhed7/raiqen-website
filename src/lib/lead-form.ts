/**
 * Shared lead-form pipeline for the RAIQEN site.
 * Used by both the Contact section form and the Contact popup so every
 * inquiry lands in the same place with the same payload shape.
 *
 * Submissions go to the same-origin `/api/leads` route, which stores the
 * lead in HubSpot CRM (contact + deal). The mailto fallback lives in
 * Contact.tsx and is used only when the API is unavailable.
 */

export interface LeadPayload {
  name: string;
  email: string;
  company: string;
  phone: string;
  service: string;
  message: string;
  timeline: string;
  budget: string;
  source: string;
  page: string;
  submittedAt: string;
}

export function buildLeadPayload(input: {
  name: string;
  email: string;
  company: string;
  phone: string;
  service: string;
  message: string;
  timeline: string;
  budget: string;
}): LeadPayload {
  return {
    ...input,
    source: "RAIQEN Website",
    page: typeof window !== "undefined" ? window.location.pathname : "/",
    submittedAt: new Date().toISOString(),
  };
}

/**
 * Saves a lead via the `/api/leads` route.
 * Throws if the request fails or the server could not store the lead.
 */
export async function submitLead(payload: LeadPayload): Promise<void> {
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Lead API responded with status ${res.status}`);
  }

  // Analytics — dispatch custom event for future integration
  window.dispatchEvent(
    new CustomEvent("lead_form_submitted", { detail: payload })
  );
}
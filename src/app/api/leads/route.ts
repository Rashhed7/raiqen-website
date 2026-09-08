import { NextResponse } from "next/server";

const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN ?? "";
const HUBSPOT_API = "https://api.hubapi.com";

/**
 * Custom contact properties created in the HubSpot portal so the full
 * inquiry survives (service, message, timeline, budget, source).
 */
const CUSTOM_PROPERTIES = [
  { name: "lead_service", label: "Service / Topic", fieldType: "text" },
  { name: "lead_message", label: "Project Details", fieldType: "textarea" },
  { name: "lead_timeline", label: "Timeline", fieldType: "text" },
  { name: "lead_budget", label: "Budget", fieldType: "text" },
  { name: "lead_source", label: "Source", fieldType: "text" },
  { name: "lead_page", label: "Landing Page", fieldType: "text" },
] as const;

interface LeadInput {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  service?: string;
  message?: string;
  timeline?: string;
  budget?: string;
  page?: string;
}

async function hsFetch(
  path: string,
  body: unknown,
  method: "POST" | "PATCH" = "POST"
) {
  const res = await fetch(`${HUBSPOT_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HubSpot ${path} failed (${res.status}): ${text.slice(0, 300)}`);
  }

  return res.json();
}

/** Ensures the custom properties exist. A 409 means they already do. */
async function ensureCustomProperties() {
  for (const prop of CUSTOM_PROPERTIES) {
    try {
      await hsFetch("/crm/v3/properties/contacts", {
        name: prop.name,
        label: prop.label,
        type: "string",
        fieldType: prop.fieldType,
        groupName: "contactinformation",
      });
    } catch (err) {
      if (err instanceof Error && err.message.includes("(409)")) continue;
      throw err;
    }
  }
}

/**
 * Create or update a contact by email.
 * HubSpot returns 409 when a contact with the same email already exists;
 * the error body contains the existing contact's id, so we patch it instead.
 */
async function upsertContact(properties: Record<string, string>) {
  try {
    return await hsFetch("/crm/v3/objects/contacts", { properties });
  } catch (err) {
    if (!(err instanceof Error) || !err.message.includes("(409)")) throw err;

    // HubSpot's 409 body: { message: "Contact already exists. Existing ID: 123" }
    const match = err.message.match(/Existing ID:\s*(\d+)/);
    if (!match) throw err;

    return hsFetch(
      `/crm/v3/objects/contacts/${match[1]}`,
      { properties },
      "PATCH"
    );
  }
}

function splitName(fullName: string): [string, string] {
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0] ?? "";
  const last = parts.slice(1).join(" ");
  return [first, last];
}

export async function POST(request: Request) {
  if (!HUBSPOT_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: "HubSpot is not configured on the server." },
      { status: 500 }
    );
  }

  let input: LeadInput;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = String(input.name ?? "").trim();
  const email = String(input.email ?? "").trim();

  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required." },
      { status: 400 }
    );
  }

  const [firstname, lastname] = splitName(name);

  try {
    await ensureCustomProperties();

    const contact = await upsertContact({
      email,
      firstname,
      lastname,
      company: String(input.company ?? "").trim(),
      phone: String(input.phone ?? "").trim(),
      lifecyclestage: "lead",
      hs_lead_status: "NEW",
      lead_service: String(input.service ?? "").trim(),
      lead_message: String(input.message ?? "").trim(),
      lead_timeline: String(input.timeline ?? "").trim(),
      lead_budget: String(input.budget ?? "").trim(),
      lead_source: "RAIQEN Website",
      lead_page: String(input.page ?? "/").trim(),
    });
    const contactId: string = contact.id;

    // Create a deal so the lead appears in the qualification pipeline.
    // Tolerated failures — the contact itself is already saved.
    try {
      const deal = await hsFetch("/crm/v3/objects/deals", {
        properties: {
          dealname: `${name} — ${String(input.service ?? "Website lead").trim()}`,
        },
      });
      const dealId: string = deal.id;

      await hsFetch("/crm/v3/associations/deal/contact/batch/create", {
        inputs: [
          {
            from: { id: dealId },
            to: { id: contactId },
            type: "deal_to_contact",
          },
        ],
      });
    } catch (err) {
      console.error("HubSpot deal creation failed (contact was saved):", err);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("HubSpot lead save error:", err);
    return NextResponse.json(
      { error: "Failed to save the lead." },
      { status: 500 }
    );
  }
}
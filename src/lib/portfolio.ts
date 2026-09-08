/**
 * Real, delivered client work — edit this file to add or update projects.
 * Every entry here ships with the "Selected Work" section on the homepage.
 */

export interface WorkProject {
  title: string;
  client: string;
  /** Product category, e.g. "Restaurant Management" */
  category: string;
  /** Domain tags shown as small chips */
  tags: string[];
  /** One-sentence outcome-oriented description */
  desc: string;
  /** What the system does — keep to 3 short lines */
  points: string[];
  /** Short industry label used for the meta row */
  industry: string;
}

export const PROJECTS: WorkProject[] = [
  {
    title: "Restaurant Manager",
    client: "SUKOON Cafe",
    category: "Restaurant Management",
    tags: ["Web App", "Operations", "Dashboard"],
    desc: "A complete management system for daily cafe operations — orders, menu and reporting in one place.",
    points: [
      "Order and menu management",
      "Operational dashboards",
      "Role-based access for staff",
    ],
    industry: "Hospitality",
  },
  {
    title: "E-Commerce Platform",
    client: "Kathraz Fragrances",
    category: "E-Commerce",
    tags: ["Online Store", "Payments", "Catalog"],
    desc: "A fragrance storefront built to convert — catalog, cart and checkout engineered end to end.",
    points: [
      "Product catalog and search",
      "Cart and secure checkout",
      "Order management workflow",
    ],
    industry: "Retail",
  },
  {
    title: "DLT Services Platform",
    client: "Biz Companion",
    category: "Regulatory Tech",
    tags: ["DLT", "Compliance", "Portal"],
    desc: "A services platform that simplifies DLT registration and compliance for businesses.",
    points: [
      "Service catalog and intake",
      "Application tracking",
      "Client communication built in",
    ],
    industry: "Business Services",
  },
  {
    title: "AI Interview Pro",
    client: "RAIQEN Labs",
    category: "AI Product",
    tags: ["AI", "Agents", "Assessment"],
    desc: "An AI-driven interview platform that conducts, scores and evaluates candidate sessions.",
    points: [
      "AI-conducted interviews",
      "Automated scoring and reports",
      "Candidate performance analytics",
    ],
    industry: "AI / HR Tech",
  },
  {
    title: "AI Perfume Workflow",
    client: "Kathraz Perfume",
    category: "AI Automation",
    tags: ["AI Workflow", "Automation", "Ops"],
    desc: "An intelligent workflow that automates recurring operations for the perfume business.",
    points: [
      "Automated recurring tasks",
      "AI-assisted decisions",
      "Integrated business tools",
    ],
    industry: "Retail",
  },
  {
    title: "AI Lead Generation",
    client: "Solar Panel Initiator",
    category: "AI Workflow",
    tags: ["AI Workflow", "Lead Gen", "Sales"],
    desc: "A lead-generation website paired with an AI workflow that captures and qualifies solar inquiries.",
    points: [
      "AI-qualified lead capture",
      "Automated follow-up flow",
      "Lead dashboard for the sales team",
    ],
    industry: "Renewables",
  },
];

/** Derived, honest counts — used in the Selected Work meta band. */
export const WORK_STATS = {
  projects: PROJECTS.length,
  industries: [...new Set(PROJECTS.map((p) => p.industry))].length,
  clients: [...new Set(PROJECTS.map((p) => p.client))].length,
};

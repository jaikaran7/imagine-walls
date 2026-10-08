import { generateId } from "@/lib/admin/id";
import type { MaterialSpec } from "@/lib/admin/types";

/** Studio default, matching the printed material specification sheet. */
export const STANDARD_MATERIAL_SPECS: ReadonlyArray<Pick<MaterialSpec, "material" | "specification">> = [
  { material: "PLYWOOD", specification: "BWP 710 GRADE PLAMA GOLD" },
  {
    material: "LAMINATE",
    specification: "ACRYLIC FOR KITCHEN\nHIGH GLOSSY FOR CROCKERY\nMICA FOR REMAINING WOOD WORK",
  },
  { material: "CARCASS COLOUR", specification: "FABRIC FINISH" },
  { material: "HINGES", specification: "NIMMI" },
  { material: "CHANNELS", specification: "NIMMI" },
  {
    material: "PVC EDGE BINDING",
    specification: "MATCHING WITH SHUTTER COLOUR WITH\n1.3MM THICKNESS AS LAMINATE FINISH",
  },
  { material: "BACK PANEL", specification: "9MM THICKNESS AND 12MM AS REQUIRED" },
  { material: "ELECTRICAL", specification: "POLYCAB OR FINOLEX 1MM OR 1.5MM AS PER REQ" },
];

export function standardMaterialSpecs(): MaterialSpec[] {
  return STANDARD_MATERIAL_SPECS.map((row) => ({
    id: generateId("mat"),
    material: row.material,
    specification: row.specification,
  }));
}

export function emptyMaterialSpec(): MaterialSpec {
  return { id: generateId("mat"), material: "", specification: "" };
}

export function normalizeMaterialSpecs(value: unknown): MaterialSpec[] {
  if (!Array.isArray(value)) return [];
  const rows: MaterialSpec[] = [];
  for (const row of value) {
    if (!row || typeof row !== "object") continue;
    const record = row as Record<string, unknown>;
    const material = String(record.material || "").trim();
    const specification = String(record.specification || "").trim();
    if (!material && !specification) continue;
    rows.push({
      id: String(record.id || generateId("mat")),
      material,
      specification,
    });
  }
  return rows;
}

export function materialSpecsMatchStandard(rows: MaterialSpec[]): boolean {
  if (rows.length !== STANDARD_MATERIAL_SPECS.length) return false;
  return rows.every(
    (row, index) =>
      row.material.trim() === STANDARD_MATERIAL_SPECS[index]?.material &&
      row.specification.trim() === STANDARD_MATERIAL_SPECS[index]?.specification,
  );
}

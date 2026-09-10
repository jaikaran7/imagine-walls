-- Remap project services_involved / category labels to the four Imagine Walls services.
-- Old labels: Modular Kitchen, Bedroom & Wardrobe, TV Units & Feature Walls, False Ceiling & Lighting, etc.

UPDATE admin_projects
SET category = CASE category
  WHEN 'Modular Kitchen' THEN 'Kitchens & Custom Joinery'
  WHEN 'Bedroom & Wardrobe' THEN 'Kitchens & Custom Joinery'
  WHEN 'TV Units & Feature Walls' THEN 'Residential Interiors'
  ELSE category
END
WHERE category IN ('Modular Kitchen', 'Bedroom & Wardrobe', 'TV Units & Feature Walls');

UPDATE admin_projects
SET services_involved = (
  SELECT COALESCE(jsonb_agg(DISTINCT remapped), '[]'::jsonb)
  FROM jsonb_array_elements_text(COALESCE(services_involved, '[]'::jsonb)) AS old_label(val)
  CROSS JOIN LATERAL (
    SELECT CASE trim(old_label.val)
      WHEN 'Modular Kitchens' THEN 'Kitchens & Custom Joinery'
      WHEN 'Modular Kitchen' THEN 'Kitchens & Custom Joinery'
      WHEN 'Bedrooms & Wardrobes' THEN 'Kitchens & Custom Joinery'
      WHEN 'Bedroom & Wardrobe' THEN 'Kitchens & Custom Joinery'
      WHEN 'TV Units & Feature Walls' THEN 'Kitchens & Custom Joinery'
      WHEN 'False Ceiling & Lighting' THEN 'Lighting & Architectural Details'
      WHEN 'Hospitality & Specialty' THEN 'Commercial Interiors'
      ELSE trim(old_label.val)
    END AS remapped
  ) map
)
WHERE services_involved IS NOT NULL
  AND services_involved <> '[]'::jsonb;

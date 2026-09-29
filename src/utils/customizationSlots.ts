export interface CustomizationSlotConfig {
    name: string;
    slug: string;
  }
  
  // This list must mirror whatever customization groups the frontend
  // expects to exist (by slug). Add a new entry here when the frontend
  // adds a new customization type — nothing else needs to change.
  export const CUSTOMIZATION_SLOTS: CustomizationSlotConfig[] = [
    { name: "Latest Collections", slug: "latest-collections" },
    { name: "Color", slug: "color" },
    { name: "Material", slug: "material" },
  ];
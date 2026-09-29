export interface CustomizationDefinition {
    name: string;
    slug: string;
    description: string;
    sortOrder: number;
  }
  
  export const CUSTOMIZATION_DEFINITIONS = {
    latestCollection: {
      name: "Latest Collection",
      slug: "latest-collection",
      description: "Options used for the latest collection customization.",
      sortOrder: 0,
    },
  
    gallery: {
      name: "Gallery",
      slug: "gallery",
      description: "Options used for gallery customization.",
      sortOrder: 1,
    },
  
    materials: {
      name: "Materials",
      slug: "materials",
      description: "Materials available for custom orders.",
      sortOrder: 2,
    },
  
    soles: {
      name: "Soles",
      slug: "soles",
      description: "Sole options available for custom orders.",
      sortOrder: 3,
    },
  
    colours: {
      name: "Colours",
      slug: "colours",
      description: "Colour options available for custom orders.",
      sortOrder: 4,
    },
  } satisfies Record<string, CustomizationDefinition>;
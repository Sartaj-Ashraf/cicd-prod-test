
export const queryKeys = {
    auth: {
        me: ["auth", "me"] as const,
        session: ["auth", "session"] as const
    },
    pricing: {
        active: ["pricing", "active"] as const
    },
    subscription: {
        my: ["subscription", "my"] as const,
        active: ["subscription", "active"] as const,
    },
    location: {
        all: ["location", "all"] as const,
        single: (id: string) => ["location", id] as const,
    },
      manager: {
    all: ["manager", "all"] as const,

    byLocation: (locationId: string) =>
      ["manager", "location", locationId] as const,

    single: (id: string) => ["manager", "single", id] as const,

    invites: (locationId: string) =>
      ["manager", "invites", locationId] as const,
  },
  analytics: {
    data: (placeId: string, locationId: string) =>
      ["analytics", "data", placeId, locationId] as const,
     location: (locationId: string) =>
            ["analytics", "location", locationId] as const,
  }, 
  gbp:{
    connection:["gbpConnection"]
  },  
  credits: {
    all: ["credits"] as const,
  },
}
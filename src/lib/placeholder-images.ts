
export type PlaceholderInfo = {
    url: string;
    hint: string;
};

const placeholderData: Record<string, PlaceholderInfo> = {
    Dog: { 
        url: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        hint: "dog"
    },
    Cat: {
        url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2043&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        hint: "cat"
    },
    Rabbit: {
        url: "https://images.unsplash.com/photo-1591325021237-52d3f33fb855?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        hint: "Rabbit"
    },
    Bird: {
        url: "https://images.unsplash.com/photo-1552728089-57bdde3e70a5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        hint: "bird colorful"
    },
    Fish: {
        url: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=1912&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        hint: "fish clownfish"
    },
    Turtle: {
        url: "https://images.unsplash.com/photo-1582209802222-4b28165a6a43?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        hint: "turtle water"
    },
    Default: {
        url: "https://images.unsplash.com/photo-1601758174811-a04aad8f2245?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHx3b21hbiUyMGRvZ3xlbnwwfHx8fDE3NTkxMTc0MjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
        hint: "pet animal"
    }
};

export function getPlaceholderImage(petType: string): PlaceholderInfo {
    const cleanTypeName = petType.replace(/\s/g, '');
    return placeholderData[cleanTypeName] || placeholderData.Default;
}

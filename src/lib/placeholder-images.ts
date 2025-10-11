
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
    Default: {
        url: "https://images.unsplash.com/photo-1521911528923-9c3838123490?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
        hint: "pet"
    }
};

export function getPlaceholderImage(petType: string): PlaceholderInfo {
    const cleanTypeName = petType.replace(/\s/g, '');
    return placeholderData[cleanTypeName] || placeholderData.Default;
}

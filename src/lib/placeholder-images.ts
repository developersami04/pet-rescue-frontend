
export type PlaceholderInfo = {
    url: string;
    hint: string;
};

const placeholderData: Record<string, PlaceholderInfo> = {
    Dog: { 
        url: "https://res.cloudinary.com/dev-supriya/image/upload/v1760537655/dog_pgxyim.jpg",
        hint: "dog"
    },
    Cat: {
        url: "https://res.cloudinary.com/dev-supriya/image/upload/v1760537689/cat_placeholder_xhkqao.jpg",
        hint: "cat"
    },
    Default: {
        url: "https://images.unsplash.com/photo-1521911528923-9c3838123490?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
        hint: "pet"
    }
};

export function getPlaceholderImage(petType: string): PlaceholderInfo {
    
    return placeholderData[petType]   || placeholderData.Default;
}


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
    Other: {
        url: "https://res.cloudinary.com/dev-supriya/image/upload/v1760539781/Others_pet_type_s7ifxv.webp",
        hint: "other"
    },
    Default: {
        url: "https://res.cloudinary.com/dev-supriya/image/upload/v1760539781/Others_pet_type_s7ifxv.webp",
        hint: "pet"
    }
};

export function getPlaceholderImage(petType: string): PlaceholderInfo {
    
    return placeholderData[petType] || placeholderData.Default;
}

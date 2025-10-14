export const defaultUserProfileImages = [
    'https://res.cloudinary.com/dev-supriya/image/upload/v1760089194/avatar_4mkr6.jpg',

  ];
  
  export function getRandomDefaultProfileImage(seed: string | number): string {
    const seedAsNumber = typeof seed === 'string' ? 
        seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : seed;

    if (defaultUserProfileImages.length === 0) {
      return 'https://res.cloudinary.com/dev-supriya/image/upload/v1760089194/avatar_m4mkr6.jpg';
    }
    const index = seedAsNumber % defaultUserProfileImages.length;
    return defaultUserProfileImages[index];
  }
  
export const defaultUserProfileImages = [
    'https://picsum.photos/seed/user1/200/200',
    'https://picsum.photos/seed/user2/200/200',
    'https://picsum.photos/seed/user3/200/200',
    'https://picsum.photos/seed/user4/200/200',
    'https://picsum.photos/seed/user5/200/200',
  ];
  
  export function getRandomDefaultProfileImage(seed: string | number): string {
    const seedAsNumber = typeof seed === 'string' ? 
        seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : seed;

    if (defaultUserProfileImages.length === 0) {
      return 'https://picsum.photos/200';
    }
    const index = seedAsNumber % defaultUserProfileImages.length;
    return defaultUserProfileImages[index];
  }
  
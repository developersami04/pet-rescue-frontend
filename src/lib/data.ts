

export type Pet = {
  id: number;
  image: string | null;
  name: string;
  description: string | null;
  pet_type: number;
  type_name: string;
  available_for_adopt: boolean;
  gender: 'Male' | 'Female';
  age: number | null;
  weight: number | null;
  breed: string | null;
  color: string | null;
  is_vaccinated: boolean;
  is_diseased: boolean;
  address: string | null;
  city: string | null;
  pincode: number | null;
  state: string | null;
  is_verified: boolean;
  created_by: number | null;
  created_date: string;
  modified_by: string | null;
  modified_date: string;
};


export type Organization = {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    state: string;
  };
};

export type Resource = {
  id: string;
  title: string;
  content: string;
};

export type User = {
  id: number;
  profile_image: string | null;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
  phone_no: string | null;
  gender?: 'Male' | 'Female';
  pin_code: number | null;
  address: string | null;
};


// This is now fetched from the API, but we keep it for reference or fallback.
export const pets: Pet[] = [];


export const organizations: Organization[] = [];

export const resources: Resource[] = [
    {
      id: 'res1',
      title: 'Bringing Your New Dog Home',
      content: 'The first few days in a new home can be stressful for a dog. It\'s important to be patient and understanding. Start by setting up a designated "safe space" for your new pet, like a crate or a quiet room. Introduce them to other family members and pets slowly and under supervision. Establish a routine for feeding, walks, and potty breaks as soon as possible to help them feel secure.',
    },
    {
      id: 'res2',
      title: 'Choosing the Right Food for Your Cat',
      content: 'A cat\'s nutritional needs change throughout their life. Kittens need food high in protein and fat for growth, while senior cats may need fewer calories to maintain a healthy weight. Look for foods that list a specific meat (like chicken or salmon) as the first ingredient. Both wet and dry food have their benefits; many owners choose to feed a combination of both. Always consult with your vet to determine the best diet for your specific cat.',
    },
    {
      id: 'res3',
      title: 'Socializing Your Puppy',
      content: 'Socialization is crucial for raising a well-behaved, confident dog. The primary socialization window is between 3 and 16 weeks of age. During this time, expose your puppy to a wide variety of sights, sounds, people, and other vaccinated, friendly dogs. Positive experiences are key. Puppy training classes are a great way to socialize your dog in a safe and structured environment.',
    },
    {
      id: 'res4',
      title: 'Common Household Dangers for Pets',
      content: 'Many common household items can be toxic to pets. These include certain plants (like lilies and tulips), human foods (like chocolate, grapes, onions, and xylitol), and cleaning products. Keep all chemicals and medications securely stored out of reach. Be mindful of electrical cords and small objects that could be choking hazards. Pet-proofing your home is an essential step in responsible pet ownership.',
    },
];




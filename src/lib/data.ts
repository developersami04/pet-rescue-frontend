export type Pet = {
  id: string;
  name: string;
  type: 'Dog' | 'Cat' | 'Bird';
  breed: string;
  age: number;
  size: 'Small' | 'Medium' | 'Large';
  gender: 'Male' | 'Female';
  description: string;
  imageIds: string[];
  organizationId: string;
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

export const pets: Pet[] = [
  {
    id: '1',
    name: 'Buddy',
    type: 'Dog',
    breed: 'Golden Retriever',
    age: 2,
    size: 'Large',
    gender: 'Male',
    description: 'Buddy is a friendly and energetic Golden Retriever who loves to play fetch. He is great with kids and other dogs. He is looking for a loving family to give him the attention and exercise he needs.',
    imageIds: ['pet-buddy'],
    organizationId: 'org1',
  },
  {
    id: '2',
    name: 'Lucy',
    type: 'Dog',
    breed: 'Beagle',
    age: 4,
    size: 'Medium',
    gender: 'Female',
    description: 'Lucy is a sweet and curious Beagle. She has a great sense of smell and loves to explore. She is house-trained and knows basic commands.',
    imageIds: ['pet-lucy'],
    organizationId: 'org2',
  },
  {
    id: '3',
    name: 'Max',
    type: 'Dog',
    breed: 'German Shepherd',
    age: 1,
    size: 'Large',
    gender: 'Male',
    description: 'Max is a loyal and intelligent German Shepherd puppy. He is very trainable and eager to please. He would do well in a home with an experienced dog owner.',
    imageIds: ['pet-max'],
    organizationId: 'org1',
  },
  {
    id: '4',
    name: 'Luna',
    type: 'Cat',
    breed: 'Siamese',
    age: 3,
    size: 'Small',
    gender: 'Female',
    description: 'Luna is a beautiful and vocal Siamese cat. She loves to be the center of attention and will happily chat with you all day. She prefers a quiet home.',
    imageIds: ['pet-luna'],
    organizationId: 'org3',
  },
  {
    id: '5',
    name: 'Milo',
    type: 'Cat',
    breed: 'Tabby',
    age: 5,
    size: 'Medium',
    gender: 'Male',
    description: 'Milo is a laid-back and affectionate Tabby. His favorite activities include napping in sunbeams and getting head scratches. He is good with other cats.',
    imageIds: ['pet-milo'],
    organizationId: 'org2',
  },
  {
    id: '6',
    name: 'Bella',
    type: 'Cat',
    breed: 'Maine Coon',
    age: 1,
    size: 'Large',
    gender: 'Female',
    description: 'Bella is a gentle giant. This fluffy Maine Coon is playful and sweet. She enjoys being brushed and is very sociable.',
    imageIds: ['pet-bella'],
    organizationId: 'org1',
  },
  {
    id: '7',
    name: 'Kiwi',
    type: 'Bird',
    breed: 'Parrot',
    age: 10,
    size: 'Small',
    gender: 'Male',
    description: 'Kiwi is a colorful and talkative parrot. He can mimic a variety of sounds and loves to be around people. He requires an owner familiar with birds.',
    imageIds: ['pet-kiwi'],
    organizationId: 'org3',
  },
  {
    id: '8',
    name: 'Daisy',
    type: 'Dog',
    breed: 'Terrier Mix',
    age: 6,
    size: 'Small',
    gender: 'Female',
    description: 'Daisy is a spunky and loving terrier mix. She has a lot of energy for a small dog and loves walks and playing with toys. She would be a great companion for an active individual or family.',
    imageIds: ['pet-daisy'],
    organizationId: 'org2',
  },
  {
    id: '9',
    name: 'Smokey',
    type: 'Cat',
    breed: 'Domestic Shorthair',
    age: 2,
    size: 'Medium',
    gender: 'Male',
    description: 'Smokey is a handsome grey cat with a sleek coat. He can be a little shy at first but is very sweet and cuddly once he warms up to you. He would prefer a calm and patient owner.',
    imageIds: ['pet-smokey'],
    organizationId: 'org1',
  },
  {
    id: '10',
    name: 'Rocky',
    type: 'Dog',
    breed: 'Boxer',
    age: 3,
    size: 'Large',
    gender: 'Male',
    description: 'Rocky is a goofy and playful Boxer with a heart of gold. He is full of energy and loves to run and play. He is very friendly with people and other dogs.',
    imageIds: ['pet-rocky'],
    organizationId: 'org3',
  },
];

export const organizations: Organization[] = [
  {
    id: 'org1',
    name: 'Happy Paws Rescue',
    location: { lat: 19.0760, lng: 72.8777, state: "Maharashtra" },
  },
  {
    id: 'org2',
    name: 'Second Chance Shelter',
    location: { lat: 28.6139, lng: 77.2090, state: "Delhi" },
  },
  {
    id: 'org3',
    name: 'Furry Friends Foundation',
    location: { lat: 12.9716, lng: 77.5946, state: "Karnataka" },
  },
];

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

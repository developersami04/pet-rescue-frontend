
export type MedicalHistory = {
    id: number;
    pet: number;
    pet_name: string;
    disease_name: string | null;
    stage: string | null;
    no_of_years: number | null;
    vaccination_name: string | null;
    last_vaccinated_date: string | null;
    note: string | null;
    created_by: number;
    modified_by: number | null;
};

export type AdoptionRequest = {
    id: number;
    pet: number;
    pet_name: string;
    pet_image: string | null;
    message: string;
    status: 'pending' | 'approved' | 'rejected';
    report_status?: 'pending' | 'approved' | 'rejected';
    requester_id: number;
    requester_profile_image: string | null;
    requester_name: string;
    owner_id: number;
    owner_name: string;
    created_at: string;
};

export type MyAdoptionRequest = {
    id: number;
    pet: number;
    pet_name: string;
    owner_name: string;
    requester_id: number;
    requester_name: string;
    created_at: string;
    message: string;
    status: 'pending' | 'approved' | 'rejected';
    pet_image?: string | null;
}


export type PetReport = {
    id: number;
    pet: number;
    report_image: string | null;
    pet_name: string;
    pet_status: 'lost' | 'found' | 'adopt';
    message: string;
    reporter_name: string;
    report_status: string;
    is_resolved: boolean;
};

export type AdminPetReport = {
    id: number;
    image: string | null;
    pet_name: string;
    pet_id: number;
    pet_type_name: string;
    pet_status: 'lost' | 'found' | 'adopt';
    created_by_username: string;
    created_at: string;
    report_status: 'pending' | 'approved' | 'rejected';
};

export type Pet = {
  id: number;
  pet_image: string | null;
  name: string;
  description: string | null;
  type_name: string;
  gender: 'Male' | 'Female' | 'Unknown';
  age: number | null;
  weight: number | null;
  breed: string | null;
  color: string | null;
  is_vaccinated: boolean;
  is_diseased: boolean;
  is_verified?: boolean; // This field is not in the new pet profile response
  address: string | null;
  city: string | null;
  pincode: number | null;
  state: string | null;
  created_by: number;
  created_at: string;
  modified_by: number | null;
  modified_at: string;
  medical_history: MedicalHistory | null;
  adoption_requests: AdoptionRequest[] | null;
  pet_report: PetReport | null;
  available_for_adopt?: boolean; // Keep for pet list card, but profile page will use pet_report.pet_status
};

export type FavoritePet = {
  id: number;
  pet_id: number;
  pet_name: string;
  pet_image: string | null;
  created_at: string;
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
  full_name?: string;
  is_verified: boolean;
  phone_no: string | null;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer Not To Say';
  pin_code: number | null;
  address: string | null;
  city: string | null;
  state: string | null;
  is_staff: boolean;
  is_admin: boolean;
};

export type RegisteredUser = {
  id: number;
  profile_image: string | null;
  username: string;
  email: string;
  is_verified: boolean;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
};


export type UnverifiedUser = {
    id: number;
    profile_image: string | null;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    date_joined: string;
};


export type Notification = {
  id: number;
  message: string;
  created_at: string;
  is_read: boolean;
  pet_id: number;
  pet_name: string;
  pet_image: string | null;
  pet_status: 'lost' | 'found' | 'adoptable' | 'adoption-request';
};

export type UserStory = {
  id: number;
  title: string;
  user: number;
  user_image: string | null;
  username: string;
  pet: number;
  pet_image: string | null;
  content: string;
  created_at: string;
  modified_at: string;
};

export type HomeUserStory = {
    id: number;
    title: string;
    content: string;
    created_at: string;
    pet_name: string;
    pet_image: string | null;
    pet_type: string;
    user_name: string;
    user_image: string | null;
}


// This is now fetched from the API, but we keep it for reference or fallback.
export const pets: Pet[] = [];


export const organizations: Organization[] = [];

export const resources: Resource[] = [
  {
    id: 'pet1',
    title: 'Dogs Dream Like Humans',
    content: 'Just like humans, dogs experience REM sleep, the stage where dreams occur. You might notice their paws twitching or soft barking while they dream.'
  },
  {
    id: 'pet2',
    title: 'Cats Have a Special Purr Frequency',
    content: 'A cat\'s purr vibrates at a frequency between 25 and 150 Hertz, which has been shown to promote healing in bones and tissues.'
  },
  {
    id: 'pet3',
    title: 'Goldfish Have Good Memories',
    content: 'Contrary to the myth, goldfish have a memory span of months, not seconds, and can even recognize their owners.'
  },
  {
    id: 'pet4',
    title: 'Dogs Can Smell Human Emotions',
    content: 'Dogs can detect subtle changes in your scent, allowing them to sense emotions like fear, happiness, or sadness.'
  },
  {
    id: 'pet5',
    title: 'Cats Use Their Whiskers for Navigation',
    content: 'Whiskers help cats measure the width of openings and detect changes in air currents, aiding them in the dark.'
  },
  {
    id: 'pet6',
    title: 'Parrots Can Live for Decades',
    content: 'Some parrot species, like African Greys, can live 50 years or more when properly cared for.'
  },
  {
    id: 'pet7',
    title: 'Rabbits Can See Behind Them',
    content: 'Rabbits\' wide-set eyes give them nearly 360-degree vision, helping them detect predators easily.'
  },
  {
    id: 'pet8',
    title: 'Dogs Sweat Through Their Paws',
    content: 'Dogs don\'t sweat through their skin like humans; instead, they release heat through their paw pads and by panting.'
  },
  {
    id: 'pet9',
    title: 'Cats Walk Like Camels and Giraffes',
    content: 'Cats move both right legs first, then both left legs, just like camels and giraffes — a unique gait in the animal world.'
  },
  {
    id: 'pet10',
    title: 'Hamsters Hoard Food in Their Cheeks',
    content: 'Hamsters have expandable cheek pouches that can carry large amounts of food to store in their burrows.'
  },
  {
    id: 'pet11',
    title: 'Turtles Can Breathe Through Their Butts',
    content: 'During hibernation, some turtles use a process called cloacal respiration to absorb oxygen through their rear ends.'
  },
  {
    id: 'pet12',
    title: 'Dogs Can Learn Over 1000 Words',
    content: 'Highly intelligent dogs, like Border Collies, can recognize and respond to hundreds of verbal commands.'
  },
  {
    id: 'pet13',
    title: 'Cats Use Tail Movements to Communicate',
    content: 'A flicking tail can signal irritation, while a raised tail often indicates friendliness and comfort.'
  },
  {
    id: 'pet14',
    title: 'Fish Can Recognize Their Owners',
    content: 'Studies show that some fish can distinguish human faces and react differently to their owners.'
  },
  {
    id: 'pet15',
    title: 'Guinea Pigs Are Very Social',
    content: 'Guinea pigs thrive in pairs or groups and can become depressed when kept alone.'
  },
  {
    id: 'pet16',
    title: 'Dogs’ Noses Are Wet for a Reason',
    content: 'A moist nose helps dogs absorb scent chemicals, enhancing their already powerful sense of smell.'
  },
  {
    id: 'pet17',
    title: 'Cats Can Jump Six Times Their Height',
    content: 'With strong hind leg muscles, cats are incredible jumpers capable of reaching high places effortlessly.'
  },
  {
    id: 'pet18',
    title: 'Birds Can See Ultraviolet Light',
    content: 'Many pet birds can see UV light, revealing colors and patterns invisible to the human eye.'
  },
  {
    id: 'pet19',
    title: 'Ferrets Sleep Up to 18 Hours a Day',
    content: 'Ferrets are playful when awake but spend most of their time napping, especially in cozy, dark spaces.'
  },
  {
    id: 'pet20',
    title: 'Dogs Can Detect Diseases',
    content: 'Trained dogs can detect diseases like cancer or diabetes by sensing chemical changes in human breath or sweat.'
  },
  {
    id: 'pet21',
    title: 'Cats Have Unique Nose Prints',
    content: 'Just like human fingerprints, every cat has a unique pattern on its nose.'
  },
  {
    id: 'pet22',
    title: 'Some Lizards Drop Their Tails to Escape',
    content: 'Lizards like geckos can shed their tails to distract predators, and the tail will regrow over time.'
  },
  {
    id: 'pet23',
    title: 'Dogs Have a “Second Nose”',
    content: 'The Jacobson\'s organ in a dog\'s nasal cavity helps detect pheromones and chemical cues undetectable to humans.'
  },
  {
    id: 'pet24',
    title: 'Cats Can Make Over 100 Sounds',
    content: 'While dogs mainly bark and growl, cats can make more than 100 distinct vocalizations.'
  },
  {
    id: 'pet25',
    title: 'Birds Need Mental Stimulation',
    content: 'Intelligent birds like parrots require daily enrichment and puzzles to prevent boredom and stress.'
  },
  {
    id: 'pet26',
    title: 'Dogs Can Sense Time',
    content: 'Dogs can pick up on routines and even anticipate events like feeding time or their owner’s arrival.'
  },
  {
    id: 'pet27',
    title: 'Cats Can Survive Falls from Great Heights',
    content: 'Thanks to their righting reflex, cats often land on their feet and survive falls that would harm other animals.'
  },
  {
    id: 'pet28',
    title: 'Some Turtles Can Live Over 100 Years',
    content: 'Certain turtle species can live for more than a century, making them one of the longest-living pets.'
  },
  {
    id: 'pet29',
    title: 'Dogs’ Hearing Is Four Times Better Than Ours',
    content: 'Dogs can hear frequencies as high as 65,000 Hz, compared to humans who hear up to 20,000 Hz.'
  },
  {
    id: 'pet30',
    title: 'Cats Groom to Show Affection',
    content: 'When cats lick each other—or you—it’s a bonding behavior that shows trust and affection.'
  },
  {
    id: 'pet31',
    title: 'Snakes Smell With Their Tongues',
    content: 'Snakes flick their tongues to collect scent particles and transfer them to a special organ in their mouths.'
  },
  {
    id: 'pet32',
    title: 'Dogs Have Three Eyelids',
    content: 'A third eyelid, called the nictitating membrane, helps protect and lubricate a dog’s eyes.'
  },
  {
    id: 'pet33',
    title: 'Cats Can’t Taste Sweetness',
    content: 'Unlike humans and dogs, cats lack taste receptors for sweetness.'
  },
  {
    id: 'pet34',
    title: 'Birds Can Recognize Music',
    content: 'Some birds bob their heads or dance to rhythms, showing an understanding of musical tempo.'
  },
  {
    id: 'pet35',
    title: 'Dogs Have Unique Paw Prints',
    content: 'Just like human fingerprints, no two dogs have identical paw pad patterns.'
  },
  {
    id: 'pet36',
    title: 'Cats Sweat Through Their Paws',
    content: 'You might notice damp paw prints on hot days—cats only sweat through their paw pads.'
  },
  {
    id: 'pet37',
    title: 'Horses Can’t Vomit',
    content: 'Due to a one-way valve in their digestive system, horses are physically unable to vomit.'
  },
  {
    id: 'pet38',
    title: 'Dogs Can Get Jealous',
    content: 'Studies show dogs may display jealousy when their owners show affection to other animals or people.'
  },
  {
    id: 'pet39',
    title: 'Cats Have a Dominant Paw',
    content: 'Just like humans are left- or right-handed, cats often favor one paw over the other.'
  },
  {
    id: 'pet40',
    title: 'Rabbits Can Purr Too',
    content: 'When content, rabbits softly grind their teeth—a sound similar to a cat’s purr.'
  },
  {
    id: 'pet41',
    title: 'Dogs Use Whiskers to Sense Motion',
    content: 'Whiskers help dogs detect tiny air movements, especially useful in the dark.'
  },
  {
    id: 'pet42',
    title: 'Cats Can Rotate Their Ears 180 Degrees',
    content: 'Each ear has over 30 muscles, allowing cats to pinpoint the exact source of a sound.'
  },
  {
    id: 'pet43',
    title: 'Dogs Have Been Our Companions for 30,000 Years',
    content: 'Dogs were the first domesticated animals, evolving alongside humans for millennia.'
  },
  {
    id: 'pet44',
    title: 'Fish Sleep Without Closing Their Eyes',
    content: 'Fish lack eyelids, but they do enter a restful state where their activity slows significantly.'
  },
  {
    id: 'pet45',
    title: 'Dogs Tilt Their Heads to Improve Hearing',
    content: 'That adorable head tilt helps dogs adjust their outer ears to locate sounds more accurately.'
  },
  {
    id: 'pet46',
    title: 'Cats Have Better Night Vision Than Humans',
    content: 'A reflective layer behind their retinas allows cats to see well in low-light conditions.'
  },
  {
    id: 'pet47',
    title: 'Parrots Can Learn to Use Words in Context',
    content: 'With training, some parrots can associate specific words with objects, people, or actions.'
  },
  {
    id: 'pet48',
    title: 'Dogs Can See Some Colors',
    content: 'Dogs aren’t colorblind; they see mainly in shades of blue and yellow, but not red or green.'
  },
  {
    id: 'pet49',
    title: 'Cats Can Make Over 100 Facial Expressions',
    content: 'Their subtle facial cues help them communicate mood and intent, especially with other cats.'
  },
  {
    id: 'pet50',
    title: 'Pets Improve Human Health',
    content: 'Owning a pet can lower blood pressure, reduce stress, and even boost your immune system.'
  }
];

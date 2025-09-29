

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

export const sampleUser: User = {
  id: 14,
  profile_image: "https://picsum.photos/seed/user/200/200",
  username: "atrika@06",
  email: "atrika8@gmail.com",
  first_name: "Atrika",
  last_name: "P",
  is_verified: true,
  phone_no: "9876543210",
  pin_code: 765432,
  address: "123 Pet Street, Animal City",
  gender: 'Female',
};



const API_ENDPOINTS = {
  petTypes: '/api/pet-data/pet-types/',
  register: '/api/user-auth/register',
  login: '/api/user-auth/login',
  refreshToken: '/api/user-auth/token-refresh',
  userDetails: '/api/user-auth/user-details',
  updateUserDetails: '/api/user-auth/update-details',
  changePassword: '/api/user-auth/change-password',
  allPets: '/api/pet-data/pets/',
  myPets: '/api/pet-data/my-pets',
  requestSubmit: '/api/pet-data/request-submit',
  petProfile: '/api/pet-data/pet-profile/', // e.g., /api/pet-data/pet-profile/31
};

export const API_REQUEST_TIMEOUT = 10000; 

export default API_ENDPOINTS;

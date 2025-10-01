

const API_ENDPOINTS = {
  petTypes: '/api/pet-data/pet-types/',
  register: '/api/user-auth/register',
  login: '/api/user-auth/login',
  refreshToken: '/api/user-auth/token-refresh',
  userDetails: '/api/user-auth/user-details',
  updateUserDetails: '/api/user-auth/update-account',
  changePassword: '/api/user-auth/change-password',
  allPets: '/api/pet-data/pets/',
  myPets: '/api/pet-data/my-pets',
  requestSubmit: '/api/pet-data/pet-request-form/',
  petRequestView: '/api/pet-data/pet-request-view/',
  myPetData: '/api/pet-data/my-pet-data/',
};

export const API_REQUEST_TIMEOUT = 10000; 

export default API_ENDPOINTS;

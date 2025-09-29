

const API_ENDPOINTS = {
  petTypes: '/api/pet-data/pet-types/',
  register: '/api/user-auth/register',
  login: '/api/user-auth/login',
  userDetails: '/api/user-auth/user-details',
  allPets: '/api/pet-data/pets/',
  requestSubmit: '/api/pet-data/request-submit',
};

export const API_REQUEST_TIMEOUT = 10000; // 10 seconds

export default API_ENDPOINTS;

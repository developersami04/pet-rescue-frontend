
const API_ENDPOINTS = {
  register: '/api/user-auth/register',
  login: '/api/user-auth/login',
  refreshToken: '/api/user-auth/token-refresh',
  
  userCheck: '/api/home/user-check',

  userDetails: '/api/user-auth/user-details',
  updateUserDetails: '/api/user-auth/update-account',
  changePassword: '/api/user-auth/change-password',
  sendVerificationEmail: '/api/user-auth/verify-email',    // GET
  verifyEmail: '/api/user-auth/verify-email',              // POST
  
  petTypes: '/api/pet-data/pet-types/',
  allPets: '/api/pet-data/pets/',
  myPets: '/api/pet-data/my-pets/',
  myPetData: '/api/pet-data/my-pet-data/',
  
  petProfile: '/api/pet-data/pet-profile/',

  requestSubmit: '/api/pet-data/pet-request-form/',
  petRequestView: '/api/pet-data/pet-request-view/',

  petAdoptions: '/api/pet-data/pet-adoptions/',

  notifications: '/api/pet-data/notifications/',
};

export const API_REQUEST_TIMEOUT = 25000; 

export default API_ENDPOINTS;

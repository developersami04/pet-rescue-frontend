

const API_ENDPOINTS = {
  // User Auth and Account endpoints
  userCheck: '/api/home/user-check',

  register: '/api/user-auth/register',
  login: '/api/user-auth/login',
  refreshToken: '/api/user-auth/refresh-token',
  requestPasswordReset: '/api/user-auth/password-reset-request/',
  confirmPasswordReset: '/api/user-auth/password-reset-confirm/',

  userDetails: '/api/user-auth/user-details',
  updateUserDetails: '/api/user-auth/update-account',
  changePassword: '/api/user-auth/change-password',
  deleteAccount: '/api/user-auth/delete-account',

  sendVerificationEmail: '/api/user-auth/verify-email',    // GET
  verifyEmail: '/api/user-auth/verify-email',              // POST


  // Pet Data endpoints
  petTypes: '/api/pet-data/pet-types/',
  allPets: '/api/pet-data/pets/',
  myPets: '/api/pet-data/my-pets/',
  myPetData: '/api/pet-data/my-pet-data/',
  petProfile: '/api/pet-data/pet-profile/',
  favouritePets: '/api/pet-data/favourite-pets/',
  userStories: '/api/pet-data/user-stories/',
  homeUserStories: '/api/home/home-user-stories/',
  postStory: '/api/pet-data/user-stories/',
  searchQuery: '/api/home/user-search-query/',


  // Report and Adoption Endpoints
  requestSubmit: '/api/pet-data/pet-request-form/',
  petRequestView: '/api/pet-data/pet-request-view/',
  petReports: '/api/pet-data/pet-reports/',
  petAdoptions: '/api/pet-data/pet-adoptions/',


  // Notifications endpoints
  notifications: '/api/pet-data/notifications/',
  
  // Admin endpoints
  adminDashboardMetrics: '/api/admin-panel/dashboard-metrics/',
  registeredUsers: '/api/admin-panel/registered-users/',
  adminPetReports: '/api/admin-panel/pet-reports/',
  adminAdoptionRequests: '/api/admin-panel/adoption-requests/',
};

export const API_REQUEST_TIMEOUT = 25000; 

export default API_ENDPOINTS;

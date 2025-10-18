# Pet Rescue API Documentation

This document provides a comprehensive overview of the Pet Rescue API endpoints, including request/response schemas and usage examples.

**Base URL**: `https://pet-rescue-and-management.onrender.com`

---

## Table of Contents

1.  [Authentication](#authentication)
    -   [Register User](#register-user)
    -   [Login User](#login-user)
    -   [Refresh Token](#refresh-token)
    -   [Check User Auth](#check-user-auth)
    -   [Request Password Reset](#request-password-reset)
    -   [Confirm Password Reset](#confirm-password-reset)
2.  [User Account Management](#user-account-management)
    -   [Get User Details](#get-user-details)
    -   [Update User Details](#update-user-details)
    -   [Change Password](#change-password)
    -   [Delete Account](#delete-account)
    -   [Send Verification Email](#send-verification-email)
    -   [Verify Email with OTP](#verify-email-with-otp)
3.  [Pet Data](#pet-data)
    -   [Get Pet Types](#get-pet-types)
    -   [Get All Pets](#get-all-pets)
    -   [Get My Pets](#get-my-pets)
    -   [Get My Pet Data](#get-my-pet-data)
    -   [Get Pet Profile by ID](#get-pet-profile-by-id)
    -   [Get Pet Request Form Data](#get-pet-request-form-data)
    -   [Submit Pet Request](#submit-pet-request)
    -   [Update Pet Request](#update-pet-request)
    -   [Delete Pet Request](#delete-pet-request)
4.  [Adoption & Reports](#adoption--reports)
    -   [Create Adoption Request](#create-adoption-request)
    -   [Update Adoption Request](#update-adoption-request)
    -   [Delete Adoption Request](#delete-adoption-request)
    -   [Get Pet Reports](#get-pet-reports)
5.  [Favorites, Stories & Search](#favorites-stories--search)
    -   [Manage Favorite Pets](#manage-favorite-pets)
    -   [Manage User Stories](#manage-user-stories)
    -   [Get Home User Stories](#get-home-user-stories)
    -   [Search Pets](#search-pets)
6.  [Notifications](#notifications)
    -   [Get Notifications](#get-notifications)
    -   [Mark Notification as Read](#mark-notification-as-read)
    -   [Delete Notification](#delete-notification)
7.  [Admin Panel](#admin-panel)
    -   [Get Dashboard Metrics](#get-dashboard-metrics)
    -   [Get Registered Users](#get-registered-users)
    -   [Update User Status](#update-user-status)
    -   [Get Admin Pet Reports](#get-admin-pet-reports)
    -   [Update Pet Report Status](#update-pet-report-status)
    -   [Get Admin Adoption Requests](#get-admin-adoption-requests)
    -   [Update Adoption Request Status](#update-adoption-request-status)
    -   [Delete Admin Adoption Request](#delete-admin-adoption-request)

---

## 1. Authentication

### Register User
- **Endpoint**: `/api/user-auth/register`
- **Method**: `POST`
- **Auth Required**: No
- **Description**: Registers a new user.
- **Request Body Schema**:
  ```json
  {
    "username": "string",
    "email": "string (email format)",
    "password": "string (min 6 chars)",
    "first_name": "string",
    "last_name": "string (optional)",
    "phone_no": "string (min 10 chars)",
    "gender": "string ('Male', 'Female', 'Other', 'Prefer Not To Say')",
    "address": "string",
    "city": "string (optional)",
    "state": "string (optional)",
    "pin_code": "number (optional)"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "status": "Successful",
    "message": "User registered successfully.",
    "data": { /* User object */ }
  }
  ```
- **Failed Response Status Code**: 
  400 BAD REQUEST

### Login User
- **Endpoint**: `/api/user-auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Description**: Authenticates a user and returns tokens.
- **Request Body Schema**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Login Successful",
    "access_token": "string",
    "refresh_token": "string",
    "user": { /* User object */ }
  }
  ```
- **Failed Response Status Code**: 
  401 UNAUTHORIZED, 403 FORBIDDEN

### Refresh Token
- **Endpoint**: `/api/user-auth/refresh-token`
- **Method**: `POST`
- **Auth Required**: No
- **Description**: Refreshes an expired access token using a refresh token.
- **Request Body Schema**:
  ```json
  {
    "refresh_token": "string"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "access_token": "string"
  }
  ```
- **Failed Response Status Code**: 
  401 UNAUTHORIZED

### Check User Auth
- **Endpoint**: `/api/home/user-check`
- **Method**: `POST`
- **Auth Required**: No
- **Description**: Validates a refresh token and returns user data and a new access token.
- **Request Body Schema**:
  ```json
  {
    "refresh_token": "string"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "status": "Successful",
    "message": "User is authenticated.",
    "data": { /* User object */ },
    "access_token": "string"
  }
  ```
- **Failed Response Status Code**: 
  401 UNAUTHORIZED

### Request Password Reset
- **Endpoint**: `/api/user-auth/password-reset-request/`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body Schema**:
  ```json
  { "email": "string" }
  ```
- **Success Response (200 OK)**:
  ```json
  { "message": "Password reset OTP sent successfully." }
  ```
- **Failed Response Status Code**: 
  400 BAD REQUEST, 404 NOT FOUND

### Confirm Password Reset
- **Endpoint**: `/api/user-auth/password-reset-confirm/`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body Schema**:
  ```json
  {
    "otp": "string (6 chars)",
    "password": "string (min 6 chars)",
    "confirm_password": "string",
    "email": "string"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  { "message": "Password reset successful." }
  ```
- **Failed Response Status Code**: 
  400 BAD REQUEST

---

## 2. User Account Management

### Get User Details
- **Endpoint**: `/api/user-auth/user-details`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Success Response (200 OK)**:
  ```json
  { /* User object */ }
  ```
- **Failed Response Status Code**: 
  401 UNAUTHORIZED

### Update User Details
- **Endpoint**: `/api/user-auth/update-account`
- **Method**: `PATCH`
- **Auth Required**: Yes (Bearer Token)
- **Description**: Updates user profile information. Supports both `application/json` and `multipart/form-data` (for image uploads).
- **Request Body Schema**: Any combination of user profile fields.
  ```json
  {
    "first_name": "string",
    "last_name": "string",
    "phone_no": "string",
    "profile_image": "file (optional)"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  { "message": "Account updated successfully." }
  ```
- **Failed Response Status Code**: 
  400 BAD REQUEST, 401 UNAUTHORIZED

### Change Password
- **Endpoint**: `/api/user-auth/change-password`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)
- **Request Body Schema**:
  ```json
  {
    "current_password": "string",
    "new_password": "string"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  { "message": "Password changed successfully." }
  ```
- **Failed Response Status Code**: 
  400 BAD REQUEST, 401 UNAUTHORIZED

### Delete Account
- **Endpoint**: `/api/user-auth/delete-account`
- **Method**: `DELETE`
- **Auth Required**: Yes (Bearer Token)
- **Request Body Schema**:
  ```json
  { "password": "string" }
  ```
- **Success Response (204 No Content)**
- **Failed Response Status Code**: 
  400 BAD REQUEST, 401 UNAUTHORIZED

### Send Verification Email
- **Endpoint**: `/api/user-auth/verify-email`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Success Response (200 OK)**:
  ```json
  { "message": "Verification OTP sent to your email." }
  ```
- **Failed Response Status Code**: 
  401 UNAUTHORIZED, 404 NOT FOUND

### Verify Email with OTP
- **Endpoint**: `/api/user-auth/verify-email`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)
- **Request Body Schema**:
  ```json
  { "otp": "string" }
  ```
- **Success Response (200 OK)**:
  ```json
  { "message": "Email verified successfully." }
  ```
- **Failed Response Status Code**: 
  400 BAD REQUEST, 401 UNAUTHORIZED

---

## 3. Pet Data

### Get Pet Types
- **Endpoint**: `/api/pet-data/pet-types/`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response (200 OK)**:
  ```json
  [
    {
      "id": "number",
      "name": "string"
    }
  ]
  ```
- **Failed Response Status Code**: 
  N/A

### Get All Pets
- **Endpoint**: `/api/pet-data/pets/`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Query Params**: `type` (string, e.g., "Dog")
- **Success Response (200 OK)**:
  ```json
  { "data": [ /* Array of Pet objects */ ] }
  ```
- **Failed Response Status Code**: 
  401 UNAUTHORIZED

### Get My Pets
- **Endpoint**: `/api/pet-data/my-pets/`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Success Response (200 OK)**:
  ```json
  { "data": [ /* Array of Pet objects */ ] }
  ```
- **Failed Response Status Code**: 
  401 UNAUTHORIZED

### Get My Pet Data
- **Endpoint**: `/api/pet-data/my-pet-data/`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Query Params**: `tab` ('lost', 'found', 'adopt', 'my-adoption-requests', 'adoption-requests-received')
- **Success Response (200 OK)**:
  ```json
  { "data": [ /* Array of relevant objects */ ] }
  ```
- **Failed Response Status Code**: 
  401 UNAUTHORIZED

### Get Pet Profile by ID
- **Endpoint**: `/api/pet-data/pet-profile/{id}`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Success Response (200 OK)**:
  ```json
  { "data": { /* Full Pet object with medical_history, etc. */ } }
  ```
- **Failed Response Status Code**: 
  401 UNAUTHORIZED, 404 NOT FOUND

### Get Pet Request Form Data
- **Endpoint**: `/api/pet-data/pet-request-view/{id}`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Success Response (200 OK)**:
  ```json
  { "data": { /* Pet data for form pre-filling */ } }
  ```
- **Failed Response Status Code**: 
  401 UNAUTHORIZED, 404 NOT FOUND

### Submit Pet Request
- **Endpoint**: `/api/pet-data/pet-request-form/`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)
- **Content-Type**: `multipart/form-data`
- **Form Data Schema**: Includes all fields from the `addPetSchema`, including optional images (`pet_image`, `report_image`) and report details (`pet_status`, `message`).
- **Success Response (201 Created)**:
  ```json
  { "message": "Pet request submitted successfully." }
  ```
- **Failed Response Status Code**: 
  400 BAD REQUEST, 401 UNAUTHORIZED

### Update Pet Request
- **Endpoint**: `/api/pet-data/pet-request-view/{id}`
- **Method**: `PATCH`
- **Auth Required**: Yes (Bearer Token)
- **Content-Type**: `multipart/form-data`
- **Form Data Schema**: Any subset of fields from the `updatePetSchema`.
- **Success Response (200 OK)**:
  ```json
  { "message": "Pet request updated successfully." }
  ```
- **Failed Response Status Code**: 
  400 BAD REQUEST, 401 UNAUTHORIZED, 404 NOT FOUND

### Delete Pet Request
- **Endpoint**: `/api/pet-data/pet-request-view/{id}/`
- **Method**: `DELETE`
- **Auth Required**: Yes (Bearer Token)
- **Success Response (204 No Content)**
- **Failed Response Status Code**: 
  401 UNAUTHORIZED, 404 NOT FOUND

---

## 4. Adoption & Reports

### Create Adoption Request
- **Endpoint**: `/api/pet-data/pet-adoptions/`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)
- **Request Body Schema**:
  ```json
  { "pet": "number (petId)", "message": "string" }
  ```
- **Success Response (201 Created)**:
  ```json
  { /* AdoptionRequest object */ }
  ```
- **Failed Response Status Code**: 
  400 BAD REQUEST, 401 UNAUTHORIZED, 404 NOT FOUND

### Update Adoption Request
- **Endpoint**: `/api/pet-data/pet-adoptions/{id}/`
- **Method**: `PATCH`
- **Auth Required**: Yes (Bearer Token)
- **Request Body Schema**:
  ```json
  { "message": "string" }
  ```
- **Success Response (200 OK)**:
  ```json
  { /* AdoptionRequest object */ }
  ```
- **Failed Response Status Code**: 
  400 BAD REQUEST, 401 UNAUTHORIZED, 404 NOT FOUND

### Delete Adoption Request
- **Endpoint**: `/api/pet-data/pet-adoptions/{id}`
- **Method**: `DELETE`
- **Auth Required**: Yes (Bearer Token)
- **Success Response (204 No Content)**
- **Failed Response Status Code**: 
  401 UNAUThorized, 404 NOT FOUND

### Get Pet Reports
- **Endpoint**: `/api/pet-data/pet-reports/`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Query Params**: `pet_status` ('lost', 'found', 'adopt')
- **Success Response (200 OK)**:
  ```json
  { "data": [ /* Array of PetReport objects */ ] }
  ```
- **Failed Response Status Code**: 
  401 UNAUTHORIZED

---

## 5. Favorites, Stories & Search

### Manage Favorite Pets
- **Endpoint**: `/api/pet-data/favourite-pets/`
- **Auth Required**: Yes (Bearer Token)
- **Methods**:
  - `GET`: Fetches user's favorite pets.
    - **Response (200 OK)**:
      ```json
      { "data": [ /* Array of FavoritePet objects */ ] }
      ```
    - **Failed Response Status Code**: 401 UNAUTHORIZED
  - `POST`: Adds a pet to favorites.
    - **Request**:
      ```json
      { "pet_id": "number" }
      ```
    - **Response (200 OK)**:
      ```json
      { /* FavoritePet object */ }
      ```
    - **Failed Response Status Code**: 400 BAD REQUEST, 401 UNAUTHORIZED
  - `DELETE`: Removes a pet from favorites.
    - **Request**:
      ```json
      { "pet_id": "number" }
      ```
    - **Response**: 204 No Content
    - **Failed Response Status Code**: 400 BAD REQUEST, 401 UNAUTHORIZED

### Manage User Stories
- **Endpoint**: `/api/pet-data/user-stories/`
- **Auth Required**: Yes (Bearer Token)
- **Methods**:
  - `GET`: Fetches all user stories.
    - **Response (200 OK)**:
      ```json
      { "data": [ /* Array of UserStory objects */ ] }
      ```
    - **Failed Response Status Code**: 401 UNAUTHORIZED
  - `POST`: Creates a new user story.
    - **Request**:
      ```json
      { "pet": "number (petId)", "title": "string", "content": "string" }
      ```
    - **Response (201 Created)**:
      ```json
      { /* UserStory object */ }
      ```
    - **Failed Response Status Code**: 400 BAD REQUEST, 401 UNAUTHORIZED

### Get Home User Stories
- **Endpoint**: `/api/home/home-user-stories/`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response (200 OK)**:
  ```json
  { "data": [ /* Array of HomeUserStory objects */ ] }
  ```
- **Failed Response Status Code**: 
  N/A

### Search Pets
- **Endpoint**: `/api/home/user-search-query/`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Query Params**: `query` (string)
- **Success Response (200 OK)**:
  ```json
  { "data": [ /* Array of simplified Pet objects */ ] }
  ```
- **Failed Response Status Code**: 
  401 UNAUTHORIZED

---

## 6. Notifications

### Get Notifications
- **Endpoint**: `/api/pet-data/notifications/`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Query Params**: `pet_status` (optional), `read_status` (optional)
- **Success Response (200 OK)**:
  ```json
  { "data": [ /* Array of Notification objects */ ] }
  ```
- **Failed Response Status Code**: 
  401 UNAUTHORIZED

### Mark Notification as Read
- **Endpoint**: `/api/pet-data/notifications/{id}/`
- **Method**: `PATCH`
- **Auth Required**: Yes (Bearer Token)
- **Success Response (200 OK or 204 No Content)**
- **Failed Response Status Code**: 
  401 UNAUTHORIZED, 404 NOT FOUND

### Delete Notification
- **Endpoint**: `/api/pet-data/notifications/{id}/`
- **Method**: `DELETE`
- **Auth Required**: Yes (Bearer Token)
- **Success Response (204 No Content)**
- **Failed Response Status Code**: 
  401 UNAUTHORIZED, 404 NOT FOUND

---

## 7. Admin Panel

### Get Dashboard Metrics
- **Endpoint**: `/api/admin-panel/dashboard-metrics/`
- **Method**: `GET`
- **Auth Required**: Yes (Admin User)
- **Success Response (200 OK)**:
  ```json
  { "data": { /* Metrics object */ } }
  ```
- **Failed Response Status Code**: 
  401 UNAUTHORIZED, 403 FORBIDDEN

### Get Registered Users
- **Endpoint**: `/api/admin-panel/registered-users/`
- **Method**: `GET`
- **Auth Required**: Yes (Admin User)
- **Success Response (200 OK)**:
  ```json
  { "data": [ /* Array of RegisteredUser objects */ ] }
  ```
- **Failed Response Status Code**: 
  401 UNAUTHORIZED, 403 FORBIDDEN

### Update User Status
- **Endpoint**: `/api/admin-panel/registered-users/{id}/`
- **Method**: `PATCH`
- **Auth Required**: Yes (Admin User)
- **Request Body Schema**:
  ```json
  { "is_verified": "boolean" }
  ```
  or
  ```json
  { "is_active": "boolean" }
  ```
  or
  ```json
  { "is_staff": "boolean" }
  ```
- **Success Response (200 OK)**:
  ```json
  { /* Updated RegisteredUser object */ }
  ```
- **Failed Response Status Code**: 
  400 BAD REQUEST, 401 UNAUTHORIZED, 403 FORBIDDEN, 404 NOT FOUND

### Get Admin Pet Reports
- **Endpoint**: `/api/admin-panel/pet-reports/`
- **Method**: `GET`
- **Auth Required**: Yes (Admin User)
- **Query Params**: `status` ('pending', 'approved', 'rejected', 'last50')
- **Success Response (200 OK)**:
  ```json
  { "data": [ /* Array of AdminPetReport objects */ ] }
  ```
- **Failed Response Status Code**: 
  401 UNAUTHORIZED, 403 FORBIDDEN

### Update Pet Report Status
- **Endpoint**: `/api/admin-panel/pet-reports/{id}/`
- **Method**: `PATCH`
- **Auth Required**: Yes (Admin User)
- **Request Body Schema**:
  ```json
  { "report_status": "string ('approved', 'rejected', 'resolved')" }
  ```
- **Success Response (200 OK)**:
  ```json
  { /* Updated AdminPetReport object */ }
  ```
- **Failed Response Status Code**: 
  400 BAD REQUEST, 401 UNAUTHORIZED, 403 FORBIDDEN, 404 NOT FOUND

### Get Admin Adoption Requests
- **Endpoint**: `/api/admin-panel/adoption-requests/`
- **Method**: `GET`
- **Auth Required**: Yes (Admin User)
- **Query Params**: `report_status` ('pending', 'recents', 'rejected')
- **Success Response (200 OK)**:
  ```json
  { "data": [ /* Array of AdoptionRequest objects */ ] }
  ```
- **Failed Response Status Code**: 
  401 UNAUTHORIZED, 403 FORBIDDEN

### Update Adoption Request Status
- **Endpoint**: `/api/admin-panel/adoption-requests/{id}/`
- **Method**: `PATCH`
- **Auth Required**: Yes (Admin User)
- **Request Body Schema**:
  ```json
  {
    "report_status": "string ('approved', 'rejected')",
    "message": "string (optional)"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  { /* Updated AdoptionRequest object */ }
  ```
- **Failed Response Status Code**: 
  400 BAD REQUEST, 401 UNAUTHORIZED, 403 FORBIDDEN, 404 NOT FOUND

### Delete Admin Adoption Request
- **Endpoint**: `/api/admin-panel/adoption-requests/{id}/`
- **Method**: `DELETE`
- **Auth Required**: Yes (Admin User)
- **Success Response (204 No Content)**
- **Failed Response Status Code**: 
  401 UNAUTHORIZED, 403 FORBIDDEN, 404 NOT FOUND

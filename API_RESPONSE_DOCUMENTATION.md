
# Petopia API Response Documentation

This document outlines the expected JSON response structures for the various API endpoints consumed by the Petopia frontend application.

---

## Table of Contents

1.  [User Authentication](#1-user-authentication)
2.  [Pet Data](#2-pet-data)
3.  [User-Specific Pet Data](#3-user-specific-pet-data)
4.  [Notifications](#4-notifications)
5.  [Admin Panel](#5-admin-panel)

---

## 1. User Authentication

### `POST /api/user-auth/register`

-   **Purpose**: Register a new user.
-   **Success Response (201 Created)**:
    ```json
    {
        "status": "Success",
        "message": "User registered successfully, please verify your email.",
        "data": {
            "id": 1,
            "username": "newuser",
            "email": "newuser@example.com",
            "first_name": "New",
            "last_name": "User"
        }
    }
    ```
-   **Error Response (400 Bad Request)**:
    ```json
    {
        "username": [
            "A user with that username already exists."
        ],
        "email": [
            "user with this email already exists."
        ]
    }
    ```

### `POST /api/user-auth/login`

-   **Purpose**: Authenticate a user and receive access/refresh tokens.
-   **Success Response (200 OK)**:
    ```json
    {
        "message": "Login successful!",
        "access_token": "ey...",
        "refresh_token": "ey...",
        "user": {
            "id": 1,
            "username": "testuser",
            "email": "test@example.com",
            "full_name": "Test User",
            "is_admin": false
        }
    }
    ```
-   **Error Response (401 Unauthorized)**:
    ```json
    {
        "detail": "No active account found with the given credentials"
    }
    ```

### `POST /api/user-auth/token-refresh`

-   **Purpose**: Obtain a new access token using a refresh token.
-   **Success Response (200 OK)**:
    ```json
    {
        "access": "ey..."
    }
    ```
-   **Error Response (401 Unauthorized)**:
    ```json
    {
        "detail": "Token is invalid or expired",
        "code": "token_not_valid"
    }
    ```

### `GET /api/user-auth/user-details`

-   **Purpose**: Fetch details for the authenticated user.
-   **Success Response (200 OK)**:
    ```json
    {
        "id": 1,
        "profile_image": null,
        "username": "testuser",
        "email": "test@example.com",
        "first_name": "Test",
        "last_name": "User",
        "is_verified": true,
        "phone_no": "1234567890",
        "gender": "Male",
        "pin_code": 12345,
        "address": "123 Main St",
        "city": "Anytown",
        "state": "Anystate",
        "is_staff": false,
        "is_admin": false
    }
    ```

### `PATCH /api/user-auth/update-account`

-   **Purpose**: Update details for the authenticated user.
-   **Success Response (200 OK)**:
    ```json
    {
        "message": "User details updated successfully",
        "data": { ... } // Returns the updated user details object
    }
    ```

### `POST /api/user-auth/change-password`

-   **Purpose**: Change the authenticated user's password.
-   **Success Response (200 OK)**:
    ```json
    {
        "message": "Password updated successfully"
    }
    ```
-   **Error Response (400 Bad Request)**:
    ```json
    {
        "current_password": ["Wrong password."]
    }
    ```

---

## 2. Pet Data

### `GET /api/pet-data/pet-types/`

-   **Purpose**: Get a list of all available pet types.
-   **Success Response (200 OK)**:
    ```json
    [
        {
            "id": 1,
            "name": "Dog"
        },
        {
            "id": 2,
            "name": "Cat"
        }
    ]
    ```

### `GET /api/pet-data/pets/`

-   **Purpose**: Get a list of all pets. Can be filtered by `type`.
-   **Success Response (200 OK)**:
    ```json
    {
        "status": "Success",
        "message": "Pets fetched successfully!",
        "data": [
            {
                "id": 1,
                "pet_image": "url/to/image.jpg",
                "name": "Buddy",
                "description": "A friendly dog.",
                "type_name": "Dog",
                "gender": "Male",
                "age": 3,
                "breed": "Golden Retriever",
                "is_verified": true,
                "pet_report": {
                    "pet_status": "adopt",
                    "is_resolved": false
                }
                // ... other fields as defined in Pet type
            }
        ]
    }
    ```

### `GET /api/pet-data/pet-profile/{id}`

-   **Purpose**: Get detailed information for a single pet.
-   **Success Response (200 OK)**:
    ```json
    {
        "status": "Success",
        "message": "Pet profile fetched successfully!",
        "data": {
            "id": 1,
            "pet_image": "url/to/image.jpg",
            "name": "Buddy",
            // ... All fields from the Pet type in `src/lib/data.ts`
            "medical_history": { ... },
            "adoption_requests": [ ... ],
            "pet_report": { ... }
        }
    }
    ```

### `GET /api/pet-data/pet-reports/`

-   **Purpose**: Get a list of pet reports filtered by status (`lost`, `found`, `adopt`).
-   **Success Response (200 OK)**:
    ```json
    {
        "status": "Success",
        "message": "Pet Reports fetched successfully!",
        "data": [
            {
                "id": 7,
                "pet": 8,
                "report_image": null,
                "pet_name": "Pika",
                "pet_status": "adopt",
                "message": "",
                "reporter_name": "Tanjiro Kamado",
                "report_status": "approved",
                "is_resolved": false
            }
        ]
    }
    ```

---

## 3. User-Specific Pet Data

### `POST /api/pet-data/pet-request-form/`

-   **Purpose**: Submit a new pet for listing, or report a pet.
-   **Success Response (201 Created)**:
    ```json
    {
        "status": "Success",
        "message": "Your pet request for Buddy has been submitted successfully and is pending admin approval.",
        "data": { ... } // Returns the created pet object
    }
    ```

### `GET /api/pet-data/my-pets/`

-   **Purpose**: Get a list of pets owned by the authenticated user.
-   **Success Response (200 OK)**:
    ```json
    {
        "status": "Success",
        "message": "Your pets fetched successfully!",
        "data": [ ... ] // Array of Pet objects
    }
    ```

### `GET /api/pet-data/my-pet-data/?tab={tab_name}`

-   **Purpose**: Get data for dashboard tabs (`lost`, `found`, `adopt`, `my-adoption-requests`, `adoption-requests-received`).
-   **Success Response (200 OK)**:
    ```json
    {
        "status": "Success",
        "message": "Data fetched successfully!",
        "data": [ ... ] // Array of PetReport, MyAdoptionRequest, or AdoptionRequest objects
    }
    ```

### `POST /api/pet-data/pet-adoptions/`

-   **Purpose**: Create an adoption request for a pet.
-   **Success Response (201 Created)**:
    ```json
    {
        "status": "Success",
        "message": "Your adoption request has been sent to the pet owner.",
        "data": { ... } // The created adoption request object
    }
    ```

---

## 4. Notifications

### `GET /api/pet-data/notifications/`

-   **Purpose**: Fetch notifications for the authenticated user. Can be filtered by `read_status` and `pet_status`.
-   **Success Response (200 OK)**:
    ```json
    {
        "status": "Success",
        "message": "Notifications fetched successfully!",
        "data": [
            {
                "id": 1,
                "content": "Your pet 'Buddy' has a new adoption request.",
                "created_at": "2024-01-01T12:00:00Z",
                "is_read": false,
                "pet": 1,
                "pet_name": "Buddy",
                "pet_data": {
                    "pet_image": "url/to/image.jpg",
                    "pet_status": "adopt"
                }
            }
        ]
    }
    ```

### `GET /api/pet-data/notifications/{id}/`

-   **Purpose**: Mark a specific notification as read.
-   **Success Response (200 OK)**:
    ```json
    {
        "status": "Success",
        "message": "Notification marked as read."
    }
    ```

---

## 5. Admin Panel

### `GET /api/admin-panel/dashboard-metrics/`

-   **Purpose**: Fetch aggregate statistics for the admin dashboard.
-   **Success Response (200 OK)**:
    ```json
    {
        "status": "Success",
        "message": "Admin dashboard metrics fetched successfully!",
        "data": {
            "no_of_users": 100,
            "no_of_current_pets": 50,
            "no_of_pending_reports": 5,
            // ... other metrics
        }
    }
    ```

### `GET /api/admin-panel/registered-users/`

-   **Purpose**: Get a list of all registered users.
-   **Success Response (200 OK)**:
    ```json
    {
        "status": "Success",
        "message": "Registered users fetched successfully!",
        "data": [ ... ] // Array of RegisteredUser objects
    }
    ```

### `GET /api/admin-panel/pet-reports/`

-   **Purpose**: Get pet reports for admin review. Can be filtered by `status` (`pending`, `approved`, `rejected`).
-   **Success Response (200 OK)**:
    ```json
    {
        "status": "Success",
        "message": "Pet reports fetched successfully!",
        "data": [ ... ] // Array of AdminPetReport objects
    }
    ```

### `PATCH /api/admin-panel/pet-reports/{id}/`

-   **Purpose**: Update the status of a pet report (`approved`, `rejected`, `resolved`).
-   **Success Response (200 OK)**:
    ```json
    {
        "status": "Success",
        "message": "Pet report status updated successfully to approved.",
        "data": { ... } // The updated report object
    }
    ```

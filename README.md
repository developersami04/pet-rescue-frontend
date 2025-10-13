# Petopia Project Structure

This document provides an overview of the project's file structure. The application is built with Next.js using the App Router, TypeScript, and Tailwind CSS.

For detailed information about the API, please see the [API Documentation](API_DOCUMENTATION.md).

## Root Directory

-   `.env`: For storing environment variables such as API keys and database URLs.
-   `apphosting.yaml`: Configuration file for deployment on Firebase App Hosting.
-   `API_DOCUMENTATION.md`: A comprehensive guide to all the API endpoints used in the project.
-   `components.json`: Configuration file for `shadcn/ui`, defining style, component paths, and Tailwind CSS settings.
-   `next.config.js` / `next.config.ts`: Configuration file for Next.js, including settings for TypeScript, ESLint, and image optimization.
-   `package.json`: Lists project dependencies, scripts for running, building, and linting the application.
-   `README.md`: This file, providing an overview of the project.
-   `tailwind.config.ts`: Configuration file for Tailwind CSS, including theme customizations like colors, fonts, and animations.
-   `tsconfig.json`: The TypeScript compiler configuration file, setting rules for how TypeScript code is checked and compiled.

---

## `src/` Directory

This is the main application source code directory.

### `src/app`

Contains all the application routes, pages, and layouts, following the Next.js App Router conventions.

-   `layout.tsx`: The root layout of the application. It wraps all pages and includes global providers like `ThemeProvider`, `AuthProvider`, and `NotificationProvider`. It also renders the main header and footer.
-   `globals.css`: Defines the global styles, including CSS variables for light and dark themes and base Tailwind CSS layers.
-   `page.tsx`: The main landing page of the application.
-   `loading.tsx`: A global loading UI component that is displayed while routes are being loaded.

#### Route Directories

Each directory inside `src/app` represents a route segment.

-   **`_components/`**: Private components used only within the `app` directory, not tied to a specific route. For example, `hero-section.tsx`.
-   **`about-us/`**: Contains the "About Us" page.
-   **`account-settings/`**: The page for users to manage their profile, password, and other settings.
    -   `_components/`: Contains components specific to the account settings page, such as `profile-card.tsx` and `profile-form.tsx`.
-   **`admin/`**: Contains pages accessible only to administrators.
    -   `dashboard/`: The admin dashboard page.
    -   `approve-reports/`: Page for admins to approve pet reports.
-   **`contact-us/`**: The contact page.
-   **`create-account/`**: The user registration page.
-   **`dashboard/`**: The main dashboard for authenticated users.
    -   `_components/`: Components for different sections of the user dashboard, like `my-pets-section.tsx` and `my-requests-section.tsx`.
-   **`landing/`**: Components specifically for the public-facing landing page, such as `hero-section.tsx` and `landing-header.tsx`.
-   **`login/`**: The user login page.
-   **`notifications/`**: The page where users can view all their notifications.
-   **`pets/`**: The main page for browsing all available pets.
    -   `[id]/`: A dynamic route for displaying a specific pet's profile.
    -   `_components/`: Components for the pets list and filtering, like `pet-card.tsx` and `pet-filters.tsx`.
-   **`profile/`**: The public-facing user profile page.
-   **`reports/`**: Page for displaying reports of lost, found, and adoptable pets.
-   **`resources/`**: A page with helpful articles and resources for pet owners.
-   **`submit-request/`**: The form for users to add a new pet or report a lost/found pet.
    -   `[id]/`: A dynamic route for updating an existing pet request.

### `src/components`

Contains reusable UI components shared across the application.

-   `ui/`: Contains the `shadcn/ui` components like `button.tsx`, `card.tsx`, `input.tsx`, etc. These are the building blocks of the UI.
-   `admin-header.tsx`: The header for authenticated admin users.
-   `bottom-nav-bar.tsx`: The navigation bar at the bottom of the screen for mobile devices.
-   `header-nav.tsx`: The main header for authenticated general users.
-   `icons.tsx` & `logo.tsx`: SVG icons and the main application logo component.
-   `notification-item.tsx`, `notification-list.tsx`, `notification-popover.tsx`: Components for displaying notifications.
-   `page-header.tsx`: A standardized component for page titles and descriptions.
-   `pet-icons.tsx`: A component that maps pet types to specific `lucide-react` icons.
-   `theme-provider.tsx`: A provider for managing the application's light and dark themes.

### `src/hooks`

Contains custom React hooks for shared logic.

-   `use-mobile.tsx`: A hook to detect if the user is on a mobile device.
-   `use-notifications.tsx`: A hook for managing and fetching user notifications.
-   `use-toast.ts`: A hook for displaying toast notifications.
-   `use-user-details.tsx`: A hook for fetching and managing the current user's profile data.

### `src/lib`

Contains utility functions, data types, API logic, and other shared library code.

-   `actions.ts`: A consolidated file containing all server actions for interacting with the backend API (e.g., `loginUser`, `getPetById`, `submitRequest`).
-   `api.ts`: Contains low-level API fetching logic, including `fetchWithAuth` which handles adding authorization headers and refreshing expired tokens.
-   `auth.tsx`: Contains the `AuthProvider` and `useAuth` hook, which manage the global authentication state.
-   `data.ts`: Defines the core TypeScript types used throughout the application (e.g., `Pet`, `User`, `Notification`).
-   `endpoints.ts`: A centralized file that defines all the API endpoint URLs.
-   `placeholder-images.json` & `placeholder-images.ts`: Manages placeholder image data used across the app.
-   `utils.ts`: Contains utility functions, most notably `cn` for merging Tailwind CSS classes.

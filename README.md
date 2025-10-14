# Pet Rescue Project Structure

This document provides an overview of the project's file structure. The application is built with Next.js using the App Router, TypeScript, and Tailwind CSS.

For detailed information about the API, please see the [API Documentation](API_DOCUMENTATION.md).

## Root Directory

```
/
├── .env                  # Environment variables (API keys, etc.)
├── apphosting.yaml       # Firebase App Hosting configuration
├── API_DOCUMENTATION.md  # Detailed documentation for the backend API
├── components.json       # Configuration for shadcn/ui components
├── next.config.js        # Configuration for Next.js
├── package.json          # Project dependencies and scripts
├── README.md             # This file
├── tailwind.config.ts    # Tailwind CSS theme and configuration
└── tsconfig.json         # TypeScript compiler settings
```

---

## `src/` Directory Structure

This is the main application source code directory, organized to separate concerns like routing, UI components, business logic, and utilities.

```
src/
├── app/                  # --- ROUTING & PAGES ---
│   ├── _components/      # Private components used only within the app directory
│   ├── account-settings/ # User account management page
│   ├── admin/            # Admin-only pages (dashboard, approvals, etc.)
│   ├── create-account/   # User registration page
│   ├── dashboard/        # Main dashboard for authenticated users
│   ├── landing/          # Components for the public landing page
│   ├── login/            # User login page
│   ├── notifications/    # User notifications page
│   ├── pets/             # Pet browsing, search, and profile pages
│   ├── profile/          # Public-facing user profile
│   ├── reports/          # Pages for lost, found, and adoptable pet reports
│   ├── submit-request/   # Form to add or report a pet
│   │
│   ├── globals.css       # Global styles and Tailwind CSS layers
│   ├── layout.tsx        # Root application layout, wraps all pages
│   ├── page.tsx          # The main landing page component
│   └── loading.tsx       # Global loading UI for route transitions
│
├── components/           # --- REUSABLE UI COMPONENTS ---
│   ├── ui/               # Core shadcn/ui components (Button, Card, etc.)
│   ├── admin-header.tsx  # Header for admin users
│   ├── bottom-nav-bar.tsx# Mobile navigation bar
│   ├── header-nav.tsx    # Header for authenticated general users
│   ├── icons.tsx         # Custom SVG icons
│   ├── logo.tsx          # Application logo component
│   └── ...               # Other shared components
│
├── hooks/                # --- CUSTOM REACT HOOKS ---
│   ├── use-mobile.tsx    # Detects if the user is on a mobile device
│   ├── use-notifications.tsx# Manages fetching and state for user notifications
│   ├── use-toast.ts      # Hook for displaying toast notifications
│   └── use-user-details.tsx# Fetches and manages current user's profile data
│
└── lib/                  # --- CORE LOGIC & UTILITIES ---
    ├── actions.ts        # Server Actions for all backend API interactions
    ├── api.ts            # Low-level API fetching logic (e.g., fetchWithAuth)
    ├── auth.tsx          # AuthProvider and useAuth hook for global auth state
    ├── data.ts           # Core TypeScript types and interfaces for the app
    ├── endpoints.ts      # Centralized API endpoint URLs
    ├── placeholder-images.json # Data for placeholder images
    └── utils.ts          # Utility functions (e.g., `cn` for classnames)
```

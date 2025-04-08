# Project Documentation

This project is a Next.js application featuring a protected dashboard with authentication, theming capabilities, and a responsive sidebar.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **Authentication**: Includes login and signup pages. Users must be authenticated to access the dashboard.
- **Theming**: Supports light, dark, and custom themes (e.g., blue, green).
- **Responsive Sidebar**: Uses React context for sidebar control and animations.

## Technologies Used

- **Next.js**: Framework for server-rendered React applications.
- **React Context**: Manages global state for theme, user, and sidebar control.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **React Shart**: Library for creating charts.
- **Tabler Icons**: Icon library for UI components.

## Authentication

- **Login and Signup**:
  - **Login Process**: For demonstration purposes, users can log in using any email and password combination. This allows easy access to the dashboard without real authentication.
  - **Redirection**: Users are redirected to the login page if they attempt to access the dashboard without being authenticated.

## Theming

- **Custom Themes**: Explain how themes are managed and switched using React context.

## Components

- **NavSecondary**: Describe the `NavSecondary` component and its usage.
- **Sidebar Components**: Detail the sidebar components (`SidebarGroup`, `SidebarMenu`, etc.) and their roles.

## Usage

- **Running the Project**: Instructions on how to set up and run the project locally.
- **Deployment**: Guidelines for deploying the application.

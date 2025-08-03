# Overview

This is a full-stack authentication application built with React, TypeScript, Express.js, and PostgreSQL. The application provides user registration and login functionality with a modern, responsive UI featuring a botanical-themed design. It follows a clean architecture pattern with separated client/server concerns and shared type definitions.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for build tooling
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: React Context for authentication state, TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Responsive Design**: Mobile-first approach with responsive breakpoints

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: bcrypt for password hashing, custom session management
- **API Design**: RESTful endpoints with consistent error handling
- **Development**: Hot module replacement with Vite integration
- **Validation**: Zod schemas for request/response validation

## Database Design
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: User table with id, email, password, and timestamps
- **Migrations**: Drizzle Kit for schema migrations
- **Connection**: Neon Database serverless PostgreSQL

## Authentication Flow
- **Password Security**: bcrypt hashing with salt rounds
- **Session Management**: In-memory storage for development (scalable to Redis/database sessions)
- **Validation**: Shared Zod schemas between client and server
- **Error Handling**: Consistent error responses with proper HTTP status codes

## Development Environment
- **Monorepo Structure**: Shared types and schemas between client/server
- **Build System**: Vite for frontend, esbuild for backend production builds
- **Development Server**: Express with Vite middleware for HMR
- **TypeScript**: Strict mode with path mapping for clean imports

## Design System
- **Theme**: Botanical/nature-inspired color palette with dark/light mode support
- **Components**: Reusable UI components with consistent styling
- **Typography**: Custom font scales and spacing system
- **Animations**: Smooth transitions and micro-interactions using CSS and Framer Motion

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm & drizzle-kit**: Type-safe ORM and migration tooling
- **express**: Web application framework
- **react & react-dom**: Frontend framework
- **typescript**: Type safety across the application

## UI and Styling
- **@radix-ui/***: Accessible component primitives (accordion, dialog, form controls, etc.)
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant API for components
- **clsx & tailwind-merge**: Conditional class name utilities

## State Management and Data Fetching
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers

## Validation and Security
- **zod**: Schema validation for both client and server
- **bcrypt**: Password hashing
- **@types/bcrypt**: TypeScript definitions

## Development Tools
- **vite**: Build tool and development server
- **@vitejs/plugin-react**: React plugin for Vite
- **wouter**: Lightweight routing
- **date-fns**: Date manipulation utilities

## Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Development tooling (conditional)
# Charging the Future - Portfolio Website

## Overview

This is a Next.js 14-based portfolio website for "Charging the Future," a platform promoting psyop-free products and services. The site features a retro terminal-style aesthetic with a dark theme, monospace typography, and green accent colors. It's built as a single-page application with sections for about and products/services.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: Next.js 14 with App Router
- **Rationale**: App Router provides modern React Server Components (RSC) architecture for better performance and SEO
- **Rendering Strategy**: Server-side rendering with suspense boundaries for progressive loading
- **File Structure**: App directory structure (`app/layout.tsx`, `app/page.tsx`) following Next.js 14 conventions

**UI Component System**: shadcn/ui with Radix UI primitives
- **Problem Addressed**: Need for accessible, customizable UI components without heavy framework lock-in
- **Solution**: shadcn/ui provides copy-paste components built on Radix UI primitives, allowing full customization while maintaining accessibility
- **Component Organization**: Components aliased to `@/components` with separate `@/components/ui` for shadcn components
- **Pros**: Full control over components, no runtime overhead, excellent accessibility
- **Cons**: Requires manual component installation and updates

**Styling System**: Tailwind CSS with CSS Variables
- **Approach**: Utility-first CSS with design tokens defined as CSS custom properties
- **Theme Configuration**: HSL-based color system with support for light/dark modes
- **Design Tokens**: Centralized color scheme using CSS variables (--background, --foreground, --primary, etc.)
- **Alternatives Considered**: Styled-components or CSS modules
- **Chosen For**: Better performance (no runtime), smaller bundle size, easier theming

**Typography**: Geist Sans and Geist Mono fonts
- **Primary Font**: Geist Sans for body text
- **Monospace Font**: Geist Mono for code/terminal aesthetic
- **Implementation**: Variable fonts loaded via `geist/font` package
- **Font Loading Approach**: Applied via className on `<html>` tag and style prop on `<body>` tag to avoid hydration issues with manual `<head>` management in App Router

**Theme Management**: next-themes provider
- **Capability**: Client-side theme switching between light/dark modes
- **Implementation**: Wrapped in client component (`components/theme-provider.tsx`)
- **Theme Persistence**: Uses local storage to remember user preference

### Design Patterns

**Component Composition**: Radix UI's compound component pattern
- **Rationale**: Provides flexible, accessible components through composition rather than configuration
- **Example**: Dialog, Dropdown, and other interactive components use this pattern

**Utility Function Pattern**: `cn()` helper for class merging
- **Purpose**: Combines clsx and tailwind-merge to handle conditional classes and prevent Tailwind conflicts
- **Location**: `lib/utils.ts`

**Layout Pattern**: Root layout with nested routing
- **Structure**: Single root layout (`app/layout.tsx`) wraps all pages
- **Features**: Global metadata, font loading, analytics integration

### State Management

**Current State**: No complex state management (static content site)
- **Approach**: Server components by default, client components only when needed (theme provider)
- **Future Consideration**: If dynamic features are added, React Context or state management library may be needed

### Build Configuration

**TypeScript**: Strict mode enabled
- **Target**: ES6
- **Module System**: ESNext with bundler resolution
- **Path Aliases**: @ prefix for root imports

**Tailwind Configuration**:
- Dark mode: Class-based strategy
- Content Sources: Scans all JS/TS/JSX/TSX files in pages, components, and app directories
- Custom theme extension with design system colors

### Development & Production Setup

**Development Server**: Runs on port 5000, binds to 0.0.0.0 for network access
- **Replit Configuration**: Package scripts configured to bind Next.js to `0.0.0.0:5000` for Replit compatibility
- **Dev Command**: `pnpm run dev` (runs `next dev -p 5000 -H 0.0.0.0`)
- **Production Command**: `pnpm run start` (runs `next start -p 5000 -H 0.0.0.0`)

**Build Process**: Next.js static optimization with RSC compilation
**Code Quality**: Next.js linting configuration enabled
**Deployment**: Configured for Replit autoscale deployment (stateless websites)
- **Build**: `pnpm run build`
- **Start**: `pnpm run start`

## External Dependencies

### Core Framework & Runtime
- **Next.js 14.2.25**: React framework with App Router, RSC support, and optimized bundling
- **React 18+**: Implicit dependency through Next.js for server/client components

### UI Component Libraries
- **Radix UI Suite**: Comprehensive set of unstyled, accessible UI primitives
  - Accordion, Alert Dialog, Aspect Ratio, Avatar, Checkbox, Collapsible
  - Context Menu, Dialog, Dropdown Menu, Hover Card, Label, Menubar
  - Navigation Menu, Popover, Progress, Radio Group, Scroll Area
  - Select, Separator, Slider, Slot, Switch, Tabs, Toast, Toggle, Tooltip
- **shadcn/ui**: Component system built on Radix UI (configuration-based, not a direct dependency)
- **cmdk**: Command menu component (version 1.0.4)
- **lucide-react**: Icon library for consistent iconography
- **embla-carousel-react**: Carousel/slider component (version 8.5.1)

### Styling & Theming
- **Tailwind CSS**: Utility-first CSS framework (via autoprefixer dependency)
- **autoprefixer**: PostCSS plugin for vendor prefixes
- **class-variance-authority**: Utility for creating variant-based component APIs
- **clsx**: Utility for constructing className strings conditionally
- **tailwind-merge**: Merges Tailwind classes without conflicts
- **next-themes**: Theme management for dark/light mode switching

### Typography
- **geist**: Vercel's Geist Sans and Geist Mono font family

### Forms & Validation
- **react-hook-form**: Implicit dependency (resolver package present)
- **@hookform/resolvers**: Validation resolvers for react-hook-form integration

### Utilities
- **date-fns**: Date manipulation and formatting library (version 4.1.0)
- **input-otp**: OTP/PIN input component (version 1.4.1)

### Analytics & Monitoring
- **@vercel/analytics**: Vercel Analytics integration for tracking page views and web vitals

### Development Tools
- **TypeScript**: Type safety and developer experience
- **ESLint**: Code quality and consistency (via next lint)

### Notes on Architecture Decisions

**No Backend/Database**: Currently a static marketing site with no data persistence needs
- If backend features are needed, Next.js API routes with a database integration would be the natural extension

**No Authentication**: Static content site requires no user authentication
- Theme provider setup suggests the architecture could easily accommodate auth if needed

**Analytics Only**: Vercel Analytics chosen for simplicity and zero-configuration integration
- **Pros**: No setup required, privacy-focused, free tier available
- **Cons**: Limited to Vercel ecosystem

**Component Library Strategy**: shadcn/ui over complete frameworks like Material-UI or Chakra
- **Rationale**: Complete control over components, no framework bloat, pay-only-for-what-you-use approach
- **Trade-off**: More initial setup, manual component installation vs. complete out-of-box solution
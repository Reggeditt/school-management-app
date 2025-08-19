# School Management System (SMS) SaaS Platform

A beautiful, colorful, modern, elegant, responsive, and accessible School Management System (SMS) SaaS platform built with Next.js, TypeScript, Tailwind CSS, shadcn UI, and Firebase.

## Project Setup

This project uses pnpm as the package manager for better performance and disk space efficiency.

### Prerequisites

- Node.js (v18 or later)
- pnpm (v8 or later)

### Installation

1. Install pnpm globally if you haven't already:

```bash
npm install -g pnpm
```

2. Install dependencies:

```bash
pnpm install
```

### Development

To start the development server:

```bash
pnpm dev
```

The application will be available at http://localhost:3000

### Building for Production

To create a production build:

```bash
pnpm build
```

To start the production server:

```bash
pnpm start
```

## Project Structure

- `app/` - Next.js application
  - `src/` - Source code
    - `app/` - Next.js App Router pages
    - `components/` - React components
    - `lib/` - Utility functions and shared code

## Features

- Beautiful, modern UI with Tailwind CSS and shadcn UI
- Responsive design for all device sizes
- Dark mode support
- Role-based dashboards (admin, student, teacher, parent, etc.)
- Authentication with Firebase
- Database integration with Firebase

## Package Management

This project uses pnpm for package management. Some useful commands:

- Add a dependency: `pnpm add <package-name>`
- Add a dev dependency: `pnpm add -D <package-name>`
- Update dependencies: `pnpm update`
- Run scripts: `pnpm <script-name>`
# Scribble Hub

A real-time collaborative drawing application built with Next.js, WebSocket, and TypeScript.

## Overview

Scribble Hub is a modern collaborative drawing platform that allows multiple users to draw and interact in real-time. The project is structured as a monorepo using Turborepo for efficient build system and package management.

## Project Structure

### Apps

- `scribbledraw-frontend`: Next.js-based frontend application with real-time canvas
- `http-backend`: REST API server handling authentication and room management
- `ws-backend`: WebSocket server for real-time drawing collaboration

### Packages

- `@repo/ui`: Shared React component library
- `@repo/db`: Prisma-based database package
- `@repo/common`: Shared TypeScript types and utilities
- `@repo/eslint-config`: Shared ESLint configurations
- `@repo/typescript-config`: Shared TypeScript configurations

## Features

- Real-time collaborative drawing canvas
- User authentication and authorization
- Room-based collaboration
- Multiple drawing tools and shapes
- Chat functionality within drawing rooms
- Responsive design

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, WebSocket
- **Database**: PostgreSQL with Prisma ORM
- **Build System**: Turborepo
- **Container**: Docker

## Architecture Diagram
<img width="1347" height="667" alt="image" src="https://github.com/user-attachments/assets/0c78bb0d-cdd9-4541-86dd-42c6a35ad452" />

## Getting Started

### Prerequisites

- Node.js 18 or higher
- pnpm package manager
- Docker and Docker Compose (for production deployment)

### Development

1. Install dependencies:

```bash
pnpm install
```

2. Start the development servers:

```bash
pnpm dev
```

### Production Build

1. Build all applications:

```bash
pnpm build
```

2. Using Docker Compose:

```bash
docker-compose up --build
```

## Project Structure

```
apps/
  ├── http-backend/      # REST API server
  ├── scribbledraw-frontend/  # Next.js frontend
  └── ws-backend/        # WebSocket server
packages/
  ├── common/           # Shared types and utilities
  ├── db/              # Database package with Prisma
  ├── eslint-config/   # Shared ESLint configs
  ├── typescript-config/ # Shared TypeScript configs
  └── ui/              # Shared UI components
```

## Environment Variables

Create a `.env` file in each app directory with the following variables:

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3002
```

### Backend (.env)

```
DATABASE_URL=postgresql://user:password@localhost:5432/scribblehub
JWT_SECRET=your-jwt-secret
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

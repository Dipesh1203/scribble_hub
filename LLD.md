# Low-Level Design (LLD) - Scribble Hub

## 1. Project Overview

**Scribble Hub** is an AI-powered real-time collaborative drawing platform built as a monorepo using **pnpm workspaces** and **Turbo** for managing multiple applications and shared packages.

### Core Components:

- **Frontend**: Next.js 14+ React application
- **HTTP Backend**: Express.js REST API server
- **WebSocket Backend**: Real-time communication server
- **Database**: PostgreSQL with Prisma ORM
- **Shared Packages**: Common types, configurations, and UI components

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Scribble Hub Monorepo                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────┐   ┌──────────────────┐  ┌─────────────┐ │
│  │  Frontend (Next.js)│   │  HTTP Backend    │  │ WS Backend  │ │
│  │  Port: 3000/dev    │   │  Express, Port:  │  │ Port: 3002  │ │
│  │                    │   │  3000            │  │             │ │
│  │ - Canvas Drawing   │   │                  │  │ - Real-time │ │
│  │ - Auth Integration │   │ - REST API       │  │   sync      │ │
│  │ - Room Management  │   │ - JWT Auth       │  │ - JWT Auth  │ │
│  │ - Chat UI          │   │ - User CRUD      │  │ - Multi-user│ │
│  │                    │   │ - Room CRUD      │  │   rooms     │ │
│  └────────────────────┘   │ - Chat Storage   │  └─────────────┘ │
│         │                 └──────────────────┘       ▲          │
│         │                         │                  │          │
│         │ HTTP/REST               │ HTTP/REST        │          │
│         │ NextAuth                │                  │ WS/JSON  │
│         └─────────────────────────┼──────────────────┘          │
│                                   │                             │
│                         ┌─────────▼────────────┐                │
│                         │   PostgreSQL DB      │                │
│                         │  (Prisma Schema)     │                │
│                         │                      │                │
│                         │ - Users              │                │
│                         │ - Rooms              │                │
│                         │ - Chat Messages      │                │
│                         │ - NormalChat Msgs    │                │
│                         └──────────────────────┘                │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Shared Packages (packages/)                │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │    │
│  │  │ common   │ │   db     │ │   ui     │ │eslint-   │    │    │
│  │  │(types)   │ │(prisma)  │ │(buttons) │ │config    │    │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Database Schema (Prisma)

### Models:

#### **User**

```typescript
model User {
  id        String  @id @default(uuid())      // Primary key
  email     String  @unique                   // Unique email
  password  String                            // Bcrypt hashed
  name      String
  photo     String?                           // Optional profile photo

  // Relations
  chats     Chat[]                            // Vector drawing chats
  rooms     Room[]                            // Rooms created by user
  normalChats NormalChat[]                    // Text chats
}
```

**Purpose**: Stores user account information and associations

#### **Room**

```typescript
model Room {
  id        Int       @id @default(autoincrement())
  slug      String    @unique                 // Unique room identifier
  createdAt DateTime  @default(now())
  adminId   String                            // FK to User (room creator)

  // Relations
  chats     Chat[]                            // Vector shapes shared in room
  normalChats NormalChat[]                    // Text messages in room
  admin     User      @relation(fields: [adminId], references: [id])
}
```

**Purpose**: Represents collaborative drawing sessions

#### **Chat**

```typescript
model Chat {
  id       Int     @id @default(autoincrement())
  roomId   Int                                // FK to Room
  message  Json                               // Serialized drawing data
  userId   String                             // FK to User

  room     Room    @relation(fields: [roomId], references: [id])
  user     User    @relation(fields: [userId], references: [id])
}
```

**Purpose**: Stores vector drawing shapes/objects as JSON

#### **NormalChat**

```typescript
model NormalChat {
  id       Int     @id @default(autoincrement())
  roomId   Int                                // FK to Room
  message  String                             // Text message
  userId   String                             // FK to User

  room     Room    @relation(fields: [roomId], references: [id])
  user     User    @relation(fields: [userId], references: [id])
}
```

**Purpose**: Stores text-based chat messages

---

## 4. Authentication Flow

### JWT (JSON Web Token) System

```
┌─────────────────────────────────────────────────────────────┐
│              Authentication Flow                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. User Signup/Signin                                      │
│     └─ POST /api/signup | /api/signin                       │
│        ├─ Validate input (Zod schema)                       │
│        ├─ Check existing user                               │
│        ├─ Hash password (bcrypt, 10 rounds)                 │
│        └─ Generate JWT token                                │
│                                                             │
│  2. Token Storage (Frontend)                                │
│     └─ NextAuth session management                          │
│        └─ Token stored in session                           │
│                                                             │
│  3. Authenticated Requests                                  │
│     ├─ HTTP: Bearer token in Authorization header           │
│     │   Header: "Authorization: Bearer <JWT>"               │
│     ├─ WebSocket: Token in query parameter                  │
│     │   ws://host:3002?token=<JWT>                          │
│     └─ Middleware validates on every request                │
│                                                             │
│  4. Token Verification                                      │
│     └─ jwt.verify(token, JWT_SECRET)                        │
│        ├─ Extract userId                                    │
│        └─ Attach to request (req.userId)                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Backend Architecture

### 5.1 HTTP Backend (Express.js)

**Location**: `apps/http-backend/src/`

#### Routes Structure:

```typescript
POST   /api/signup               // User registration
POST   /api/signin               // User login
PUT    /api/user                 // Update profile (authenticated)
POST   /api/room                 // Create room (authenticated)
GET    /api/room/:slug           // Get room by slug
GET    /api/rooms                // Get user's rooms (authenticated)
GET    /api/chats/:roomId        // Get chat history for room
```

#### Controllers:

**authController.ts**

```
signup(req, res)
  ├─ Validate input with Zod
  ├─ Check email exists
  ├─ Hash password with bcrypt
  ├─ Create user in DB
  └─ Return userId, name, email

signin(req, res)
  ├─ Validate input
  ├─ Find user by email
  ├─ Verify password
  ├─ Generate JWT token
  └─ Return token + user data

updateProfile(req, res)
  ├─ Extract userId from JWT
  ├─ Validate update fields
  ├─ Check email uniqueness
  ├─ Update user record
  └─ Return updated user
```

**roomController.ts**

```
createRoom(req, res)
  ├─ Extract userId from JWT
  ├─ Generate unique room slug
  ├─ Create room with admin = userId
  └─ Return roomId

getRoomBySlug(req, res)
  ├─ Extract slug from params
  ├─ Query room from DB
  └─ Return room object

getUserRooms(req, res)
  ├─ Extract userId from JWT
  ├─ Query rooms where adminId = userId
  ├─ Order by createdAt DESC
  └─ Return rooms array
```

**chatController.ts**

```
getChatsByRoomId(req, res)
  ├─ Extract roomId from params
  ├─ Query Chat and NormalChat records
  └─ Return chat history
```

#### Middleware:

```typescript
middleware(req, res, next)
  ├─ Extract JWT from Authorization header
  ├─ Verify JWT with JWT_SECRET
  ├─ Attach userId to req object
  └─ Call next() or return 401
```

### 5.2 WebSocket Backend (ws library)

**Location**: `apps/ws-backend/src/index.ts`

**WebSocket Server** listens on `ws://localhost:3002`

#### User Structure:

```typescript
interface User {
  ws: WebSocket; // WebSocket connection
  rooms: string[]; // Room IDs user is connected to
  userId: string; // User ID from JWT
}
```

#### Connection Flow:

```
1. Client connects: ws://localhost:3002?token=<JWT>
2. Server extracts token from query params
3. checkUser(token)
   ├─ jwt.verify(token, JWT_SECRET)
   ├─ Extract userId
   └─ Return userId or null
4. If valid, add user to users array
5. If invalid, close connection

Example:
const ws = new WebSocket(`ws://localhost:3002?token=${token}`)
```

#### Message Handling:

```typescript
ws.on("message", async (data) => {
  ├─ Parse JSON data
  ├─ Extract message type
  ├─ Handle based on type:
  │  ├─ JOIN_ROOM: Add user to room
  │  ├─ LEAVE_ROOM: Remove user from room
  │  ├─ DRAW: Broadcast shape to room
  │  └─ CHAT: Broadcast text message
  └─ Persist to database if needed
})
```

---

## 6. Frontend Architecture (Next.js)

**Location**: `apps/scribbledraw-frontend/`

### 6.1 Project Structure

```
app/
├── layout.tsx                 // Root layout with AuthProvider
├── page.tsx                   // Home page
├── globals.css                // Global styles (Tailwind)
├── context/
│   └── AuthProvider.tsx        // NextAuth session wrapper
├── hooks/
│   ├── useSocket.ts            // WebSocket connection hook
│   ├── useCanvasState.ts       // Canvas drawing state
│   ├── useWindowSize.ts        // Responsive sizing
│   └── useWebSocket.ts         // WebSocket state management
├── api/auth/                  // NextAuth routes
├── canvas/
│   └── [roomId]/               // Canvas drawing page (dynamic)
├── room/
│   └── [slug]/                 // Room page with slug
├── rooms/
│   └── page.tsx                // User's rooms list
├── signin/
│   └── page.tsx                // Sign in page
├── signup/
│   └── page.tsx                // Sign up page
└── utils/
    ├── eventHandlerFunction.js // Mouse/touch event handlers
    └── toolbar.js              // Drawing toolbar utilities

components/
├── Canvas.tsx                 // Canvas component (commented)
├── CanvasK.tsx                // Konva-based canvas
├── ChatRoom.tsx               // Chat UI
├── ChatRoomClient.tsx         // Chat client logic
├── RoomCanvas.tsx             // Room with canvas
├── Authpage.tsx               // Auth page wrapper
├── ProfileDropdown.tsx        // User profile menu
├── ShapeGenerator.tsx         // Shape rendering
└── canvas/                    // Canvas sub-components
└── konva-shapes/              // Konva shape components
```

### 6.2 Key Hooks

**useSocket.ts**

```typescript
function useSocket() {
  const [socket, setSocket] = useState<WebSocket>();
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.token) return;

    // Create WebSocket connection with JWT token
    const ws = new WebSocket(`${WS_URL}?token=${session?.token}`);

    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };
  }, [session?.token]);

  return { socket, loading };
}
```

**useCanvasState.ts**

```
Manages:
├─ Current drawing shapes
├─ Selected tool
├─ Canvas transformations (zoom, pan)
├─ Undo/Redo stack
└─ Local drawing cache
```

**useWindowSize.ts**

```
Returns:
├─ window.innerWidth
└─ window.innerHeight
(Updates on resize events)
```

### 6.3 Component Architecture

**Canvas.tsx** (Drawing Canvas)

```
Props: { roomId, socket }
├─ Canvas ref management
├─ Zoom and pan controls
├─ Mouse event listeners
├─ Sends drawing data to WebSocket
└─ Listens for remote drawing updates
```

**ChatRoom.tsx** / **ChatRoomClient.tsx**

```
├─ Fetches chat history via /api/chats/:roomId
├─ Listens to WebSocket for new messages
├─ Sends messages to WebSocket
└─ Renders messages in UI
```

**RoomCanvas.tsx**

```
Combines:
├─ Canvas component
├─ ChatRoom component
└─ Room metadata display
```

### 6.4 Authentication Flow (Frontend)

```
1. NextAuth Integration
   └─ SessionProvider wraps app in AuthProvider

2. Sign Up/Sign In
   ├─ Form submission to /api/signup | /api/signin
   ├─ Backend returns JWT token
   └─ NextAuth stores in session

3. Session Access
   └─ useSession() hook returns session with token

4. Authenticated Requests
   ├─ HTTP: Add "Bearer token" to Authorization header
   ├─ WebSocket: Pass token as query parameter
   └─ Automatic validation on backend
```

---

## 7. Real-Time Synchronization Flow

### Drawing Synchronization

```
User A (Frontend)          WebSocket Server          User B (Frontend)
    │                           │                           │
    │─── Draw Shape ────────►   │                           │
    │                           │                           │
    │                           ├─ Validate JWT             │
    │                           │                           │
    │                           ├─ Find users in room      │
    │                           │                           │
    │                           ├─ Broadcast to room ────► │
    │                           │        │                 │
    │                           │        ├─ Parse data     │
    │                           │        ├─ Render shape   │
    │                           │        └─ Save to DB     │
    │                           │                           │
    │                           ├─ Persist to Chat table   │
    │                           │   (message = JSON shape) │
    │                           │                           │
```

### Message Types (WebSocket Protocol)

```typescript
Interface: {
  type: "JOIN_ROOM" | "LEAVE_ROOM" | "DRAW" | "CHAT"
  roomId?: string
  data?: Json | string
  userId: string
}

Examples:
- JOIN_ROOM: { type: "JOIN_ROOM", roomId: "abc123", userId: "user1" }
- DRAW: { type: "DRAW", roomId: "abc123", data: {shape details}, userId: "user1" }
- CHAT: { type: "CHAT", roomId: "abc123", message: "Hello!", userId: "user1" }
```

---

## 8. Shared Packages

### 8.1 packages/common

**types.ts** - Zod Schemas

```typescript
CreateUserSchema; // { email, password, name }
SigninSchema; // { username, password }
CreateRoomSchema; // { name }
```

**server.address.ts**

```typescript
export const JWT_SECRET = process.env.JWT_SECRET || "secret";
export const WS_URL = process.env.WS_URL || "ws://localhost:3002";
export const DB_URL = process.env.DATABASE_URL;
```

### 8.2 packages/db

**prisma/schema.prisma**

```
Database Configuration:
├─ Provider: postgresql
├─ URL: process.env.DATABASE_URL
├─ Client: prismaClient (exported)
└─ Models: User, Room, Chat, NormalChat
```

Exports:

```typescript
export { PrismaClient } from "@prisma/client";
export const prismaClient = new PrismaClient();
```

### 8.3 packages/ui

Shared UI Components:

```
├─ button.tsx              // Styled button component
├─ card.tsx                // Card container
├─ input.tsx               // Input field
└─ code.tsx                // Code block display
```

### 8.4 packages/eslint-config

```
├─ base.js                 // Base ESLint config
├─ next.js                 // Next.js specific rules
└─ react-internal.js       // React internal rules
```

---

## 9. Data Flow Diagrams

### 9.1 User Registration Flow

```
┌─────────────────┐
│  User Signup    │
│    Form         │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ POST /api/signup                    │
│ Body: {email, password, name}       │
└────────┬────────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ authController.signup()          │
├──────────────────────────────────┤
│ 1. Validate with Zod             │
│ 2. Check email uniqueness        │
│ 3. Hash password (bcrypt)        │
│ 4. Create user in DB             │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Return {userId, name}    │
└──────────────────────────┘
```

### 9.2 Room Creation & Drawing Flow

```
┌──────────────────────────────┐
│ User clicks "Create Room"    │
└────────────┬─────────────────┘
             │
             ▼
┌────────────────────────────────────────┐
│ POST /api/room (with JWT token)        │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ roomController.createRoom()          │
├──────────────────────────────────────┤
│ 1. Extract userId from req.userId    │
│ 2. Generate slug                     │
│ 3. Create room with adminId=userId   │
│ 4. Return roomId/slug                │
└────────┬─────────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ Redirect to /canvas/[roomId]       │
└────────┬───────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ Canvas Page                              │
├──────────────────────────────────────────┤
│ 1. useSocket() connects to WS server     │
│ 2. Send JOIN_ROOM message                │
│ 3. Initialize canvas                     │
└──────────┬───────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│ User draws shape                     │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ socket.send(DRAW event with shape data)  │
└────────┬───────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ WS Server                            │
├──────────────────────────────────────┤
│ 1. Receive DRAW message              │
│ 2. Validate JWT                      │
│ 3. Broadcast to room users           │
│ 4. Save to Chat table (JSON)         │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│ All connected users in room          │
│ receive updated shape data           │
│ and re-render canvas                 │
└──────────────────────────────────────┘
```

---

## 10. API Specifications

### HTTP Endpoints

#### Authentication

```
POST /api/signup
Request:  { email: string, password: string, name: string }
Response: { data: { userId, name, email } }
Status:   201 (Created) | 400 (Invalid) | 409 (Email exists)

POST /api/signin
Request:  { email: string, password: string }
Response: { data: { token: JWT, user: User } }
Status:   200 (OK) | 403 (Not authorized)

PUT /api/user
Headers:  Authorization: Bearer <JWT>
Request:  { name?: string, email?: string, photo?: string }
Response: { data: { user: User } }
Status:   200 (OK) | 401 (Unauthorized) | 409 (Email in use)
```

#### Room Management

```
POST /api/room
Headers:  Authorization: Bearer <JWT>
Request:  (empty body)
Response: { roomId: string }
Status:   200 (OK) | 401 (Unauthorized) | 411 (Room exists)

GET /api/room/:slug
Request:  (no body)
Response: { room: Room }
Status:   200 (OK)

GET /api/rooms
Headers:  Authorization: Bearer <JWT>
Request:  (no body)
Response: { rooms: Room[] }
Status:   200 (OK) | 500 (Error)
```

#### Chat History

```
GET /api/chats/:roomId
Request:  (no body)
Response: { chats: Chat[] | NormalChat[] }
Status:   200 (OK)
```

---

## 11. WebSocket Message Protocol

### Message Format

```typescript
interface Message {
  type: string;
  payload?: any;
  userId: string;
  timestamp?: number;
}
```

### Message Types

```
1. JOIN_ROOM
   Client → Server
   { type: "JOIN_ROOM", roomId: string }

2. LEAVE_ROOM
   Client → Server
   { type: "LEAVE_ROOM", roomId: string }

3. DRAW (Vector shape)
   Client → Server → Room
   {
     type: "DRAW",
     roomId: string,
     data: { x, y, width, height, color, shape }
   }

4. CHAT (Text message)
   Client → Server → Room
   {
     type: "CHAT",
     roomId: string,
     message: string
   }

5. CURSOR (Optional: user cursor position)
   Client → Server → Room
   {
     type: "CURSOR",
     roomId: string,
     x: number,
     y: number
   }
```

---

## 12. Security Considerations

### 1. Authentication

- JWT tokens with configurable `JWT_SECRET`
- Token validation on every request (HTTP & WebSocket)
- Passwords hashed with bcrypt (10 salt rounds)

### 2. Authorization

- Middleware checks JWT on protected routes
- Users can only access their own rooms/data
- Room admin is tracked in database

### 3. Input Validation

- Zod schemas on all API inputs
- Email format validation
- Password strength validation (basic)

### 4. Database Security

- Unique constraints on emails
- Foreign key relationships enforced
- Prepared statements (via Prisma)

### 5. CORS

- CORS enabled on HTTP backend
- WebSocket accessible with valid JWT

---

## 13. Key Technologies & Dependencies

```
Frontend (Next.js App):
├─ Next.js 14+            // React framework
├─ React 18+              // UI library
├─ NextAuth.js            // Authentication
├─ Tailwind CSS           // Styling
├─ TypeScript             // Type safety
├─ Zod                    // Schema validation
├─ WebSocket API          // Real-time communication
└─ Konva.js (optional)    // Canvas drawing library

Backend (Express + Node):
├─ Express.js             // HTTP server
├─ ws (WebSocket)         // WebSocket server
├─ TypeScript             // Type safety
├─ jsonwebtoken           // JWT auth
├─ bcrypt                 // Password hashing
├─ cors                   // CORS middleware
├─ Prisma                 // ORM
└─ PostgreSQL             // Database

Monorepo Tools:
├─ pnpm                   // Package manager
├─ Turbo                  // Build orchestration
├─ TypeScript Config      // Shared configs
└─ ESLint Config          // Linting rules
```

---

## 14. Deployment Architecture

### Docker Support

```
docker/
├─ Dockerfile.backend     // Express backend container
├─ Dockerfile.frontend    // Next.js frontend container
└─ Dockerfile.websocket   // WebSocket backend container

docker-compose.yml        // Development setup
docker-compose.prod.yml   // Production setup
```

### Multi-Service Orchestration

```
Services:
├─ frontend (Next.js): Port 3000
├─ backend (Express): Port 3000
├─ websocket (ws): Port 3002
└─ postgresql: Port 5432
```

---

## 15. State Management & Data Persistence

### Frontend State

- **Session State**: NextAuth (user info, token)
- **Canvas State**: useCanvasState hook
- **Socket State**: useSocket hook
- **UI State**: Local component state (React)

### Backend State

- **Active Users**: In-memory array on WS server
- **Active Rooms**: Derived from user array
- **Persistent Data**: PostgreSQL database

### Synchronization Strategy

1. **Optimistic Updates**: Frontend updates immediately
2. **Broadcasting**: WebSocket sends to all users in room
3. **Persistence**: Server saves to database
4. **History**: Chat/NormalChat tables maintain history

---

## 16. Error Handling & Validation

### Frontend Errors

```
├─ Network errors (connection lost)
├─ Authentication failures (invalid token)
├─ Validation errors (form inputs)
└─ Server errors (5xx responses)
```

### Backend Errors

```
├─ Invalid input (400)
├─ Unauthorized (401)
├─ Conflict (409)
├─ Server errors (500)
└─ Detailed error messages with context
```

### Validation Layers

1. **Frontend**: React form validation + Zod
2. **API**: Zod schema validation
3. **Database**: Prisma constraints
4. **WebSocket**: JWT validation + message parsing

---

## 17. Scalability Considerations

### Current Limitations

- In-memory user storage (not persistent)
- Single WebSocket server instance
- No message queue or event streaming

### Future Enhancements

- Redis for distributed user state
- Message queue (RabbitMQ/Kafka) for reliability
- Load balancing across multiple WebSocket servers
- Room state caching
- Database indexing on frequently queried fields

---

## 18. Development Workflow

### Monorepo Commands

```bash
# Install dependencies
pnpm install

# Development mode (all services)
pnpm dev

# Build all packages
pnpm build

# Lint all packages
pnpm lint

# Format code
pnpm format

# Database commands
pnpm db:generate    # Generate Prisma client

# Individual service startup
pnpm start:web      # Next.js frontend
pnpm start:backend  # Express backend
pnpm start:ws       # WebSocket backend
```

### Turbo Configuration

- Caching of build artifacts
- Intelligent task scheduling
- Dependency graph visualization

---

## 19. Environment Variables

### Required Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/scribble_hub

# Authentication
JWT_SECRET=your_secret_key_here

# WebSocket
WS_URL=ws://localhost:3002

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3000

# NextAuth (if using auth callbacks)
NEXTAUTH_SECRET=your_auth_secret
NEXTAUTH_URL=http://localhost:3000
```

---

## 20. Summary

**Scribble Hub** is a full-stack collaborative drawing application with:

✅ **Real-time synchronization** via WebSocket  
✅ **Persistent storage** with PostgreSQL + Prisma  
✅ **Secure authentication** with JWT + bcrypt  
✅ **Type-safe development** with TypeScript + Zod  
✅ **Scalable monorepo** structure with Turbo  
✅ **Modern frontend** with Next.js + React  
✅ **RESTful + WebSocket APIs** for flexibility  
✅ **Production-ready** Docker configuration

The architecture separates concerns between frontend, HTTP backend, and WebSocket backend while maintaining shared type definitions and utilities through the monorepo structure.

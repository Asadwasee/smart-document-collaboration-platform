# Smart Document Collaboration Platform

A modern, real-time web-based document collaboration platform built with the MERN stack. It seamlessly combines document collaboration, folder/workspace management, version control, granular permissions, and intelligent search into a single unified workspace.


## Table of Contents


## Project Overview
The **Smart Document Collaboration Platform** allows users to create, edit, share, and manage documents in real-time. Think of it as a lightweight hybrid of Google Docs and Notion.

### Key Highlights:


## Key Features
1. **Authentication & Authorization:** JWT-based signup, login, password recovery, email verification, and session management.
2. **Workspaces & Folders:** Organized hierarchies with custom team permissions.
3. **Rich-Text Editor:** Support for headings, lists, tables, code blocks, quotes, and media attachments.
4. **Real-Time Collaboration:** Powered by Socket.IO for cursor tracking, live typing, and online status.
5. **Inline Comments & @Mentions:** Threaded commenting system with user tagging and resolve options.
6. **Version History:** Snapshot tracking, change logs, and one-click version restoration.
7. **Global Search:** Partial matching and filtered search across documents, folders, and workspace members.
8. **Notifications:** Real-time alert panel for mentions, document shares, and comments.
9. **File Management:** Cloud-backed file uploads (PDF, DOCX, Images) with rename/delete/move functionalities.


## Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | React.js, Tailwind CSS, Axios, Lucide React / Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Real-Time Engine** | Socket.IO |
| **File Storage** | Cloudinary / AWS S3 |
| **Authentication** | JSON Web Tokens (JWT) & Bcrypt.js |


## Project Folder Structure

```text
smart-document-collaboration-platform/
│
├── client/                        # React.js Frontend Application
│   ├── public/                    # Static assets & favicon
│   ├── src/
│   │   ├── assets/                # Images, logos, icons
│   │   ├── components/            # Reusable UI components
│   │   │   ├── common/            # Buttons, Modals, Loaders, Inputs
│   │   │   ├── layout/            # Navbar, Sidebar, Footer
│   │   │   ├── editor/            # Rich Text Editor & Toolbar components
│   │   │   ├── comments/          # Comment threads & @mention UI
│   │   │   └── workspace/         # Workspace/Folder management UI
│   │   ├── context/               # React Context (Auth, Socket, Workspace)
│   │   ├── hooks/                 # Custom React hooks (useSocket, useAuth)
│   │   ├── pages/                 # Main Application Pages
│   │   │   ├── Auth/              # Login, Register, Forgot Password
│   │   │   ├── Dashboard/         # User Dashboard & Recent Activity
│   │   │   ├── Workspace/         # Workspace & Folder view
│   │   │   └── Editor/            # Live Document Editor View
│   │   ├── services/              # Axios API service endpoints
│   │   ├── utils/                 # Helper functions & constants
│   │   ├── App.jsx                # Application Routes & Wrappers
│   │   └── main.jsx               # React DOM Entry point
│   ├── .env.example               # Frontend environment template
│   ├── tailwind.config.js         # Tailwind CSS configuration
│   └── package.json
│
├── server/                        # Express.js Backend API & WebSockets
│   ├── src/
│   │   ├── config/                # DB Connection, Cloudinary/S3 & Mailer config
│   │   ├── controllers/           # API Request Handlers
│   │   │   ├── authController.js
│   │   │   ├── documentController.js
│   │   │   ├── workspaceController.js
│   │   │   ├── commentController.js
│   │   │   └── fileController.js
│   │   ├── middleware/            # Auth JWT, Role Validation, Error Handling
│   │   ├── models/                # Mongoose Database Schemas
│   │   │   ├── User.js
│   │   │   ├── Workspace.js
│   │   │   ├── Document.js
│   │   │   ├── Folder.js
│   │   │   ├── Comment.js
│   │   │   ├── VersionHistory.js
│   │   │   └── Notification.js
│   │   ├── routes/                # Express API Route endpoints
│   │   ├── sockets/               # Socket.IO Event Handlers
│   │   │   ├── editorSocket.js    # Live editing & cursor sync
│   │   │   └── presenceSocket.js  # Online status & user presence
│   │   ├── utils/                 # Token generation, helpers
│   │   └── server.js              # Express app initialization & Socket server setup
│   ├── .env.example               # Backend environment template
│   └── package.json
│
├── .gitignore                     # Git ignored files (.env, node_modules)
└── README.md                      # Project documentation

## Getting Started

Install dependencies and start the backend:

```bash
cd server
npm install
copy .env.example .env
npm run dev
```

In another terminal, start the frontend:

```bash
cd client
npm install
npm run dev
```

### Environment variables

The backend loads variables from `server/.env`. Set `MONGO_URI` to either a local MongoDB URI or a MongoDB Atlas URI. The application reads `MONGO_URI`; it does not use separate `MONGODB_USERNAME` and `MONGODB_PASSWORD` variables.

Do not commit or share `server/.env`. Share `server/.env.example` instead. Each partner must provide their own MongoDB credential in their local `.env`, or receive a shared database credential through a private channel. A password-free Atlas URI cannot authenticate to MongoDB.

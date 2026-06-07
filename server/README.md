# SmartNote

A full-stack note-taking web application with smart organization features including pinning, archiving, tagging, and automatic trash cleanup.

---

## Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- React Router DOM
- Axios

**Backend**
- Node.js
- Express.js
- JSON Web Tokens (JWT)
- bcrypt

**Database**
- PostgreSQL (hosted on Supabase)
- pg_cron (auto-delete trashed notes)

---

## Features

- User authentication (register, login, logout) with JWT
- Create, read, update, and delete notes
- Pin notes to keep them at the top
- Archive notes to remove them from the main view
- Soft-delete notes to trash with automatic permanent deletion via pg_cron
- Tag notes and filter by tags
- Responsive layout for mobile, tablet, and desktop

---

## Project Structure

```
SmartNote/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route-level page components
│   │   ├── hooks/           # Custom React hooks
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
├── server/                  # Express backend
│   ├── controllers/         # Route handler logic
│   ├── routes/              # Express route definitions
│   ├── middlewares/         # Auth and other middleware
│   ├── db/                  # PostgreSQL connection config
│   ├── server.js            # App entry point
│   └── package.json
│
├── .env                     # Root env (if applicable)
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- A [Supabase](https://supabase.com) account with a PostgreSQL project set up

---

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/smartnote.git
cd smartnote
```

---

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` folder:

```env
PORT=8080
DATABASE_URL=your_supabase_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

> You can find your `DATABASE_URL` in your Supabase project under **Settings → Database → Connection String (URI)**.

Start the backend dev server:

```bash
npm run dev
```

The API will be running at `http://localhost:8080`.

---

### 3. Set up the frontend

```bash
cd ../client
npm install
```

Create a `.env` file inside the `client/` folder:

```env
VITE_API_URL=http://localhost:8080
```

Start the frontend dev server:

```bash
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## Environment Variables

### Backend (`server/.env`)

| Variable       | Description                                      |
|----------------|--------------------------------------------------|
| `PORT`         | Port the Express server runs on (default: 8080)  |
| `DATABASE_URL` | Supabase PostgreSQL connection string            |
| `JWT_SECRET`   | Secret key used to sign JWT tokens               |
| `NODE_ENV`     | `development` or `production`                    |

### Frontend (`client/.env`)

| Variable        | Description                                  |
|-----------------|----------------------------------------------|
| `VITE_API_URL`  | Base URL of the backend API                  |

---

## API Endpoints

### Auth
| Method | Endpoint             | Description              | Auth Required |
|--------|----------------------|--------------------------|---------------|
| POST   | `/api/auth/register` | Register a new user      | No            |
| POST   | `/api/auth/login`    | Login and receive a JWT  | No            |

### Notes
| Method | Endpoint              | Description              | Auth Required |
|--------|-----------------------|--------------------------|---------------|
| GET    | `/api/notes`          | Get all notes for user   | Yes           |
| POST   | `/api/notes`          | Create a new note        | Yes           |
| PUT    | `/api/notes/:id`      | Update a note            | Yes           |
| DELETE | `/api/notes/:id`      | Delete a note            | Yes           |

### Pin / Archive / Trash
| Method | Endpoint                      | Description              | Auth Required |
|--------|-------------------------------|--------------------------|---------------|
| PATCH  | `/api/notes/:id/pin`          | Toggle pin on a note     | Yes           |
| PATCH  | `/api/notes/:id/archive`      | Toggle archive on a note | Yes           |
| PATCH  | `/api/notes/:id/trash`        | Move note to trash       | Yes           |
| PATCH  | `/api/notes/:id/restore`      | Restore note from trash  | Yes           |

### Tags
| Method | Endpoint                          | Description               | Auth Required |
|--------|-----------------------------------|---------------------------|---------------|
| GET    | `/api/tags`                       | Get all tags for user     | Yes           |
| POST   | `/api/tags`                       | Create a new tag          | Yes           |
| DELETE | `/api/tags/:id`                   | Delete a tag              | Yes           |
| POST   | `/api/notes/:id/tags`             | Add tag to a note         | Yes           |
| DELETE | `/api/notes/:id/tags/:tagId`      | Remove tag from a note    | Yes           |

---

## Database

The database is hosted on Supabase (PostgreSQL). Key tables:

- `users` — stores user accounts with hashed passwords
- `notes` — stores notes with fields for pinned, archived, and trashed status
- `tags` — stores user-created tags
- `note_tags` — junction table linking notes to tags

A `pg_cron` job is configured on Supabase to automatically permanently delete notes that have been in the trash for more than 30 days.

---

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions to deploy on:
- **Render** (backend)
- **Vercel** (frontend)
- **Supabase** (database — already hosted)

---

## License

MIT
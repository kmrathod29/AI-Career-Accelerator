# AI Career Accelerator — Backend

Node.js + Express + MongoDB backend for the AI Career Accelerator platform.

## Prerequisites

- **Node.js** >= 18
- **MongoDB** running locally or a MongoDB Atlas connection string

## Setup

1. Install dependencies:

```bash
cd backend
npm install
```

2. Create your `.env` file from the example:

```bash
cp .env.example .env
```

3. Update `.env` with your values:

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/ai-career-accelerator` |
| `SESSION_SECRET` | Session signing secret (use a strong random string) | Generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `FRONTEND_URL` | Frontend origin for CORS | `http://localhost:5173` |
| `NODE_ENV` | Environment | `development` |

4. Start the server:

```bash
# Development (with auto-restart on file changes)
npm run dev

# Production
npm start
```

## API Endpoints

### Health

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create a new account |
| POST | `/api/auth/login` | Public | Login with credentials |
| POST | `/api/auth/logout` | Protected | Destroy session and logout |
| GET | `/api/auth/me` | Protected | Get current user profile |

### Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "User-friendly error message"
}
```

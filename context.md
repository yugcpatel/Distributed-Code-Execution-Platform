# Distributed Code Execution Platform: Architectural Context

This document serves as the master reference for the current state of the architecture, technology stack, and project structure as of **Day 16**. Use this context to inform future development, agentic ideation, and debugging.

## Technology Stack
- **Frontend**: React (Vite), functional components, custom CSS variables (`data-theme`), Axios.
- **Backend API**: Node.js, Express.js. Acts solely as an API gateway and job producer.
- **Worker Service**: Node.js, BullMQ `Worker`. Acts as the isolated job consumer and execution engine.
- **Queue Layer**: Redis (running via Docker on port `6379`), managed by `bullmq` and `ioredis`.
- **Database Layer**: PostgreSQL (running via Docker on port `5432`), accessed via Prisma ORM v6.4.1.
- **Execution Sandbox**: Docker (`code-runner-python` image).

## System Architecture Flow

1. **Submission**: React frontend `POST`s code to `/api/execute`.
2. **Persistence**: `executionController.js` creates a Prisma `Job` record with `status: "waiting"`.
3. **Queueing**: The controller pushes the job to the BullMQ `"code-execution"` queue, forcing `jobId` to match the Database UUID.
4. **Response**: API returns the Database UUID to the frontend.
5. **Polling**: React frontend begins polling `GET /api/job/:id` every 1000ms.
6. **Consumption**: The standalone Worker Service picks up the job from Redis.
7. **Execution**: The Worker writes a temp `.py` file, mounts it into a tightly locked-down Docker container, captures stdout/stderr, and returns the result to Redis.
8. **Completion**: React polling detects the `"completed"` state via BullMQ, extracts the output, and stops polling.

*(Note: As of Day 16, the Worker does not yet update the PostgreSQL database with the final status. It only updates Redis).*

## Security & Resource Limits (Docker)
Every execution container is invoked with strict limits to prevent abuse:
- `--rm`: Auto-deletes container on exit.
- `--cpus=0.5`: Limits CPU usage to 50% of one core.
- `--memory=128m`: Prevents memory exhaustion attacks.
- `--network=none`: Completely disables internet access inside the sandbox.
- `--read-only`: Mounts the container filesystem as read-only.
- `--tmpfs /tmp`: Provides a secure, temporary scratchpad in RAM.
- **Hard Timeout**: The Node.js worker forcefully kills the Docker process if it exceeds 5000ms.

## Database Schema (Prisma)
```prisma
model Job {
  id            String   @id @default(uuid())
  language      String
  code          String
  status        String   // e.g., waiting, active, completed, failed
  output        String?
  error         String?
  executionTime Int?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

## Directory Structure
```
d:\Study\distributed-code-runner\
├── backend/
│   ├── prisma/             # Schema and migrations
│   ├── src/
│   │   ├── config/         # Prisma client singleton
│   │   ├── controllers/    # executionController, jobController
│   │   ├── middleware/     # errorHandler, requestLogger
│   │   ├── queue/          # bullmq codeQueue, redisConnection
│   │   ├── routes/         # API endpoints
│   │   ├── utils/          # validation utilities
│   │   └── app.js & server.js
│   ├── .env                # DB and API configs
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── pages/          # Home.jsx (Polling logic)
│   │   ├── services/       # Axios API wrapper
│   │   └── index.css       # Theme variables
│   └── package.json
├── worker/
│   ├── src/
│   │   ├── dockerExecutor.js # Sandboxed spawn logic
│   │   ├── redisConnection.js
│   │   └── worker.js       # BullMQ consumer logic
│   ├── temp/               # Temporary execution files
│   └── package.json
├── docker-images/          # Dockerfiles for runner images
└── docker-compose.yml      # (Optional) Future orchestration
```

## Future Reference & Next Steps
- **Day 17 Target**: The Worker Service must be updated to push its final execution results (output, time, status) back into PostgreSQL via Prisma so the database reflects the final state, not just `"waiting"`.

# Distributed Code Execution Platform

A production-grade, local code execution engine designed to securely compile, run, and return output for remote code submissions. 

![Project Overview](https://via.placeholder.com/800x400?text=Distributed+Code+Execution+Platform)

## Overview

This platform provides a rich frontend environment (React + Monaco Editor) coupled with a highly robust backend execution engine (Node.js + Express). It handles raw code submissions, safely executes them via child processes, streams outputs and tracebacks, and aggressively manages server resources using an automated garbage-collection system.

## Key Features

- **Multi-Language Support**: Currently supports Python and JavaScript out of the box, with an extensible `services/execution` architecture ready for C++ and Java.
- **Robust Error Handling**: Centralized `AppError` middleware accurately distinguishes between user syntax errors (400) and actual server failures (500).
- **Execution Metadata**: Tracks precise execution times (ms) and metadata tracking for every job.
- **File Lifecycle Management**: Automatically structures and provisions UUID-based temporary files, executing and purging them efficiently.
- **Background Garbage Collection**: A detached daemon process constantly sweeps the disk for abandoned execution files resulting from unexpected server crashes, preventing disk bloat.
- **System Logging**: Full API request logging and permanent `.log` storage for every executed job.

## Architecture

To understand the complete flow of data—from the frontend request down to local OS execution and background cleanup—please read our [System Architecture Guide](backend/docs/architecture.md).

## Setup & Installation

### Prerequisites
- Node.js (v18+)
- Python (v3.8+)

### Backend Initialization
```bash
cd backend
npm install
npm run dev
```

### Frontend Initialization
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Execute Code
`POST /api/execute`

**Request Payload:**
```json
{
  "language": "python",
  "code": "print('Hello World')"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "output": "Hello World\n",
    "executionTime": 142,
    "jobId": "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
    "createdAt": 1718420000000
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Traceback (most recent call last):\nZeroDivisionError: division by zero"
}
```

# Adaptive Railway Emergency Management - Flask Backend

This directory contains the Python **Flask** backend for the RailSafe Adaptive Railway Emergency Management System.

## Architecture

The project supports dual-backend parity:
- **Node.js + Express.js**: Runs live on port 3000 alongside the React Vite frontend in the container.
- **Python 3 + Flask**: Full REST and SSE event stream implementation matching identical endpoints and response payloads.

## Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/health` | Service health, train number, active incidents count |
| `GET` | `/api/telemetry` | Speed, braking status, next station, catenary voltage |
| `POST` | `/api/telemetry/brakes` | Engage emergency brakes / restore normal line pressure |
| `GET` | `/api/emergency/reports` | List all reported passenger emergencies |
| `POST` | `/api/emergency/reports` | Submit emergency hazard report |
| `POST` | `/api/emergency/buzzer` | Trigger 1-Tap Passenger SOS Buzzer |
| `POST` | `/api/emergency/silence` | Silence active sirens |
| `GET` | `/api/broadcasts` | Current staff broadcast push notifications |
| `POST` | `/api/broadcasts` | Send coach-specific or train-wide safety broadcast |
| `GET` | `/api/events` | Server-Sent Events (SSE) real-time streaming channel |

## Running Locally

```bash
cd backend_flask
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 app.py
```

The Flask server will start on `http://0.0.0.0:5000`.
Visit `http://localhost:5000/` to test endpoints via the built-in HTML documentation console.

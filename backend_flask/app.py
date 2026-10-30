"""
Adaptive Railway Emergency Management System - Python Flask Backend
Provides RESTful API and Server-Sent Events (SSE) for passenger SOS buzzers,
real-time broadcast alerts, coach evacuation blueprints, and train telemetry.
"""

import time
import json
import random
from typing import Dict, List, Any
from flask import Flask, request, jsonify, Response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# In-Memory State Store
reports: List[Dict[str, Any]] = [
    {
        "id": "RPT-101",
        "type": "medical",
        "coach": "A2",
        "seatOrLocation": "Berth 14 (Lower)",
        "description": "Elderly passenger experiencing acute shortness of breath and chest pain.",
        "severity": "high",
        "timestamp": int(time.time() * 1000) - 1000 * 60 * 12,
        "status": "dispatched",
        "isBuzzer": False,
        "affectedCount": "1 person",
        "assignedTeam": "Rapid Medical First-Responder Unit (Coach A1)",
        "reporterContact": "+91 98765 43210"
    },
    {
        "id": "RPT-102",
        "type": "suspicious",
        "coach": "Pantry",
        "seatOrLocation": "Aisle near dry food rack",
        "description": "Unattended metallic suitcase without tag for 45+ minutes.",
        "severity": "medium",
        "timestamp": int(time.time() * 1000) - 1000 * 60 * 25,
        "status": "acknowledged",
        "isBuzzer": False,
        "affectedCount": "Coach area",
        "assignedTeam": "RPF Rail Security Wing"
    }
]

active_broadcast: Dict[str, Any] | None = None
broadcast_history: List[Dict[str, Any]] = []
is_buzzer_active: bool = False
active_buzzer_incident: Dict[str, Any] | None = None

telemetry = {
    "trainNumber": "12952",
    "trainName": "New Delhi - Mumbai Tejas Rajdhani Express",
    "currentSpeedKmph": 118,
    "targetSpeedKmph": 130,
    "nextStation": "Kota Junction (KOTA)",
    "etaNextStationMin": 22,
    "totalCoaches": 22,
    "currentLocation": "Section 481-B (Mathura - Kota High-Speed Corridor)",
    "lastUpdated": int(time.time() * 1000),
    "emergencyBrakingStatus": "normal",
    "brakeLinePressureBar": 5.0,
    "trackGradient": "+0.2% (Gentle Ascent)",
    "catenaryVoltageKV": 25.1,
    "locoPilot": "Rajesh Sharma (Chief Loco Pilot)",
    "guard": "Sunil Verma (Head Guard)"
}

rescue_units = [
    {
        "id": "UNIT-MED-1",
        "incidentId": "RPT-101",
        "name": "Coach A1 Paramedic Response Kit",
        "type": "medical_rapid",
        "status": "en_route",
        "etaMinutes": 2,
        "contactNumber": "+91 94250 11223"
    },
    {
        "id": "UNIT-SEC-1",
        "incidentId": "RPT-102",
        "name": "RPF Train Security Escort Squad",
        "type": "rpf_security",
        "status": "on_scene",
        "etaMinutes": 0,
        "contactNumber": "+91 94250 88990"
    }
]

# -------------------------------------------------------------
# ROOT & API DOCS INTERACTIVE HTML
# -------------------------------------------------------------
@app.route("/", methods=["GET"])
def index():
    return """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>RailSafe Flask Emergency API</title>
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; background: #020617; color: #f8fafc; padding: 2rem; }
        .card { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 1.5rem; max-width: 900px; margin: 0 auto; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
        h1 { color: #f59e0b; margin-top: 0; display: flex; align-items: center; gap: 0.5rem; }
        .badge { background: #10b981; color: #022c22; font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 9999px; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        th, td { text-align: left; padding: 0.75rem; border-bottom: 1px solid #1e293b; font-size: 0.875rem; }
        th { color: #94a3b8; }
        code { background: #1e293b; padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace; color: #38bdf8; }
        .btn { display: inline-block; background: #e11d48; color: white; padding: 0.5rem 1rem; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 0.875rem; }
    </style>
</head>
<body>
    <div class="card">
        <h1>🚄 Adaptive Railway Emergency Management <span class="badge">Flask 3.x Online</span></h1>
        <p style="color: #94a3b8;">High-availability Python Flask backend for Train 12952 Emergency Operations.</p>
        
        <h3>Available API Endpoints:</h3>
        <table>
            <tr><th>Method</th><th>Endpoint</th><th>Purpose</th></tr>
            <tr><td><code>GET</code></td><td><code>/api/health</code></td><td>Service status, incident count & telemetry</td></tr>
            <tr><td><code>GET</code></td><td><code>/api/telemetry</code></td><td>Train speed, braking pressure, GPS corridor</td></tr>
            <tr><td><code>POST</code></td><td><code>/api/telemetry/brakes</code></td><td>Engage/Release Emergency Brakes</td></tr>
            <tr><td><code>GET / POST</code></td><td><code>/api/emergency/reports</code></td><td>List & Submit passenger emergency hazards</td></tr>
            <tr><td><code>POST</code></td><td><code>/api/emergency/buzzer</code></td><td>Trigger High-Priority 1-Tap SOS Buzzer</td></tr>
            <tr><td><code>POST</code></td><td><code>/api/emergency/silence</code></td><td>Silence train-wide sirens</td></tr>
            <tr><td><code>GET / POST</code></td><td><code>/api/broadcasts</code></td><td>Active staff broadcast push notifications</td></tr>
            <tr><td><code>GET</code></td><td><code>/api/events</code></td><td>Server-Sent Events (SSE) live push stream</td></tr>
        </table>
        <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
            <a class="btn" href="/api/health" target="_blank">Test /api/health (JSON)</a>
            <a class="btn" style="background: #2563eb;" href="/api/telemetry" target="_blank">Test /api/telemetry</a>
        </div>
    </div>
</body>
</html>"""

# -------------------------------------------------------------
# REST API ENDPOINTS
# -------------------------------------------------------------

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "runtime": "Python 3 + Flask",
        "nodeExpressCompanion": "Supported on Port 3000",
        "version": "2.0.0-adaptive-emergency-flask",
        "timestamp": int(time.time() * 1000),
        "train": telemetry["trainNumber"],
        "activeIncidents": len([r for r in reports if r["status"] != "resolved"]),
        "activeBroadcast": active_broadcast is not None,
        "isBuzzerActive": is_buzzer_active
    })

@app.route("/api/telemetry", methods=["GET"])
def get_telemetry():
    return jsonify({"success": True, "data": telemetry})

@app.route("/api/telemetry/brakes", methods=["POST"])
def toggle_brakes():
    data = request.get_json() or {}
    action = data.get("action", "engage")
    if action == "engage":
        telemetry["emergencyBrakingStatus"] = "emergency_stop_engaged"
        telemetry["brakeLinePressureBar"] = 0.0
        telemetry["currentSpeedKmph"] = max(0, telemetry["currentSpeedKmph"] - 45)
    else:
        telemetry["emergencyBrakingStatus"] = "normal"
        telemetry["brakeLinePressureBar"] = 5.0
        telemetry["currentSpeedKmph"] = 90
    telemetry["lastUpdated"] = int(time.time() * 1000)
    return jsonify({"success": True, "data": telemetry})

@app.route("/api/emergency/reports", methods=["GET", "POST"])
def handle_reports():
    global reports
    if request.method == "GET":
        return jsonify({
            "success": True,
            "total": len(reports),
            "data": reports
        })
    
    body = request.get_json() or {}
    report_type = body.get("type")
    coach = body.get("coach")
    description = body.get("description")

    if not report_type or not coach or not description:
        return jsonify({"success": False, "error": "Missing required fields"}), 400

    new_report = {
        "id": f"RPT-{random.randint(100, 999)}",
        "type": report_type,
        "coach": coach.upper(),
        "seatOrLocation": body.get("seatOrLocation", "Unspecified Berth"),
        "description": description,
        "severity": body.get("severity", "high"),
        "timestamp": int(time.time() * 1000),
        "status": "pending",
        "isBuzzer": False,
        "affectedCount": body.get("affectedCount", "1 person"),
        "reporterContact": body.get("reporterContact", "")
    }

    reports.insert(0, new_report)
    return jsonify({"success": True, "data": new_report}), 201

@app.route("/api/emergency/buzzer", methods=["POST"])
def trigger_buzzer():
    global is_buzzer_active, active_buzzer_incident, active_broadcast, reports
    body = request.get_json() or {}
    coach = body.get("coach", "B6")
    seat = body.get("seat", "Berth 28")

    buzzer_report = {
        "id": f"SOS-BUZZER-{random.randint(1000, 9999)}",
        "type": "extreme_buzzer",
        "coach": coach,
        "seatOrLocation": seat,
        "description": f"EMERGENCY 1-TAP PASSENGER SOS BUZZER ACTIVATED in Coach {coach}, {seat}! Immediate intervention required.",
        "severity": "critical",
        "timestamp": int(time.time() * 1000),
        "status": "pending",
        "isBuzzer": True,
        "affectedCount": "Coach Passengers",
        "assignedTeam": "Train Guard & Immediate RPF Escort"
    }

    reports.insert(0, buzzer_report)
    is_buzzer_active = True
    active_buzzer_incident = buzzer_report

    active_broadcast = {
        "id": f"BCST-SOS-{int(time.time() * 1000)}",
        "title": f"🚨 EMERGENCY ALARM IN COACH {coach}",
        "type": "extreme_buzzer",
        "message": f"A high-priority passenger SOS alarm was activated at Coach {coach}, {seat}. Train crew and security dispatched.",
        "affectedCoaches": [coach, "ALL"],
        "severity": "critical",
        "timestamp": int(time.time() * 1000),
        "exitGuidance": "Locate primary exit doors or vestibule gangways. Wait for staff instructions.",
        "isActive": True,
        "soundAlarm": True,
        "evacuationRecommended": False
    }

    return jsonify({
        "success": True,
        "message": "Extreme SOS buzzer broadcasted train-wide via Flask",
        "incident": buzzer_report,
        "broadcast": active_broadcast
    })

@app.route("/api/emergency/silence", methods=["POST"])
def silence_buzzer():
    global is_buzzer_active
    is_buzzer_active = False
    return jsonify({"success": True, "message": "Emergency alarm silenced in Flask backend"})

@app.route("/api/broadcasts", methods=["GET", "POST"])
def handle_broadcasts():
    global active_broadcast, broadcast_history
    if request.method == "GET":
        return jsonify({
            "success": True,
            "activeBroadcast": active_broadcast,
            "history": broadcast_history
        })
    
    body = request.get_json() or {}
    new_broadcast = {
        "id": f"BCST-{int(time.time() * 1000)}",
        "title": body.get("title", "URGENT SAFETY ADVISORY"),
        "type": body.get("type", "fire"),
        "message": body.get("message", ""),
        "affectedCoaches": body.get("affectedCoaches", ["ALL"]),
        "severity": body.get("severity", "critical"),
        "timestamp": int(time.time() * 1000),
        "exitGuidance": body.get("exitGuidance", "Proceed calmly to safe vestibules."),
        "isActive": True,
        "soundAlarm": body.get("soundAlarm", True),
        "evacuationRecommended": body.get("evacuationRecommended", True)
    }

    if active_broadcast:
        broadcast_history.insert(0, active_broadcast)
    active_broadcast = new_broadcast

    return jsonify({"success": True, "data": new_broadcast}), 201

# Server-Sent Events stream
@app.route("/api/events", methods=["GET"])
def events():
    def event_stream():
        # Initial state
        initial_data = {
            "telemetry": telemetry,
            "reports": reports,
            "activeBroadcast": active_broadcast,
            "isBuzzerActive": is_buzzer_active,
            "rescueUnits": rescue_units
        }
        yield f"event: init\ndata: {json.dumps(initial_data)}\n\n"
        
        # Keepalive heartbeat
        while True:
            time.sleep(15)
            yield f"event: ping\ndata: {json.dumps({'time': int(time.time() * 1000)})}\n\n"

    return Response(event_stream(), mimetype="text/event-stream")

if __name__ == "__main__":
    print("🚀 Starting Flask Railway Emergency Backend on http://0.0.0.0:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)

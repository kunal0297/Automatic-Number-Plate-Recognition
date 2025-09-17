## Automatic Number Plate Recognition

An end‑to‑end ANPR system with a web UI and REST API.

### Features

- Detects vehicles and license plates on video input
- Tracks vehicles across frames
- Reads plate text and writes structured results to CSV
- Generates an annotated output video
- Computes summary metrics (e.g., confidence summaries, readability ratio)
- Frontend UI (upload, run, preview results/video)
- Backend API to orchestrate the pipeline

### Tech stack

- Detection/tracking/OCR implemented in Python (YOLO‑based detector, Kalman/association tracking, OCR engine)
- OpenCV for post‑processing and video rendering
- FastAPI for the REST endpoints
- React + Vite + Tailwind for the frontend

### Project layout

```
├─ main.py                  # detection + tracking + OCR → test.csv
├─ add_missing_data.py      # interpolation → test_interpolated.csv
├─ visualize.py             # annotated video out.mp4 (+ metrics.json/txt)
├─ server.py                # FastAPI: /api/upload, /api/run, /api/results, /media/out.mp4
├─ models/                  # weights
├─ frontend/                # React UI (Vite + Tailwind)
└─ sample.mp4               # input video (overwritten on upload)
```

### Setup

1) Install Python deps

```
python -m pip install -r requirements.txt
```

2) Start backend (port 8000)

```
python -m uvicorn server:app --host 0.0.0.0 --port 8000
```

3) Start frontend (port 5173)

```
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

### API

- POST /api/upload (multipart "file") → saves as sample.mp4
- POST /api/run → run full pipeline (detection → interpolation → visualization)
- GET /api/results → JSON of CSV rows
- GET /media/out.mp4 → annotated video

### Outputs

- test.csv, test_interpolated.csv
- out.mp4
- metrics.json, metrics.txt

### Notes

- Uploaded videos are renamed to sample.mp4 in the repo root for a predictable path.
- Place your trained plate detector at models/license_plate_detector.pt.

"# Automatic-Number-Plate-Recognition" 

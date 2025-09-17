Frontend for ANPR (React + Vite + Tailwind)

Quick start

1) Install Node.js 18+
2) In this folder:
   npm install
   npm run dev

The app expects backend endpoints:
- POST /api/upload (multipart form file: "file") → save as sample.mp4
- POST /api/run → runs detection and creates test.csv, test_interpolated.csv and out.mp4
- GET /api/results → returns JSON array parsed from test_interpolated.csv (or test.csv)
- GET /media/out.mp4 → serves the annotated video

You can later configure a proxy in vite.config.ts to your backend host/port if needed.




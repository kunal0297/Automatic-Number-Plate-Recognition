import os
import shutil
import subprocess
from pathlib import Path
from typing import List

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

BASE_DIR = Path(__file__).resolve().parent
SAMPLE_PATH = BASE_DIR / 'sample.mp4'
OUT_VIDEO = BASE_DIR / 'out.mp4'
CSV_PATH = BASE_DIR / 'test.csv'
CSV_INTERP = BASE_DIR / 'test_interpolated.csv'

app = FastAPI(title='ANPR Server')
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.post('/api/upload')
async def upload_video(file: UploadFile = File(...)):
    try:
        tmp_path = BASE_DIR / f'upload_{file.filename}'
        with tmp_path.open('wb') as f:
            shutil.copyfileobj(file.file, f)
        # Move/rename to sample.mp4 in project root
        if SAMPLE_PATH.exists():
            SAMPLE_PATH.unlink()
        tmp_path.rename(SAMPLE_PATH)
        return {"status": "ok", "filename": 'sample.mp4'}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post('/api/run')
def run_detection():
    # Clean previous outputs
    for p in [CSV_PATH, CSV_INTERP, OUT_VIDEO]:
        try:
            if p.exists():
                p.unlink()
        except Exception:
            pass

    # Run main.py to generate test.csv
    try:
        subprocess.run(['python', 'main.py'], cwd=str(BASE_DIR), check=True)
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f'Error running main.py: {e}')

    if not CSV_PATH.exists():
        raise HTTPException(status_code=500, detail='test.csv not created')

    # Interpolate and create out.mp4 via visualize.py
    try:
        subprocess.run(['python', 'add_missing_data.py'], cwd=str(BASE_DIR), check=True)
        subprocess.run(['python', 'visualize.py'], cwd=str(BASE_DIR), check=True)
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f'Post-processing error: {e}')

    return {"status": "ok"}


@app.get('/api/results')
def get_results():
    if not CSV_INTERP.exists() and not CSV_PATH.exists():
        raise HTTPException(status_code=404, detail='No results available')
    path = CSV_INTERP if CSV_INTERP.exists() else CSV_PATH
    # Convert CSV to JSON rows
    rows: List[dict] = []
    with path.open('r', encoding='utf-8') as f:
        header = f.readline().strip().split(',')
        for line in f:
            parts = []
            cur = ''
            in_brackets = 0
            for ch in line.strip():
                if ch == '[':
                    in_brackets += 1
                if ch == ']':
                    in_brackets -= 1
                if ch == ',' and in_brackets == 0:
                    parts.append(cur)
                    cur = ''
                else:
                    cur += ch
            if cur:
                parts.append(cur)
            item = {header[i]: parts[i] for i in range(min(len(header), len(parts)))}
            rows.append(item)
    return JSONResponse(rows)


@app.get('/media/out.mp4')
def media_out():
    if not OUT_VIDEO.exists():
        raise HTTPException(status_code=404, detail='out.mp4 not found')
    return FileResponse(str(OUT_VIDEO), media_type='video/mp4')



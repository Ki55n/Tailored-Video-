"""
Tailored Video — Python Backend Server
FastAPI server providing upload/edit endpoints.
"""
import os
import time
import asyncio
import shutil
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

app = FastAPI(title="Tailored Video Server", version="1.0.0")

# CORS — allow the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories
BASE_DIR = Path(__file__).resolve().parent
UPLOADS_DIR = BASE_DIR / "uploads"
EDITED_DIR = BASE_DIR / "edited"

UPLOADS_DIR.mkdir(exist_ok=True)
EDITED_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {".mp4", ".mov", ".avi", ".mkv", ".webm", ".wmv", ".flv", ".m4v"}


@app.get("/")
async def health():
    return {"status": "online", "service": "Tailored Video Server", "version": "1.0.0"}


@app.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    """Upload a video file to the server's uploads/ folder."""
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    dest = UPLOADS_DIR / file.filename
    with open(dest, "wb") as f:
        shutil.copyfileobj(file.file, f)

    size_mb = round(dest.stat().st_size / (1024 * 1024), 2)
    return {
        "status": "success",
        "filename": file.filename,
        "size_mb": size_mb,
        "path": f"/uploads/{file.filename}",
    }


@app.get("/uploads/{filename}")
async def serve_uploaded(filename: str):
    """Serve an uploaded video file."""
    filepath = UPLOADS_DIR / filename
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(filepath, media_type="video/mp4")


@app.post("/generate-edit")
async def generate_edit(filename: str = Form(...), query: str = Form("")):
    """
    Mimic AI editing: simulate processing delay then return the
    pre-placed video from edited/ folder with the same filename.
    """
    edited_path = EDITED_DIR / filename

    if not edited_path.exists():
        # Fallback: if no edited version exists, copy the upload as-is
        uploaded_path = UPLOADS_DIR / filename
        if not uploaded_path.exists():
            raise HTTPException(
                status_code=404,
                detail=f"No uploaded file '{filename}' found. Upload a video first.",
            )
        shutil.copy2(uploaded_path, edited_path)

    # Simulate AI processing time (3-5 seconds)
    await asyncio.sleep(3)

    return {
        "status": "success",
        "filename": filename,
        "query": query,
        "message": "AI edit complete. Your video has been enhanced.",
        "download_url": f"/edited/{filename}",
    }


@app.get("/edited/{filename}")
async def serve_edited(filename: str):
    """Serve an edited video file."""
    filepath = EDITED_DIR / filename
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="Edited file not found")
    return FileResponse(filepath, media_type="video/mp4")


@app.get("/files")
async def list_files():
    """List all uploaded and edited files."""
    uploads = [f.name for f in UPLOADS_DIR.iterdir() if f.is_file()]
    edited = [f.name for f in EDITED_DIR.iterdir() if f.is_file()]
    return {"uploads": uploads, "edited": edited}

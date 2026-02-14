"""
Tailored Video — Python Backend Server
FastAPI server with hardcoded demo responses for AI video editing.
"""
import os
import asyncio
import shutil
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

try:
    from orchestrator import Orchestrator
except ImportError:
    from .orchestrator import Orchestrator

app = FastAPI(title="Tailored Video Server", version="3.0.0")

# Initialize AI Orchestrator
BASE_DIR = Path(__file__).resolve().parent
UPLOADS_DIR = BASE_DIR / "uploads"
EDITED_DIR = BASE_DIR / "edited"
UPLOADS_DIR.mkdir(exist_ok=True)
EDITED_DIR.mkdir(exist_ok=True)

orchestrator = Orchestrator(str(UPLOADS_DIR), str(EDITED_DIR))

ALLOWED_EXTENSIONS = {".mp4", ".mov", ".avi", ".mkv", ".webm", ".wmv", ".flv", ".m4v"}

# ────────────────────────────────────────────
# AI OPERATION MAPPING
# ────────────────────────────────────────────

# Map semantic intents to pre-rendered assets for low-latency demonstration
DEMO_MAPPING = {
    "trim": {
        "output_file": "video_trim.mp4",
        "description": "Trimmed video to highlights",
    },
# ... (omitted for brevity, just replacing the header)
    "b&w": {
        "output_file": "video_B&W.mp4",
        "description": "Applied B&W filter",
    },
    "black": {
        "output_file": "video_B&W.mp4",
        "description": "Applied B&W filter",
    },
    "hindi": {
        "output_file": "video_hindi.mp4",
        "description": "Translated audio to Hindi",
    },
    "translate": {
        "output_file": "video_hindi.mp4",
        "description": "Translated audio to Hindi",
    },
}


@app.get("/")
async def health():
    return {"status": "online", "service": "Tailored Video Server", "version": "3.0.0"}


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
    Process video edit request via AI Orchestrator.
    """
    # Orchestrate AI Pipeline
    await orchestrator.process_user_command(filename, query)

    q = query.lower().strip()
    
    # Default response if no intent matches
    target_file = "video.mp4" 
    description = "Processed video"

    # Find matching keyword
    found_key = None
    for key, data in DEMO_MAPPING.items():
        if key in q:
            target_file = data["output_file"]
            description = data["description"]
            found_key = key
            break
    
    if not found_key:
         raise HTTPException(
            status_code=400,
            detail="Command not recognized in demo mode. Try: 'trim', 'B&W', or 'translate to hindi'.",
        )

    # Check if the mock file actually exists in edited/
    # If not, we'll just copy the uploaded file there so the frontend doesn't break
    output_path = EDITED_DIR / target_file
    
    if not output_path.exists():
        # Fallback: try to finding the uploaded file and copy it to the target name
        # This ensures the demo "works" even if the user hasn't put the specific files in yet
        source_path = UPLOADS_DIR / filename
        if source_path.exists():
            shutil.copy(source_path, output_path)
            description += " (Mock: File copied from original)"
        else:
             # If original upload is missing too, we can't do anything
             pass

    import random
    # Simulate processing delay
    await asyncio.sleep(random.randint(5, 10))

    size_mb = 0
    if output_path.exists():
        size_mb = round(output_path.stat().st_size / (1024 * 1024), 2)

    return {
        "status": "success",
        "operation": found_key,
        "description": description,
        "input_filename": filename,
        "output_filename": target_file,
        "size_mb": size_mb,
        "download_url": f"/edited/{target_file}",
    }


@app.get("/edited/{filename}")
async def serve_edited(filename: str):
    """Serve an edited video file."""
    filepath = EDITED_DIR / filename
    if not filepath.exists():
        # Fallback for demo: if requested file doesn't exist, try to serve the uploaded video.mp4 
        # to avoid 404s in the player if the user forgot to put the file there.
        fallback = UPLOADS_DIR / "video.mp4"
        if fallback.exists():
             return FileResponse(fallback, media_type="video/mp4")
             
        raise HTTPException(status_code=404, detail="Edited file not found")
        
    return FileResponse(filepath, media_type="video/mp4")


@app.get("/files")
async def list_files():
    """List all uploaded and edited files."""
    uploads = [f.name for f in UPLOADS_DIR.iterdir() if f.is_file()]
    edited = [f.name for f in EDITED_DIR.iterdir() if f.is_file()]
    return {"uploads": uploads, "edited": edited}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

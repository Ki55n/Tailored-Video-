"""
Tailored Video — Python Backend Server
FastAPI server with ffmpeg-based video editing pipeline.
"""
import os
import subprocess
import asyncio
import shutil
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

app = FastAPI(title="Tailored Video Server", version="2.0.0")

# CORS — allow the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
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

# ────────────────────────────────────────────
# Video editing operations (ffmpeg commands)
# ────────────────────────────────────────────

OPERATIONS = {
    "trim": {
        "suffix": "_trim",
        "description": "Trimmed to first 20 seconds",
        "build_cmd": lambda inp, out: [
            "ffmpeg", "-y", "-i", str(inp),
            "-t", "20", "-c", "copy",
            str(out)
        ],
    },
    "bw": {
        "suffix": "_bw",
        "description": "Applied black & white filter",
        "build_cmd": lambda inp, out: [
            "ffmpeg", "-y", "-i", str(inp),
            "-vf", "hue=s=0",
            "-c:a", "copy",
            str(out)
        ],
    },
    "speed": {
        "suffix": "_speed",
        "description": "Sped up 2×",
        "build_cmd": lambda inp, out: [
            "ffmpeg", "-y", "-i", str(inp),
            "-filter_complex", "[0:v]setpts=0.5*PTS[v];[0:a]atempo=2.0[a]",
            "-map", "[v]", "-map", "[a]",
            str(out)
        ],
    },
    "slow": {
        "suffix": "_slow",
        "description": "Slowed down 0.5×",
        "build_cmd": lambda inp, out: [
            "ffmpeg", "-y", "-i", str(inp),
            "-filter_complex", "[0:v]setpts=2.0*PTS[v];[0:a]atempo=0.5[a]",
            "-map", "[v]", "-map", "[a]",
            str(out)
        ],
    },
    "reverse": {
        "suffix": "_reverse",
        "description": "Reversed video",
        "build_cmd": lambda inp, out: [
            "ffmpeg", "-y", "-i", str(inp),
            "-vf", "reverse",
            "-af", "areverse",
            str(out)
        ],
    },
    "blur": {
        "suffix": "_blur",
        "description": "Applied gaussian blur",
        "build_cmd": lambda inp, out: [
            "ffmpeg", "-y", "-i", str(inp),
            "-vf", "boxblur=10:5",
            "-c:a", "copy",
            str(out)
        ],
    },
    "rotate": {
        "suffix": "_rotate",
        "description": "Rotated 90° clockwise",
        "build_cmd": lambda inp, out: [
            "ffmpeg", "-y", "-i", str(inp),
            "-vf", "transpose=1",
            "-c:a", "copy",
            str(out)
        ],
    },
}

# Map user-friendly keywords → operation key
KEYWORD_MAP = {
    "trim": "trim",
    "cut": "trim",
    "shorten": "trim",
    "b&w": "bw",
    "bw": "bw",
    "black and white": "bw",
    "black & white": "bw",
    "grayscale": "bw",
    "greyscale": "bw",
    "speed up": "speed",
    "speed": "speed",
    "fast": "speed",
    "faster": "speed",
    "2x": "speed",
    "slow down": "slow",
    "slow": "slow",
    "slower": "slow",
    "0.5x": "slow",
    "reverse": "reverse",
    "backwards": "reverse",
    "blur": "blur",
    "gaussian": "blur",
    "rotate": "rotate",
    "rotate 90": "rotate",
    "turn": "rotate",
}


def parse_command(query: str) -> str | None:
    """Match a user query to an operation key."""
    q = query.lower().strip()
    # Try longest match first (e.g. "black and white" before "black")
    for keyword in sorted(KEYWORD_MAP.keys(), key=len, reverse=True):
        if keyword in q:
            return KEYWORD_MAP[keyword]
    return None


# ────────────────────────────────────────────
# API Endpoints
# ────────────────────────────────────────────

@app.get("/")
async def health():
    return {"status": "online", "service": "Tailored Video Server", "version": "2.0.0"}


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
    Parse the AI command, apply ffmpeg operation, save to edited/.
    Filename can be from uploads/ or edited/ (for chaining).
    """
    # Parse the command
    operation_key = parse_command(query)
    if not operation_key:
        raise HTTPException(
            status_code=400,
            detail=f"Could not understand command: '{query}'. Try: trim, b&w, speed up, slow down, reverse, blur, rotate.",
        )

    operation = OPERATIONS[operation_key]

    # Determine input file: check edited/ first, then uploads/
    input_path = EDITED_DIR / filename
    if not input_path.exists():
        input_path = UPLOADS_DIR / filename
    if not input_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"File '{filename}' not found in uploads or edited.",
        )

    # Build output filename: {stem}{suffix}{ext}
    stem = Path(filename).stem
    ext = Path(filename).suffix
    output_filename = f"{stem}{operation['suffix']}{ext}"
    output_path = EDITED_DIR / output_filename

    # Run ffmpeg
    cmd = operation["build_cmd"](input_path, output_path)
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=120,
        )
        if result.returncode != 0:
            raise HTTPException(
                status_code=500,
                detail=f"FFmpeg error: {result.stderr[-500:] if result.stderr else 'Unknown error'}",
            )
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=500, detail="Processing timed out (120s limit)")

    size_mb = round(output_path.stat().st_size / (1024 * 1024), 2)

    return {
        "status": "success",
        "operation": operation_key,
        "description": operation["description"],
        "input_filename": filename,
        "output_filename": output_filename,
        "size_mb": size_mb,
        "download_url": f"/edited/{output_filename}",
    }


@app.get("/edited/{filename}")
async def serve_edited(filename: str):
    """Serve an edited video file."""
    filepath = EDITED_DIR / filename
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="Edited file not found")
    return FileResponse(filepath, media_type="video/mp4")


@app.get("/edit-history/{original_filename}")
async def edit_history(original_filename: str):
    """List all edited versions of an original file."""
    stem = Path(original_filename).stem
    versions = []
    for f in sorted(EDITED_DIR.iterdir()):
        if f.is_file() and f.name.startswith(stem):
            versions.append({
                "filename": f.name,
                "size_mb": round(f.stat().st_size / (1024 * 1024), 2),
                "url": f"/edited/{f.name}",
            })
    return {"original": original_filename, "versions": versions}


@app.get("/files")
async def list_files():
    """List all uploaded and edited files."""
    uploads = [f.name for f in UPLOADS_DIR.iterdir() if f.is_file()]
    edited = [f.name for f in EDITED_DIR.iterdir() if f.is_file()]
    return {"uploads": uploads, "edited": edited}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

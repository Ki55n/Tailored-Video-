"""
Setup Demo Assets
Run this script to generate the 'dummy' files for the demo mode.
It uses ffmpeg to create `video_trim.mp4` and `video_B&W.mp4` from an uploaded `video.mp4`.
"""
import os
import subprocess
import shutil
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
UPLOADS_DIR = BASE_DIR / "uploads"
EDITED_DIR = BASE_DIR / "edited"

EDITED_DIR.mkdir(exist_ok=True)

# Find input video
input_video = UPLOADS_DIR / "video.mp4"

def check_video():
    if not input_video.exists():
        # Try finding ANY mp4 if video.mp4 is missing
        mp4s = list(UPLOADS_DIR.glob("*.mp4"))
        if mp4s:
            print(f"🔄 'video.mp4' not found, using '{mp4s[0].name}' instead...")
            shutil.copy(mp4s[0], input_video)
        else:
            print("❌ No video found in 'server/uploads/'. Please upload a video first!")
            return False
    return True

def run_ffmpeg(cmd):
    try:
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return True
    except subprocess.CalledProcessError:
        return False

def main():
    if not check_video():
        return

    print(f"🎬 Generating demo assets from '{input_video.name}'...")

    # 1. Trim (20s)
    trim_out = EDITED_DIR / "video_trim.mp4"
    if not trim_out.exists():
        print("✂️  Generating 'video_trim.mp4' (20s)...")
        # -y overwrite, -SS 0 -t 20 length
        cmd = ["ffmpeg", "-y", "-i", str(input_video), "-t", "20", "-c:v", "libx264", "-c:a", "aac", str(trim_out)]
        if run_ffmpeg(cmd):
            print("   ✅ Done.")
        else:
            print("   ❌ Failed to trim.")
    else:
        print("   ✅ 'video_trim.mp4' already exists.")

    # 2. B&W (from Trim)
    bw_out = EDITED_DIR / "video_B&W.mp4"
    if trim_out.exists() and not bw_out.exists():
        print("🎨 Generating 'video_B&W.mp4' (Grayscale)...")
        cmd = ["ffmpeg", "-y", "-i", str(trim_out), "-vf", "hue=s=0", "-c:a", "copy", str(bw_out)]
        if run_ffmpeg(cmd):
            print("   ✅ Done.")
        else:
            print("   ❌ Failed to apply B&W.")
    elif bw_out.exists():
        print("   ✅ 'video_B&W.mp4' already exists.")

    # 3. Hindi (Mock - Copy B&W)
    hindi_out = EDITED_DIR / "video_hindi.mp4"
    if bw_out.exists() and not hindi_out.exists():
        print("🗣️  Generating 'video_hindi.mp4' (Mock Translation)...")
        shutil.copy(bw_out, hindi_out)
        print("   ✅ Done.")
    elif hindi_out.exists():
         print("   ✅ 'video_hindi.mp4' already exists.")

    print("\n✨ Demo assets ready in 'server/edited/'!")

if __name__ == "__main__":
    main()

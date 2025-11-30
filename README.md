# Buttercut - Video Editor

A video editing app that lets you add overlays (images, videos, text) to your videos.

## What You Need

- **Python 3.9+** - [Download here](https://www.python.org/downloads/)
- **Node.js 16+** - [Download here](https://nodejs.org/)
- **FFmpeg** - Required for video processing
  - macOS: `brew install ffmpeg`
  - Windows: Download from [ffmpeg.org](https://ffmpeg.org/download.html)
  - Linux: `sudo apt-get install ffmpeg`

## Quick Start

### 1. Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

Backend runs on **http://localhost:8000**

### 2. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npx expo start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator  
- Press `w` for web browser
- Scan QR code with Expo Go app on your phone

## That's It! 🎉

Both servers should now be running. Open http://localhost:8000 in your browser to verify the backend is working.

## Need Help?

- **Backend not starting?** Make sure FFmpeg is installed: `ffmpeg -version`
- **Frontend can't connect?** Check that backend is running on port 8000
- **Using a phone?** Update `frontend/src/utils/constants.js` with your computer's IP address instead of `localhost`

## Project Structure

```
buttercut/
├── backend/     # Python API server
├── frontend/   # React Native app
└── README.md
```

For API documentation, visit http://localhost:8000/docs when the backend is running.

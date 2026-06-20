#!/bin/bash
echo "🚀 Starting Intelligent Resume Analyzer Backend..."
cd "$(dirname "$0")"
pip install -r requirements.txt -q
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload

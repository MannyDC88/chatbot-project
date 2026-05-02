@echo off
echo ========================================
echo   Starting Chatbot Server...
echo ========================================
echo.
echo The chatbot will open in your browser shortly.
echo.
echo Server running at: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

cd /d "%~dp0"
start http://localhost:8000
python -m http.server 8000


pause
python -m http.server 8000
python -m http.server 8000

@REM Made with Bob

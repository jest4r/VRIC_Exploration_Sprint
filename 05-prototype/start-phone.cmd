@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Can Node.js 24 tro len de chay prototype.
  pause
  exit /b 1
)
node --env-file-if-exists=.env phone-server.mjs
pause

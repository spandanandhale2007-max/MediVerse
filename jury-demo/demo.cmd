@echo off
rem MediVerse demo, for any terminal: the walkthrough section by section,
rem then an interactive prompt. Double-click, or run  .\demo.cmd
cd /d "%~dp0"
node run.js --step
echo.
echo ---- now ask it a question yourself ----
echo.
node ask.js

@echo off
echo FusionWW Python Test Runner
echo ==========================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo Failed to install dependencies
    pause
    exit /b 1
)

REM Install Playwright browsers
echo Installing Playwright browsers...
playwright install
if errorlevel 1 (
    echo Failed to install Playwright browsers
    pause
    exit /b 1
)

REM Run tests
echo Running tests...
if "%1"=="" (
    pytest -v
) else (
    pytest %1 -v
)

if errorlevel 1 (
    echo Tests failed
    pause
    exit /b 1
)

echo All tests completed successfully!
pause



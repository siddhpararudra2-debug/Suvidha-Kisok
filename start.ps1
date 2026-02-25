# SUVIDHA Kiosk - Start Script
# Starts portable PostgreSQL + Dev Server

$pgDir = "C:\Users\hiren\pgsql\pgsql\bin"
$pgData = "C:\Users\hiren\pgsql\data"
$pgLog = "C:\Users\hiren\pgsql\logfile.log"
$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  SUVIDHA Kiosk - Starting Up" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Start PostgreSQL if not already running
Write-Host "`n[1/2] Starting PostgreSQL..." -ForegroundColor Yellow
$pgRunning = & "$pgDir\pg_ctl.exe" -D "$pgData" status 2>&1
if ($pgRunning -match "server is running") {
    Write-Host "  PostgreSQL already running!" -ForegroundColor Green
} else {
    & "$pgDir\pg_ctl.exe" -D "$pgData" -l "$pgLog" start
    Start-Sleep -Seconds 2
    Write-Host "  PostgreSQL started!" -ForegroundColor Green
}

# Start the dev server
Write-Host "`n[2/2] Starting Suvidha Kiosk Dev Server..." -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost:3000/Suvidha-Kisok/" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:4000" -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C to stop.`n" -ForegroundColor Gray

Set-Location $projectDir
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run dev

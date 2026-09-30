Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Iniciando Backend FastAPI - NovaMart Enterprise BFF     " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot\backend"
& ".\venv\Scripts\Activate.ps1"
uvicorn app.main:app --reload --port 8000 --host 0.0.0.0

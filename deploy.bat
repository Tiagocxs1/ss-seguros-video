@echo off
REM Deploy script for Google Cloud (Windows)
REM Usage: deploy.bat [PROJECT_ID] [BUCKET_NAME]

setlocal enabledelayedexpansion

set PROJECT_ID=%1
set BUCKET_NAME=%2

if "%PROJECT_ID%"=="" (
    for /f "tokens=*" %%i in ('gcloud config get-value project 2^>nul') do set PROJECT_ID=%%i
)

if "%BUCKET_NAME%"=="" (
    set BUCKET_NAME=%PROJECT_ID%-renders
)

echo ==========================================
echo Deploying ss-seguros-video to Google Cloud
echo Project: %PROJECT_ID%
echo Bucket: %BUCKET_NAME%
echo ==========================================

if "%PROJECT_ID%"=="" (
    echo ERROR: No project ID set. Run: gcloud config set project SEU_PROJECT_ID
    exit /b 1
)

echo Enabling required APIs...
gcloud services enable cloudbuild.googleapis.com run.googleapis.com artifactregistry.googleapis.com storage.googleapis.com --project=%PROJECT_ID%

echo Checking/creating bucket: gs://%BUCKET_NAME%
gsutil ls -b gs://%BUCKET_NAME% 2>nul || gsutil mb -p %PROJECT_ID% -l us-central1 gs://%BUCKET_NAME%

echo Making bucket public (optional)...
gsutil iam ch allUsers:objectViewer gs://%BUCKET_NAME%

REM Update cloudbuild.yaml with actual bucket name
powershell -Command "(Get-Content cloudbuild.yaml) -replace 'SEU_BUCKET', '%BUCKET_NAME%' | Set-Content cloudbuild.yaml -Encoding utf8"

echo Submitting Cloud Build...
gcloud builds submit --config=cloudbuild.yaml --project=%PROJECT_ID% --region=us-central1 --timeout=7200

echo.
echo ==========================================
echo Deploy submitted! Check status at:
echo https://console.cloud.google.com/cloud-build/builds?project=%PROJECT_ID%
echo.
echo Video will be at: gs://%BUCKET_NAME%/ss-seguros-reel.mp4
echo Public URL (if bucket public): https://storage.googleapis.com/%BUCKET_NAME%/ss-seguros-reel.mp4
echo ==========================================
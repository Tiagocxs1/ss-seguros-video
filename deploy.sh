#!/bin/bash
# Deploy script for Google Cloud
# Usage: ./deploy.sh [PROJECT_ID] [BUCKET_NAME]

set -e

PROJECT_ID="${1:-$(gcloud config get-value project)}"
BUCKET_NAME="${2:-${PROJECT_ID}-renders}"

echo "=========================================="
echo "Deploying ss-seguros-video to Google Cloud"
echo "Project: $PROJECT_ID"
echo "Bucket: $BUCKET_NAME"
echo "=========================================="

# Check if project is set
if [ -z "$PROJECT_ID" ]; then
  echo "ERROR: No project ID set. Run: gcloud config set project SEU_PROJECT_ID"
  exit 1
done

# Enable required APIs
echo "Enabling required APIs..."
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  storage.googleapis.com \
  --project="$PROJECT_ID"

# Create bucket if not exists
echo "Checking/creating bucket: gs://$BUCKET_NAME"
gsutil ls -b "gs://$BUCKET_NAME" 2>/dev/null || gsutil mb -p "$PROJECT_ID" -l us-central1 "gs://$BUCKET_NAME"

# Make bucket public for video access (optional)
gsutil iam ch allUsers:objectViewer "gs://$BUCKET_NAME"

# Update cloudbuild.yaml with actual bucket name
sed -i "s|SEU_BUCKET|$BUCKET_NAME|g" cloudbuild.yaml

echo "Submitting Cloud Build..."
gcloud builds submit \
  --config=cloudbuild.yaml \
  --project="$PROJECT_ID" \
  --region=us-central1 \
  --timeout=7200

echo ""
echo "=========================================="
echo "Deploy submitted! Check status at:"
echo "https://console.cloud.google.com/cloud-build/builds?project=$PROJECT_ID"
echo ""
echo "Video will be at: gs://$BUCKET_NAME/ss-seguros-reel.mp4"
echo "Public URL (if bucket public): https://storage.googleapis.com/$BUCKET_NAME/ss-seguros-reel.mp4"
echo "=========================================="
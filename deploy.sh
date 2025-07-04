#!/bin/bash

# Deployment script for Desi Cloud Job Title Generator

# Set variables
STACK_NAME="desi-cloud-job-generator"
REGION="us-east-1"
S3_BUCKET="desi-cloud-jobs-deployment"
S3_PREFIX="deployments"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment of Desi Cloud Job Title Generator...${NC}"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if SAM CLI is installed
if ! command -v sam &> /dev/null; then
    echo -e "${RED}AWS SAM CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Create deployment bucket if it doesn't exist
echo -e "${YELLOW}Checking if deployment bucket exists...${NC}"
if ! aws s3api head-bucket --bucket $S3_BUCKET 2>/dev/null; then
    echo -e "${YELLOW}Creating deployment bucket...${NC}"
    aws s3 mb s3://$S3_BUCKET --region $REGION
fi

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

# Build the SAM application
echo -e "${YELLOW}Building the SAM application...${NC}"
sam build

# Deploy the SAM application
echo -e "${YELLOW}Deploying the SAM application...${NC}"
sam deploy \
    --stack-name $STACK_NAME \
    --s3-bucket $S3_BUCKET \
    --s3-prefix $S3_PREFIX \
    --region $REGION \
    --capabilities CAPABILITY_IAM \
    --no-fail-on-empty-changeset

# Get the outputs
echo -e "${YELLOW}Getting deployment outputs...${NC}"
API_URL=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION --query "Stacks[0].Outputs[?OutputKey=='ApiUrl'].OutputValue" --output text)
WEBSITE_URL=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION --query "Stacks[0].Outputs[?OutputKey=='WebsiteUrl'].OutputValue" --output text)
CLOUDFRONT_URL=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION --query "Stacks[0].Outputs[?OutputKey=='CloudFrontUrl'].OutputValue" --output text)

# Update the browser config with the API URL
echo -e "${YELLOW}Updating browser-config.js with API URL...${NC}"
sed -i "s|window.apiEndpoint = '.*';|window.apiEndpoint = '$API_URL';|" browser-config.js

# Upload the static files to S3
echo -e "${YELLOW}Uploading static files to S3...${NC}"
S3_BUCKET_NAME=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION --query "Stacks[0].Outputs[?OutputKey=='WebsiteUrl'].OutputValue" --output text | sed 's/http:\/\///' | sed 's/\.s3-website-.*//')

aws s3 sync . s3://$S3_BUCKET_NAME \
    --exclude "*.git*" \
    --exclude "node_modules/*" \
    --exclude "template.yaml" \
    --exclude "deploy.sh" \
    --exclude "*.md" \
    --exclude "package*.json" \
    --exclude "samconfig.toml" \
    --exclude ".aws-sam/*"

# Print the URLs
echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}API URL: ${NC}$API_URL"
echo -e "${GREEN}Website URL: ${NC}$WEBSITE_URL"
echo -e "${GREEN}CloudFront URL: ${NC}$CLOUDFRONT_URL"

echo -e "${YELLOW}Note: It may take a few minutes for the CloudFront distribution to be fully deployed.${NC}"

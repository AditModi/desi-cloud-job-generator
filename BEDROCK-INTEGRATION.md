# AWS Bedrock Integration Guide

This guide explains how to set up and use AWS Bedrock integration with the Desi Cloud Job Title Generator.

## Prerequisites

1. **AWS Account**: You need an AWS account with access to AWS Bedrock
2. **AWS CLI**: Install and configure the AWS CLI
3. **Node.js**: Version 18 or higher
4. **AWS SAM CLI**: For deploying the serverless application

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure AWS Credentials

```bash
aws configure
```

Enter your AWS Access Key ID, Secret Access Key, and default region (e.g., us-east-1).

### 3. Enable AWS Bedrock Access

1. Go to the AWS Console
2. Navigate to Amazon Bedrock
3. Click on "Model access"
4. Request access to the Claude 3 Haiku model
5. Wait for approval (usually immediate)

### 4. Update Configuration

Edit the `config.js` file to match your AWS region and preferences:

```javascript
// AWS Configuration
const AWS_CONFIG = {
    // AWS Region for Bedrock
    region: 'us-east-1',  // Change to your region
    
    // Bedrock model settings
    bedrock: {
        modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
        maxTokens: 500,
        temperature: 0.8
    }
};
```

### 5. Test Locally

For local testing, set the environment to development in `config.js`:

```javascript
const ENV = {
    NODE_ENV: 'development',
    FEATURES: {
        ENABLE_BEDROCK: true,
        USE_MOCK_IN_DEV: true  // Set to false to use actual Bedrock API
    }
};
```

## Deployment to AWS

### Option 1: Using the Deployment Script

The easiest way to deploy is using the provided script:

```bash
./deploy.sh
```

This will:
1. Create a deployment S3 bucket if needed
2. Build the SAM application
3. Deploy the CloudFormation stack
4. Upload static files to S3
5. Update the browser configuration with the API URL

### Option 2: Manual Deployment

#### 1. Build and Deploy the Backend

```bash
# Build the SAM application
sam build

# Deploy the SAM application
sam deploy --guided
```

Follow the prompts to complete the deployment.

#### 2. Update the Browser Configuration

After deployment, update the `browser-config.js` file with your API Gateway URL:

```javascript
window.apiEndpoint = 'https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/Prod/generate';
```

#### 3. Upload Static Files to S3

```bash
# Get the S3 bucket name from CloudFormation outputs
S3_BUCKET_NAME=$(aws cloudformation describe-stacks --stack-name desi-cloud-job-generator --query "Stacks[0].Outputs[?OutputKey=='WebsiteUrl'].OutputValue" --output text | sed 's/http:\/\///' | sed 's/\.s3-website-.*//')

# Upload files
aws s3 sync . s3://$S3_BUCKET_NAME \
    --exclude "*.git*" \
    --exclude "node_modules/*" \
    --exclude "template.yaml" \
    --exclude "deploy.sh" \
    --exclude "*.md" \
    --exclude "package*.json" \
    --exclude "samconfig.toml" \
    --exclude ".aws-sam/*"
```

## Usage

1. Open the application in your browser
2. Fill out the form
3. Check the "Use AI-powered generation (AWS Bedrock)" checkbox
4. Click "Generate My Desi Job Title"

The application will call the AWS Lambda function, which will use AWS Bedrock to generate a creative job title and description.

## Troubleshooting

### Common Issues

1. **Access Denied to Bedrock**:
   - Ensure you've enabled access to the Claude 3 Haiku model
   - Check that your IAM role has the `bedrock:InvokeModel` permission

2. **CORS Errors**:
   - Verify that the API Gateway CORS configuration is correct
   - Check that the Lambda function returns the proper CORS headers

3. **Lambda Timeout**:
   - Increase the Lambda timeout in the CloudFormation template
   - Bedrock API calls might take longer than expected

### Debugging

1. **Check CloudWatch Logs**:
   ```bash
   aws logs describe-log-groups --log-group-name-prefix /aws/lambda/desi-cloud-job-generator
   ```

2. **Test the Lambda Function Directly**:
   ```bash
   aws lambda invoke --function-name desi-cloud-job-generator-JobTitleGeneratorFunction-XXXX --payload '{"body": "{\"name\":\"Test User\",\"cloudService\":\"Serverless\",\"workStyle\":\"Jugaadu\",\"superpower\":\"Can fix WiFi with jugaad\"}"}' output.json
   ```

3. **Enable Debug Mode in Browser**:
   Edit `browser-config.js` and set `window.features.showDebugInfo = true;`

## Cost Considerations

AWS Bedrock pricing is based on the number of input and output tokens. The Claude 3 Haiku model is one of the more cost-effective options, but you should still monitor your usage.

Estimated cost per 1,000 job title generations:
- Input tokens: ~200 tokens per request
- Output tokens: ~50 tokens per response
- Total: ~250 tokens per generation
- Cost: Check the [AWS Bedrock pricing page](https://aws.amazon.com/bedrock/pricing/) for current rates

## Security Best Practices

1. **IAM Permissions**: Use the principle of least privilege
2. **API Gateway**: Consider adding authentication
3. **CloudFront**: Enable WAF for additional security
4. **Environment Variables**: Store sensitive information in AWS Secrets Manager

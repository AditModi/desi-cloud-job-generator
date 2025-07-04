// AWS Deployment Configuration for Desi Cloud Job Title Generator

// Import the AWS integration functions
const { generateJobTitleWithBedrock } = require('./aws-integration');

/**
 * AWS Lambda function for serverless deployment
 * This can be deployed as a Lambda function to handle the job title generation
 */
exports.lambdaHandler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };
    
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }
    
    try {
        const userData = JSON.parse(event.body);
        const result = await generateJobTitleWithBedrock(userData);
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result)
        };
    } catch (error) {
        console.error('Lambda error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};

/**
 * CloudFormation template for AWS deployment
 */
exports.cloudFormationTemplate = `
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: Desi Cloud Job Title Generator

Resources:
  JobTitleGeneratorFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/
      Handler: aws-deployment.lambdaHandler
      Runtime: nodejs18.x
      Timeout: 30
      Events:
        Api:
          Type: Api
          Properties:
            Path: /generate
            Method: post
      Environment:
        Variables:
          BEDROCK_REGION: !Ref AWS::Region
      Policies:
        - Version: '2012-10-17'
          Statement:
            - Effect: Allow
              Action:
                - bedrock:InvokeModel
              Resource: '*'

  JobTitleGeneratorBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub 'desi-cloud-jobs-\${AWS::AccountId}'
      WebsiteConfiguration:
        IndexDocument: index.html
      PublicAccessBlockConfiguration:
        BlockPublicAcls: false
        BlockPublicPolicy: false
        IgnorePublicAcls: false
        RestrictPublicBuckets: false

  BucketPolicy:
    Type: AWS::S3::BucketPolicy
    Properties:
      Bucket: !Ref JobTitleGeneratorBucket
      PolicyDocument:
        Statement:
          - Effect: Allow
            Principal: '*'
            Action: s3:GetObject
            Resource: !Sub '\${JobTitleGeneratorBucket}/*'

Outputs:
  ApiUrl:
    Description: API Gateway endpoint URL
    Value: !Sub 'https://\${ServerlessRestApi}.execute-api.\${AWS::Region}.amazonaws.com/Prod/generate'
  
  WebsiteUrl:
    Description: S3 website URL
    Value: !GetAtt JobTitleGeneratorBucket.WebsiteURL
`;

/**
 * Instructions for implementing AWS Bedrock integration
 */
exports.bedrockImplementationGuide = `
# AWS Bedrock Integration Guide

To fully implement AWS Bedrock integration for the Desi Cloud Job Title Generator, follow these steps:

## 1. Set Up AWS Credentials

Ensure you have AWS credentials configured with permissions to access AWS Bedrock:

\`\`\`bash
aws configure
\`\`\`

## 2. Install AWS SDK for JavaScript

\`\`\`bash
npm install @aws-sdk/client-bedrock-runtime
\`\`\`

## 3. Update aws-integration.js

Replace the mock implementation of \`callBedrockAPI\` with the actual AWS SDK call:

\`\`\`javascript
const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

async function callBedrockAPI(prompt, userData) {
    const client = new BedrockRuntimeClient({ region: AWS_CONFIG.region });
    
    const input = {
        modelId: BEDROCK_CONFIG.modelId,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: BEDROCK_CONFIG.maxTokens,
            temperature: BEDROCK_CONFIG.temperature,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        })
    };
    
    try {
        const command = new InvokeModelCommand(input);
        const response = await client.send(command);
        
        // Parse the response
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        return responseBody.content[0].text;
    } catch (error) {
        console.error("Error calling Bedrock:", error);
        throw error;
    }
}
\`\`\`

## 4. Deploy to AWS

### Option 1: Deploy as a Static Site with API Gateway + Lambda

1. Create the Lambda function:

\`\`\`bash
# Create a deployment package
mkdir -p deployment
cp index.html styles.css script.js aws-integration.js aws-deployment.js deployment/
cd deployment
npm init -y
npm install @aws-sdk/client-bedrock-runtime
zip -r ../deployment.zip .
cd ..

# Create the Lambda function
aws lambda create-function \\
  --function-name DesiCloudJobGenerator \\
  --runtime nodejs18.x \\
  --handler aws-deployment.lambdaHandler \\
  --zip-file fileb://deployment.zip \\
  --role arn:aws:iam::<your-account-id>:role/lambda-bedrock-role
\`\`\`

2. Create API Gateway endpoint and connect to Lambda

### Option 2: Use AWS SAM

1. Save the CloudFormation template to \`template.yaml\`
2. Deploy with SAM:

\`\`\`bash
sam build
sam deploy --guided
\`\`\`

## 5. Update Frontend Configuration

Update the AWS_CONFIG object in aws-integration.js with your API endpoint:

\`\`\`javascript
const AWS_CONFIG = {
    region: 'us-east-1',
    apiEndpoint: 'https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/Prod/generate'
};
\`\`\`

## 6. Test the Integration

Use the toggle in the UI to test both the template-based generation and the AWS Bedrock integration.
`;

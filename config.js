// Configuration for Desi Cloud Job Title Generator

// Environment settings
const ENV = {
    // Set to 'development' for local testing, 'production' for deployment
    NODE_ENV: 'development',
    
    // Feature flags
    FEATURES: {
        ENABLE_BEDROCK: true,  // Set to false to disable Bedrock integration
        USE_MOCK_IN_DEV: true  // Use mock responses in development mode
    }
};

// AWS Configuration
const AWS_CONFIG = {
    // AWS Region for Bedrock
    region: 'us-east-1',
    
    // API Gateway endpoint (if using Lambda)
    apiEndpoint: '',
    
    // Bedrock model settings
    bedrock: {
        modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
        maxTokens: 500,
        temperature: 0.8
    }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ENV,
        AWS_CONFIG
    };
}
